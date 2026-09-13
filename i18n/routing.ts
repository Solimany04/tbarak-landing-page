import { defineRouting } from 'next-intl/routing';
import { SUPPORTED, DEFAULT_LOCALE } from './config';

export const routing = defineRouting({
  locales: SUPPORTED,
  defaultLocale: DEFAULT_LOCALE,
  // Every page lives under /ar or /en so the static export emits one HTML
  // file per locale; nothing at request time picks a language.
  localePrefix: 'always',
});
