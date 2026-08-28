import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { SUPPORTED, DEFAULT_LOCALE, type Locale } from './config';

export default getRequestConfig(async () => {
  const cookie = (await cookies()).get('NEXT_LOCALE')?.value;
  const locale: Locale = (SUPPORTED as readonly string[]).includes(cookie ?? '')
    ? (cookie as Locale)
    : DEFAULT_LOCALE;
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
