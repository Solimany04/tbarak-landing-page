import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { absoluteUrl, hreflangAlternates, localePath } from '@/lib/site';

// Written to /sitemap.xml at build time.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  // A deploy is the only way content changes on a static export, so the build
  // time is an honest lastmod for both locales.
  const lastModified = new Date();
  const languages = hreflangAlternates();

  return routing.locales.map((locale) => ({
    url: absoluteUrl(localePath(locale)),
    lastModified,
    alternates: { languages },
  }));
}
