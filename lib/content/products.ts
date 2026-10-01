import { cache } from 'react';
import path from 'node:path';
import sharp from 'sharp';
import { reader } from './reader';
import type { Locale } from '@/i18n/config';
import type { ImageSize, ProductItem } from '@/app/utils/types';

const pick = (locale: Locale, ar?: string, en?: string) =>
  (locale === 'en' ? en || ar : ar) ?? ''; // missing translation → Arabic

// Keystatic's reader returns image values as the stored string (a bare filename
// for entries created here). Normalise to a public URL under /Products, while
// leaving already-absolute paths untouched.
const toPublic = (img: string | null): string | null =>
  img == null ? null : img.startsWith('/') ? img : `/Products/${img}`;

// Intrinsic size of a file in /public, read once at build time so every <img>
// can carry explicit width/height. A missing or unreadable file just gets none.
const readSize = cache(async (src: string): Promise<ImageSize | undefined> => {
  try {
    const { width, height } = await sharp(path.join(process.cwd(), 'public', src)).metadata();
    return width && height ? { width, height } : undefined;
  } catch {
    return undefined;
  }
});

// cache(): the products section, the JSON-LD and /llms.txt all read the same
// list during one render, so the collection is only parsed once per locale.
export const getProducts = cache(async (locale: Locale): Promise<ProductItem[]> => {
  const rows = await reader.collections.products.all();
  return Promise.all(
    rows
      .slice()
      .sort((a, b) => a.slug.localeCompare(b.slug, undefined, { numeric: true }))
      .map(async ({ slug, entry }) => {
        const productImage = entry.images.length
          ? entry.images.map(toPublic).filter((img): img is string => img !== null)
          : ['/Products/Picture 1.png'];
        return {
          productId: slug,
          productTitle: pick(locale, entry.titleAr, entry.titleEn),
          productDesc: pick(locale, entry.descAr, entry.descEn),
          productImage,
          productImageSizes: await Promise.all(productImage.map(readSize)),
        };
      }),
  );
});
