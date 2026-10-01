#!/usr/bin/env node
/**
 * Regenerates the static brand assets the site ships with. Nothing here runs
 * at build or request time — the outputs are committed.
 *
 *   node scripts/generate-brand-assets.mjs            # icons + logo (sharp only)
 *   npx -y -p puppeteer node scripts/generate-brand-assets.mjs --og
 *                                                     # …plus the 1200×630 OG images
 *
 * Inputs:  app/icon.png (512×512 brand mark), public/vector.svg (wordmark),
 *          public/Hero.webp, messages/{ar,en}.json → meta.ogHeadline / ogTagline
 * Outputs: app/favicon.ico, app/apple-icon.png, public/logo.png,
 *          public/icons/icon-{192,512}.png, public/icons/icon-maskable-512.png,
 *          public/og/og-{ar,en}.png (with --og)
 *
 * OG rendering needs a Chromium. `npx -p puppeteer` downloads one; to reuse an
 * installed browser set CHROME_PATH (and PUPPETEER_MODULE if only
 * puppeteer-core is available). Fonts load from Google Fonts unless
 * OG_FONT_CSS_FILE points to a local @font-face stylesheet.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = (...s) => path.join(root, ...s);

// The mark's circle colour in app/icon.png — used to fill opaque variants.
const MARK_BG = '#F68A4A';
const PRIMARY = '#1D3535';
const ACCENT = '#F58B4D';

async function ensureDir(file) {
  await fs.mkdir(path.dirname(file), { recursive: true });
}

/** ICO container holding PNG frames (supported by every current browser). */
function encodeIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((x) => x.data)]);
}

async function icons() {
  const src = p('app/icon.png');
  const out = async (file, pipeline) => {
    await ensureDir(file);
    await pipeline.png({ compressionLevel: 9 }).toFile(file);
    console.log('  wrote', path.relative(root, file));
  };

  // Transparent round mark: favicon, manifest "any" icons, Organization logo.
  await out(p('public/logo.png'), sharp(src).resize(512, 512));
  await out(p('public/icons/icon-512.png'), sharp(src).resize(512, 512));
  await out(p('public/icons/icon-192.png'), sharp(src).resize(192, 192));

  // Opaque full-bleed variants: iOS paints transparency black, and maskable
  // icons are cropped to a circle/squircle, so fill to the edges.
  await out(p('app/apple-icon.png'), sharp(src).resize(180, 180).flatten({ background: MARK_BG }));
  await out(p('public/icons/icon-maskable-512.png'), sharp(src).resize(512, 512).flatten({ background: MARK_BG }));

  const frames = [];
  // 32px first: Next reads the first frame for the <link sizes> attribute.
  for (const size of [32, 16, 48]) {
    frames.push({ size, data: await sharp(src).resize(size, size).png().toBuffer() });
  }
  await fs.writeFile(p('app/favicon.ico'), encodeIco(frames));
  console.log('  wrote app/favicon.ico');
}

const escapeHtml = (s) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function ogHtml({ locale, headline, tagline, heroDataUri, wordmarkDataUri, fontCss }) {
  const rtl = locale === 'ar';
  const parts = tagline.split('·').map((s) => s.trim());
  return `<!doctype html>
<html lang="${locale}" dir="${rtl ? 'rtl' : 'ltr'}">
<head>
<meta charset="utf-8">
${fontCss ? `<style>${fontCss}</style>` : '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=block">'}
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; }
  body {
    font-family: 'IBM Plex Sans Arabic', sans-serif;
    color: #fff;
    background: ${PRIMARY} url('${heroDataUri}') center / cover no-repeat;
    position: relative;
    overflow: hidden;
  }
  .shade {
    position: absolute; inset: 0;
    background: linear-gradient(${rtl ? '270deg' : '90deg'},
      rgba(29,53,53,.97) 0%, rgba(29,53,53,.92) 48%, rgba(29,53,53,.55) 100%);
  }
  .glow {
    position: absolute; width: 360px; height: 360px; border-radius: 50%;
    background: ${ACCENT}; opacity: .35; filter: blur(140px);
    ${rtl ? 'left' : 'right'}: 80px; bottom: -120px;
  }
  .content {
    position: absolute; inset: 0; padding: 72px 80px;
    display: flex; flex-direction: column; justify-content: space-between;
    align-items: flex-start;
  }
  .wordmark { height: 92px; width: auto; }
  h1 {
    font-weight: 600; font-size: ${rtl ? 64 : 58}px; line-height: 1.25;
    max-width: 760px; letter-spacing: ${rtl ? 0 : '-0.02em'};
  }
  .bar { width: 96px; height: 6px; border-radius: 3px; background: ${ACCENT}; margin-bottom: 28px; }
  ul { list-style: none; display: flex; gap: 14px; margin-top: 30px; flex-wrap: wrap; }
  li {
    font-size: 24px; font-weight: 500; padding: 8px 20px; border-radius: 999px;
    background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18);
  }
  .domain {
    font-size: 26px; font-weight: 600; letter-spacing: .02em; direction: ltr;
    color: ${ACCENT};
  }
</style>
</head>
<body>
  <div class="shade"></div>
  <div class="glow"></div>
  <div class="content">
    <img class="wordmark" src="${wordmarkDataUri}" alt="">
    <div>
      <div class="bar"></div>
      <h1>${escapeHtml(headline)}</h1>
      <ul>${parts.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>
    </div>
    <div class="domain">tbarak.org</div>
  </div>
</body>
</html>`;
}

async function loadPuppeteer() {
  const spec = process.env.PUPPETEER_MODULE || 'puppeteer';
  try {
    const mod = await import(spec);
    return mod.default ?? mod;
  } catch {
    throw new Error(
      `Could not load "${spec}". Run with: npx -y -p puppeteer node scripts/generate-brand-assets.mjs --og`,
    );
  }
}

async function ogImages() {
  const puppeteer = await loadPuppeteer();
  const hero = await sharp(p('public/Hero.webp')).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82 }).toBuffer();
  const heroDataUri = `data:image/jpeg;base64,${hero.toString('base64')}`;
  const wordmark = await fs.readFile(p('public/vector.svg'));
  const wordmarkDataUri = `data:image/svg+xml;base64,${wordmark.toString('base64')}`;
  const fontCss = process.env.OG_FONT_CSS_FILE ? await fs.readFile(process.env.OG_FONT_CSS_FILE, 'utf8') : '';

  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: ['--no-sandbox', '--font-render-hinting=none'],
  });
  try {
    for (const locale of ['ar', 'en']) {
      const messages = JSON.parse(await fs.readFile(p(`messages/${locale}.json`), 'utf8'));
      const { ogHeadline: headline, ogTagline: tagline } = messages.meta;
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
      await page.setContent(ogHtml({ locale, headline, tagline, heroDataUri, wordmarkDataUri, fontCss }), {
        waitUntil: 'networkidle0',
      });
      await page.evaluate(() => document.fonts.ready);
      const png = await page.screenshot({ type: 'png' });
      const file = p(`public/og/og-${locale}.png`);
      await ensureDir(file);
      // Re-encode as an optimised palette-free PNG (<300 KB keeps WhatsApp/X happy).
      await sharp(png).png({ compressionLevel: 9, quality: 90, palette: true }).toFile(file);
      console.log('  wrote', path.relative(root, file));
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

console.log('Icons + logo');
await icons();
if (process.argv.includes('--og')) {
  console.log('Open Graph images');
  await ogImages();
}
