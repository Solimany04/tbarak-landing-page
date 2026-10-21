#!/usr/bin/env node
/**
 * PageSpeed Insights (mobile) for any public URL, several runs, medians.
 *
 *   npm run perf:psi -- https://tbarak.org/ar https://tbarak.org/en
 *   npm run perf:psi -- --runs 5 https://<preview>.pages.dev/ar
 *
 * Uses the public PSI v5 API. Without a key it shares an anonymous quota and
 * may answer 429; set PSI_API_KEY to use your own. Runs are sequential, since
 * PSI serves a cached result for identical requests made seconds apart.
 * Raw responses go to perf-reports/ (gitignored).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
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
const urls = args._;
if (!urls.length) {
  console.error('Usage: npm run perf:psi -- [--runs 5] [--label name] <url> [url...]');
  process.exit(1);
}

async function runPsi(url) {
  const api = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  api.searchParams.set('url', url);
  api.searchParams.set('strategy', 'mobile');
  api.searchParams.set('category', 'performance');
  if (process.env.PSI_API_KEY) api.searchParams.set('key', process.env.PSI_API_KEY);

  for (let attempt = 1; ; attempt++) {
    const res = await fetch(api);
    if (res.ok) return res.json();
    const body = await res.text();
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      console.log(`  PSI answered ${res.status}, retrying in ${attempt * 20} s...`);
      await new Promise((r) => setTimeout(r, attempt * 20_000));
      continue;
    }
    throw new Error(`PSI ${res.status} for ${url}: ${body.slice(0, 300)}`);
  }
}

const reportDir = await makeReportDir('psi', args.label);
const results = {};

for (const url of urls) {
  results[url] = [];
  for (let i = 1; i <= runs; i++) {
    const data = await runPsi(url);
    const metrics = metricsFromLhr(data.lighthouseResult);
    results[url].push(metrics);
    const name = `${new URL(url).pathname.replace(/\W+/g, '') || 'root'}-${i}.json`;
    await fs.writeFile(path.join(reportDir, name), JSON.stringify(data));
    console.log(
      `${url} run ${i}/${runs}: score ${metrics.score}, LCP ${(metrics.lcp / 1000).toFixed(1)} s, ` +
        `SI ${(metrics.si / 1000).toFixed(1)} s, TBT ${Math.round(metrics.tbt)} ms`,
    );
  }
}

const summaries = Object.fromEntries(Object.entries(results).map(([u, r]) => [u, summarize(r)]));
await fs.writeFile(
  path.join(reportDir, 'summary.json'),
  JSON.stringify({ label: args.label ?? null, date: new Date().toISOString(), summaries, runs: results }, null, 2),
);
printTable(summaries);
console.log(`Reports: ${path.relative(root, reportDir)}`);
