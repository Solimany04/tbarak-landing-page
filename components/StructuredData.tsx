import type { Locale } from '@/i18n/config';
import { getProducts } from '@/lib/content/products';
import { buildStructuredData, serializeJsonLd } from '@/lib/seo/structured-data';

/** Organization / WebSite / WebPage / Service JSON-LD for one locale. */
export default async function StructuredData({ locale }: { locale: Locale }) {
  const products = await getProducts(locale);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildStructuredData(locale, products)) }}
    />
  );
}
