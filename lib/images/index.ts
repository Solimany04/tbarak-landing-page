import fs from 'node:fs';
import path from 'node:path';
import type { OptimizedImageData } from './types';

export type { OptimizedImageData } from './types';

// `avif` is absent when the optimizer judged AVIF worse than WebP for this image.
type Variant = { width: number; height: number; avif?: string; webp: string };
type Entry = { width: number; height: number; variants: Variant[] };

// Written by scripts/optimize-images.mjs, which runs as predev/prebuild.
// Read with fs (not imported) so a missing file fails with a useful message.
const MANIFEST = path.join(process.cwd(), 'lib/images/manifest.json');

let manifest: Record<string, Entry> | undefined;

function load(): Record<string, Entry> {
  if (!manifest) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).images as Record<string, Entry>;
    } catch {
      throw new Error(
        'lib/images/manifest.json is missing. Build with `npm run build` (or run ' +
          '`node scripts/optimize-images.mjs` first) so the image variants exist.',
      );
    }
  }
  return manifest;
}

const srcset = (variants: Variant[], format: 'avif' | 'webp') =>
  variants.every((v) => v[format]) ? variants.map((v) => `${v[format]} ${v.width}w`).join(', ') : '';

/**
 * Build-time lookup of a /public image (as the page references it, encoded or
 * not) and, optionally, one of its art-directed crops (`crop: "square"`).
 * Unknown images fall back to the original file with no variants.
 */
export function getImage(src: string, crop?: string): OptimizedImageData {
  const key = encodeURI(decodeURI(src)) + (crop ? `#${crop}` : '');
  const entry = load()[key];
  if (!entry) {
    console.warn(`[images] no variants for ${key}; serving the original.`);
    return { src, avif: '', webp: '' };
  }
  return {
    src,
    width: entry.width,
    height: entry.height,
    avif: srcset(entry.variants, 'avif'),
    webp: srcset(entry.variants, 'webp'),
  };
}
