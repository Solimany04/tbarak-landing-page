/**
 * Shared helpers for scripts/perf.mjs (local Lighthouse) and
 * scripts/perf-psi.mjs (PageSpeed Insights API): pull the headline metrics out
 * of a Lighthouse result, take medians, print the table, and write reports.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** Headline numbers from a Lighthouse result (`lhr`). Times in ms. */
export function metricsFromLhr(lhr) {
  const value = (id) => lhr.audits[id]?.numericValue ?? NaN;
  return {
    score: Math.round((lhr.categories.performance?.score ?? NaN) * 100),
    lcp: value('largest-contentful-paint'),
    si: value('speed-index'),
    fcp: value('first-contentful-paint'),
    tbt: value('total-blocking-time'),
    cls: value('cumulative-layout-shift'),
  };
}

export function median(values) {
  const sorted = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  if (!sorted.length) return NaN;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Per-metric medians of several runs, plus the score range. */
export function summarize(runs) {
  const pick = (key) => runs.map((r) => r[key]);
  const scores = pick('score');
  return {
    runs: runs.length,
    score: median(scores),
    scoreMin: Math.min(...scores),
    scoreMax: Math.max(...scores),
    lcp: median(pick('lcp')),
    si: median(pick('si')),
    fcp: median(pick('fcp')),
    tbt: median(pick('tbt')),
    cls: median(pick('cls')),
  };
}

const seconds = (ms) => (Number.isFinite(ms) ? `${(ms / 1000).toFixed(1)} s` : '-');

/** Prints `{ label: summary }` as a fixed-width table. */
export function printTable(summaries) {
  const rows = [['page', 'score', 'range', 'LCP', 'SI', 'FCP', 'TBT', 'CLS', 'runs']];
  for (const [label, s] of Object.entries(summaries)) {
    rows.push([
      label,
      String(s.score),
      `${s.scoreMin}-${s.scoreMax}`,
      seconds(s.lcp),
      seconds(s.si),
      seconds(s.fcp),
      Number.isFinite(s.tbt) ? `${Math.round(s.tbt)} ms` : '-',
      Number.isFinite(s.cls) ? s.cls.toFixed(3) : '-',
      String(s.runs),
    ]);
  }
  const widths = rows[0].map((_, i) => Math.max(...rows.map((r) => r[i].length)));
  const line = (r) => r.map((cell, i) => (i ? cell.padStart(widths[i]) : cell.padEnd(widths[i]))).join('  ');
  console.log(`\n${line(rows[0])}\n${widths.map((w) => '-'.repeat(w)).join('  ')}`);
  for (const r of rows.slice(1)) console.log(line(r));
  console.log('\nMedians per metric; "range" is the min-max performance score across runs.');
}

/** perf-reports/<timestamp>[-label]/, created on demand. */
export async function makeReportDir(prefix, label) {
  const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
  const dir = path.join(root, 'perf-reports', [prefix, stamp, label].filter(Boolean).join('-'));
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

/** `--name value` / `--flag` / positional parsing, enough for these scripts. */
export function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) args._.push(a);
    else if (a.includes('=')) args[a.slice(2, a.indexOf('='))] = a.slice(a.indexOf('=') + 1);
    else if (argv[i + 1] && !argv[i + 1].startsWith('--')) args[a.slice(2)] = argv[++i];
    else args[a.slice(2)] = true;
  }
  return args;
}
