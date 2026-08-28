'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setLocale } from '@/lib/actions/locale';
import { cn } from '@/lib/utils';

export default function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const [pending, start] = useTransition();
  const next = locale === 'ar' ? 'en' : 'ar';

  return (
    <button
      type="button"
      disabled={pending}
      aria-label="Switch language"
      onClick={() =>
        start(async () => {
          await setLocale(next);
          router.refresh();
        })
      }
      className={cn(
        'cursor-pointer md:flex items-center text-primary-foreground disabled:opacity-50',
        className,
      )}
    >
      <span className={`fi fi-${locale === 'ar' ? 'sa' : 'gb'} me-1 rounded`} />
      {locale === 'ar' ? 'AR' : 'EN'}
    </button>
  );
}
