#!/usr/bin/env node
/**
 * Local performance check: build, serve out/ like Cloudflare Pages, run
 * Lighthouse (mobile, default simulated throttling) several times per page and
 * print the medians.
 *
 *   npm run perf                          # build + 3 runs each on /ar and /en
 *   npm run perf -- --no-build            # reuse the existing out/
 *   npm run perf -- --runs 5 --label fonts --paths /ar
 *
 * Raw Lighthouse JSON and a summary.json go to perf-reports/ (gitignored).
 * Needs a local Chrome/Chromium; set CHROME_PATH if it is not found.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { startServer } from './lib/static-server.mjs';
import {
  makeReportDir,
  metricsFromLhr,
  parseArgs,
  printTable,
  root,
  summarize,
} from './lib/perf-report.mjs';

const args = parseArgs(process.argv.slice(2));
const runs = Number(args.runs ?? 3);
const paths = String(args.paths ?? '/ar,/en').split(',');

if (!args['no-build']) {
  // `npm run build` (not `next build`) so the prebuild step runs too.
  const { status } = spawnSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit', shell: true });
  if (status !== 0) process.exit(status ?? 1);
}

const outDir = path.join(root, 'out');
await fs.access(path.join(outDir, 'ar.html')).catch(() => {
  console.error('out/ has no build in it; run without --no-build.');
  process.exit(1);
});

const server = await startServer({ root: outDir });
const reportDir = await makeReportDir('local', args.label);
const results = {};

try {
  for (const pagePath of paths) {
    results[pagePath] = [];
    for (let i = 1; i <= runs; i++) {
      // A fresh browser per run, so no run inherits another's cache or JIT state.
      const chrome = await chromeLauncher.launch({
        chromePath: process.env.CHROME_PATH || undefined,
        chromeFlags: ['--headless=new', '--no-first-run', '--no-default-browser-check'],
      });
      try {
        const result = await lighthouse(`${server.origin}${pagePath}`, {
          port: chrome.port,
          output: 'json',
          logLevel: 'error',
          onlyCategories: ['performance'],
        });
        const metrics = metricsFromLhr(result.lhr);
        results[pagePath].push(metrics);
        const name = `${pagePath.replace(/\W+/g, '') || 'root'}-${i}.json`;
        await fs.writeFile(path.join(reportDir, name), result.report);
        console.log(
          `${pagePath} run ${i}/${runs}: score ${metrics.score}, LCP ${(metrics.lcp / 1000).toFixed(1)} s, ` +
            `SI ${(metrics.si / 1000).toFixed(1)} s, TBT ${Math.round(metrics.tbt)} ms`,
        );
      } finally {
        await chrome.kill();
      }
    }
  }
} finally {
  await server.close();
}

const summaries = Object.fromEntries(Object.entries(results).map(([p, r]) => [p, summarize(r)]));
await fs.writeFile(
  path.join(reportDir, 'summary.json'),
  JSON.stringify({ label: args.label ?? null, date: new Date().toISOString(), summaries, runs: results }, null, 2),
);
printTable(summaries);
console.log(`Reports: ${path.relative(root, reportDir)}`);
