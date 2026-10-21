/**
 * Minimal static server for `out/` that behaves like Cloudflare Pages closely
 * enough for performance measurements:
 *
 *   - clean URLs: /ar serves ar.html, /dir/ serves dir/index.html
 *   - public/_redirects (exact paths and trailing /* splats)
 *   - public/_headers (path patterns with * and :placeholder segments)
 *   - brotli/gzip for text assets, as the Cloudflare edge does
 *   - 404.html for anything else
 *
 * Used by scripts/perf.mjs; also runnable on its own to preview a build:
 *   node scripts/lib/static-server.mjs [port]
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};
const COMPRESSIBLE = /^(text\/|application\/(json|xml|manifest\+json)|image\/svg\+xml)/;

/** Pages-style pattern (`/a/*`, `/:slug/x`) → RegExp. Absolute-URL rules are skipped. */
function patternToRegExp(pattern) {
  const source = pattern
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/:\w+/g, '[^/]+'))
    .join('.*');
  return new RegExp(`^${source}$`);
}

function parseHeaders(file) {
  if (!fs.existsSync(file)) return [];
  const rules = [];
  let current = null;
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    if (!/^\s/.test(raw)) {
      current = raw.startsWith('/') ? { match: patternToRegExp(raw.trim()), headers: [] } : null;
      if (current) rules.push(current);
    } else if (current) {
      const i = raw.indexOf(':');
      if (i > 0) current.headers.push([raw.slice(0, i).trim(), raw.slice(i + 1).trim()]);
    }
  }
  return rules;
}

function parseRedirects(file) {
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [from, to, status = '302'] = line.split(/\s+/);
      return { from, to, status: Number(status) };
    });
}

function matchRedirect(redirects, pathname) {
  for (const r of redirects) {
    if (r.from === pathname) return r;
    if (r.from.endsWith('/*') && pathname.startsWith(r.from.slice(0, -1))) return r;
  }
  return null;
}

/** Map a URL path to a file in `root`, Pages-style. */
function resolveFile(root, pathname) {
  const safe = path.normalize(pathname).replace(/^([/\\])+/, '');
  const base = path.join(root, safe);
  if (!base.startsWith(root)) return null;
  const candidates = pathname.endsWith('/')
    ? [path.join(base, 'index.html')]
    : [base, `${base}.html`, path.join(base, 'index.html')];
  return candidates.find((f) => fs.existsSync(f) && fs.statSync(f).isFile()) ?? null;
}

export function startServer({ root, port = 0, quiet = true } = {}) {
  root = path.resolve(root);
  const headerRules = parseHeaders(path.join(root, '_headers'));
  const redirects = parseRedirects(path.join(root, '_redirects'));
  const compressed = new Map();

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }

    const redirect = matchRedirect(redirects, pathname);
    let file;
    let status = 200;
    if (redirect && redirect.status !== 200) {
      res.writeHead(redirect.status, { Location: redirect.to }).end();
      return;
    }
    file = resolveFile(root, redirect ? redirect.to : pathname);
    if (!file) {
      file = path.join(root, '404.html');
      status = 404;
    }

    const type = MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
    const headers = { 'Content-Type': type };
    for (const rule of headerRules) {
      if (rule.match.test(pathname)) for (const [k, v] of rule.headers) headers[k] = v;
    }

    let body = fs.readFileSync(file);
    const accept = String(req.headers['accept-encoding'] ?? '');
    const encoding = /\bbr\b/.test(accept) ? 'br' : /\bgzip\b/.test(accept) ? 'gzip' : null;
    if (encoding && COMPRESSIBLE.test(type)) {
      const key = `${encoding}:${file}:${fs.statSync(file).mtimeMs}`;
      if (!compressed.has(key)) {
        compressed.set(
          key,
          encoding === 'br'
            ? zlib.brotliCompressSync(body, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } })
            : zlib.gzipSync(body, { level: 6 }),
        );
      }
      body = compressed.get(key);
      headers['Content-Encoding'] = encoding;
      headers.Vary = 'Accept-Encoding';
    }
    headers['Content-Length'] = body.length;
    res.writeHead(status, headers);
    res.end(req.method === 'HEAD' ? undefined : body);
    if (!quiet) console.log(status, req.method, pathname);
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      const { port: actual } = server.address();
      resolve({
        origin: `http://127.0.0.1:${actual}`,
        close: () => new Promise((done) => server.close(done)),
      });
    });
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../out');
  const { origin } = await startServer({ root, port: Number(process.argv[2] ?? 4173), quiet: false });
  console.log(`Serving ${root} at ${origin}`);
}
