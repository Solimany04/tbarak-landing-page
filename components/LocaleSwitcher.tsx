'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export default function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  // Same page, other locale prefix (/ar/... <-> /en/...).
  const pathname = usePathname();
  const next = locale === 'ar' ? 'en' : 'ar';

  return (
    <Link
      href={pathname}
      locale={next}
      aria-label="Switch language"
      className={cn(
        'cursor-pointer md:flex items-center text-primary-foreground',
        className,
      )}
    >
      <span className={`fi fi-${locale === 'ar' ? 'sa' : 'gb'} me-1 rounded`} />
      {locale === 'ar' ? 'AR' : 'EN'}
    </Link>
  );
}
