import { reader } from './reader';
import type { Locale } from '@/i18n/config';
import type { ProductItem } from '@/app/utils/types';

const pick = (locale: Locale, ar?: string, en?: string) =>
  (locale === 'en' ? en || ar : ar) ?? ''; // missing translation → Arabic

// Keystatic's reader returns image values as the stored string (a bare filename
// for entries created here). Normalise to a public URL under /Products, while
// leaving already-absolute paths untouched.
const toPublic = (img: string | null): string | null =>
  img == null ? null : img.startsWith('/') ? img : `/Products/${img}`;

export async function getProducts(locale: Locale): Promise<ProductItem[]> {
  const rows = await reader.collections.products.all();
  return rows
    .slice()
    .sort((a, b) => a.slug.localeCompare(b.slug, undefined, { numeric: true }))
    .map(({ slug, entry }) => ({
      productId: slug,
      productTitle: pick(locale, entry.titleAr, entry.titleEn),
      productDesc: pick(locale, entry.descAr, entry.descEn),
      productImage: entry.images.length
        ? entry.images.map(toPublic).filter((img): img is string => img !== null)
        : ['/Products/Picture 1.png'],
    }));
}
