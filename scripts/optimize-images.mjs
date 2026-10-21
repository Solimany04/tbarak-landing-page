#!/usr/bin/env node
/**
 * Responsive AVIF/WebP variants for every raster image the page renders.
 * Runs before `next dev` and `next build` (predev/prebuild), so it also runs
 * on Cloudflare Pages, and Keystatic uploads under public/Products are picked
 * up on the next build without any extra step.
 *
 *   node scripts/optimize-images.mjs
 *
 * Input:  raster images in public/ (minus the SKIP list below)
 * Output: public/_optimized/**  <name>.<hash>-<width>.{avif,webp}
 *                               <name>.<hash>.json (AVIF verdict, see below)
 *         lib/images/manifest.json  source URL → intrinsic size + variants
 * Both outputs are gitignored. Variant names carry a hash of the source bytes
 * and the encoder settings, so they can be cached forever (public/_headers),
 * and a source whose bytes did not change is skipped on the next run.
 *
 * Widths are 640 / 1080 / 1920 and never upscaled: an image narrower than a
 * step gets one variant at its own width instead. CROPS adds art-directed
 * crops that components select with <source media>.
 */
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const OUT = '_optimized';
const outDir = path.join(publicDir, OUT);
const manifestFile = path.join(root, 'lib/images/manifest.json');

const WIDTHS = [640, 1080, 1920];
const WEBP = { quality: 78, effort: 4 };
/**
 * AVIF is only kept where it is both smaller than the WebP and keeps the
 * detail. On fine fabric weave it smooths texture away at qualities where it
 * would still be smaller (the hero kept 59% of its high-frequency detail at
 * q55 and needed q70 = 115 KB to reach 90%, while WebP q78 kept all of it at
 * 93 KB), so those images ship WebP only. Flat graphics and screenshots keep
 * everything at q55 and come out ~40% smaller than WebP.
 */
const AVIF_QUALITIES = [55, 70];
const AVIF_EFFORT = 4;
const MIN_DETAIL = 0.9;
const RASTER = /\.(png|jpe?g|webp|avif)$/i;

// Not rendered by the page: share images, PWA/manifest icons, the JSON-LD logo.
const SKIP = [/^og\//i, /^icons\/icon-/i, /^logo\.png$/i];

/**
 * Centre crops, keyed by source URL, stored as `${url}#${name}`.
 * Hero "square": below 713px the hero box is never wider than it is tall
 * (min-h-178 = 712px, width = viewport), so object-cover only ever shows the
 * central square of the 1920×929 image. Serving just that square to phones
 * is pixel-identical and a fraction of the bytes.
 */
const CROPS = {
  '/Hero.webp': { square: { aspect: 1 } },
};

const SETTINGS = JSON.stringify({ WIDTHS, WEBP, AVIF_QUALITIES, AVIF_EFFORT, MIN_DETAIL, v: 2 });

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) return full === outDir ? [] : walk(full);
      return RASTER.test(e.name) ? [full] : [];
    }),
  );
  return files.flat();
}

/** URL-safe file stem: srcset splits candidates on whitespace and commas. */
const slug = (rel) => rel.replace(/[\s,]+/g, '-');

const urlOf = (file) => `/${encodeURI(path.relative(publicDir, file).split(path.sep).join('/'))}`;

async function exists(file) {
  return fs.access(file).then(
    () => true,
    () => false,
  );
}

/** Widths to emit for an image `width` px wide. */
function targetWidths(width) {
  const below = WIDTHS.filter((w) => w < width);
  return [...below, Math.min(width, WIDTHS.at(-1))];
}

const stats = { images: 0, webpOnly: 0, encoded: 0, reused: 0, inBytes: 0, outBytes: 0 };
const keep = new Set();

/** Mean absolute Laplacian: how much fine detail (edges, texture) survives. */
async function detail(buffer) {
  const { data } = await sharp(buffer)
    .flatten({ background: '#ffffff' })
    .greyscale()
    .convolve({ width: 3, height: 3, kernel: [0, -1, 0, -1, 4, -1, 0, -1, 0], offset: 128 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  let sum = 0;
  for (const v of data) sum += Math.abs(v - 128);
  return sum / data.length;
}

/**
 * AVIF quality for this image, or null for WebP only, judged on the largest
 * variant against a lossless resize of the source. The verdict is stored next
 * to the variants so unchanged sources are not measured again.
 */
async function chooseAvifQuality(load, width, base) {
  const verdictFile = `${base}.json`;
  keep.add(verdictFile);
  if (await exists(verdictFile)) return JSON.parse(await fs.readFile(verdictFile, 'utf8')).avifQuality;

  const resized = () => load().resize({ width, withoutEnlargement: true });
  const reference = await detail(await resized().png().toBuffer());
  const webpSize = (await resized().webp(WEBP).toBuffer()).length;
  let avifQuality = null;
  for (const quality of AVIF_QUALITIES) {
    const avif = await resized().avif({ quality, effort: AVIF_EFFORT }).toBuffer();
    if (avif.length >= webpSize) break;
    if (!reference || (await detail(avif)) / reference >= MIN_DETAIL) {
      avifQuality = quality;
      break;
    }
  }
  await fs.writeFile(verdictFile, JSON.stringify({ avifQuality }));
  return avifQuality;
}

/**
 * Encodes one (possibly cropped) image. `load` returns a fresh, already
 * oriented sharp pipeline each time it is called.
 */
async function variantsFor({ load, width, height, base }) {
  const widths = targetWidths(width);
  const avifQuality = await chooseAvifQuality(load, widths.at(-1), base);
  if (avifQuality === null) stats.webpOnly++;
  const formats = [
    ...(avifQuality === null ? [] : [['avif', { quality: avifQuality, effort: AVIF_EFFORT }]]),
    ['webp', WEBP],
  ];

  const variants = [];
  for (const w of widths) {
    const h = Math.round((height * w) / width);
    const entry = { width: w, height: h };
    for (const [format, options] of formats) {
      const file = `${base}-${w}.${format}`;
      keep.add(file);
      if (await exists(file)) {
        stats.reused++;
      } else {
        await load().resize({ width: w, withoutEnlargement: true })[format](options).toFile(file);
        stats.encoded++;
      }
      // Read first: `stats.x += await …` would race across concurrent images.
      const { size } = await fs.stat(file);
      stats.outBytes += size;
      entry[format] = urlOf(file);
    }
    variants.push(entry);
  }
  return variants;
}

async function processImage(file, manifest) {
  const rel = path.relative(publicDir, file).split(path.sep).join('/');
  if (SKIP.some((re) => re.test(rel))) return;

  const input = await fs.readFile(file);
  const hash = crypto.createHash('sha256').update(SETTINGS).update(input).digest('hex').slice(0, 10);
  const meta = await sharp(input).metadata();
  // Extensions can lie (an SVG saved as .png); vectors stay as they are.
  if (!['jpeg', 'png', 'webp', 'avif', 'heif'].includes(meta.format)) return;
  // EXIF orientations 5-8 are rotated by 90°, so width and height swap.
  const rotated = (meta.orientation ?? 1) >= 5;
  const width = rotated ? meta.height : meta.width;
  const height = rotated ? meta.width : meta.height;
  if (!width || !height) return;

  const stem = slug(rel.replace(/\.[^.]+$/, ''));
  const base = path.join(outDir, `${stem}.${hash}`);
  await fs.mkdir(path.dirname(base), { recursive: true });

  const url = urlOf(file);
  const load = () => sharp(input).rotate();
  manifest[url] = { width, height, variants: await variantsFor({ load, width, height, base }) };
  stats.images++;
  stats.inBytes += input.length;

  for (const [name, { aspect }] of Object.entries(CROPS[url] ?? {})) {
    const cropW = Math.min(width, Math.round(height * aspect));
    const cropH = Math.min(height, Math.round(cropW / aspect));
    const region = {
      left: Math.round((width - cropW) / 2),
      top: Math.round((height - cropH) / 2),
      width: cropW,
      height: cropH,
    };
    manifest[`${url}#${name}`] = {
      width: cropW,
      height: cropH,
      variants: await variantsFor({
        load: () => sharp(input).rotate().extract(region),
        width: cropW,
        height: cropH,
        base: `${base}-${name}`,
      }),
    };
  }
}

/** Deletes variants no source produces any more (renamed/removed/re-encoded). */
async function prune(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await prune(full);
      if (!(await fs.readdir(full)).length) await fs.rmdir(full);
    } else if (!keep.has(full)) {
      await fs.rm(full);
    }
  }
}

const started = Date.now();
await fs.mkdir(outDir, { recursive: true });
const manifest = {};
const files = (await walk(publicDir)).sort();
// A few images at a time: sharp already spreads each encode over libuv threads.
for (let i = 0; i < files.length; i += 4) {
  await Promise.all(files.slice(i, i + 4).map((f) => processImage(f, manifest)));
}
await prune(outDir);

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await fs.mkdir(path.dirname(manifestFile), { recursive: true });
await fs.writeFile(manifestFile, `${JSON.stringify({ images: sorted }, null, 2)}\n`);

const kb = (n) => `${Math.round(n / 1024)} KB`;
console.log(
  `optimize-images: ${stats.images} images (${stats.webpOnly} variant sets WebP-only), ` +
    `${stats.encoded} files encoded, ${stats.reused} reused; ${kb(stats.inBytes)} of sources, ` +
    `${kb(stats.outBytes)} of variants; ${((Date.now() - started) / 1000).toFixed(1)} s`,
);
