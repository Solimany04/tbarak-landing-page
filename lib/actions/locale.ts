'use server';

import { cookies } from 'next/headers';
import type { Locale } from '@/i18n/config';

export async function setLocale(locale: Locale) {
  (await cookies()).set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
}
