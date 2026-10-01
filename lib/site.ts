/* Single source of truth for site-wide facts used by the visible page,
 * the <head> metadata, JSON-LD, robots/sitemap and /llms.txt.
 *
 * Anything that appears both on the page and in structured data lives here
 * (or in messages/*.json) so the two can never drift apart — Google and AI
 * answer engines both penalise markup that disagrees with the visible text.
 */
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/config';

/** Production origin. Canonicals, hreflang, OG URLs and the sitemap use it. */
export const SITE_URL = 'https://tbarak.org';

/**
 * The locale "/" lands on (public/_redirects) and the hreflang x-default
 * target. "/" itself can't be x-default: with no runtime it can't negotiate a
 * language, so it is a permanent redirect, and hreflang must point at 200 URLs.
 */
export const X_DEFAULT_LOCALE: Locale = routing.defaultLocale;

export const localePath = (locale: Locale) => `/${locale}`;
export const absoluteUrl = (path = '/') => new URL(path, SITE_URL).toString();

/** hreflang map for <link rel="alternate"> and the sitemap. */
export function hreflangAlternates(): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) languages[locale] = absoluteUrl(localePath(locale));
  languages['x-default'] = absoluteUrl(localePath(X_DEFAULT_LOCALE));
  return languages;
}

export const OG_LOCALE: Record<Locale, string> = { ar: 'ar_EG', en: 'en_US' };

/** Pre-generated 1200×630 share images (scripts/generate-brand-assets.mjs). */
export const OG_IMAGE = {
  width: 1200,
  height: 630,
  path: (locale: Locale) => `/og/og-${locale}.png`,
} as const;

/** Square raster logo for Organization.logo (Google wants ≥112×112, crawlable). */
export const LOGO = { path: '/logo.png', width: 512, height: 512 } as const;

/** Brand colours (globals.css --primary / --background, as hex). */
export const THEME_COLOR = '#1D3535';
export const BACKGROUND_COLOR = '#FFFBF5';

/** Shown in the footer; also Organization.email and in /llms.txt. */
export const CONTACT_EMAIL = 'contact@tbarak.com';

/** The map card in the contact section; also Organization.hasMap. */
export const MAP_URL = 'https://maps.app.goo.gl/u6PWEFruWn1VbvgL8';

/**
 * Official profiles. They feed both the footer icons and Organization.sameAs,
 * so a profile only reaches structured data once it is linked on the page.
 * Leave a value empty until the real URL exists.
 */
export const SOCIAL_PROFILES: Record<'Facebook' | 'Instagram' | 'Google' | 'LinkedIn', string> = {
  Facebook: '',
  Instagram: '',
  Google: '',
  LinkedIn: '',
};

export const socialProfileUrls = () => Object.values(SOCIAL_PROFILES).filter(Boolean);

/** Hero stats — rendered in B_Hero and repeated in /llms.txt. */
export const HERO_STATS = {
  years: '30+',
  clients: '25+',
  fabrics: '15+',
} as const;
