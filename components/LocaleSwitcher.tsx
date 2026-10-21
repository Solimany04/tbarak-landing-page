'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
// Just the two flags in use. The flag-icons stylesheet declares all ~270 flags
// and would sit in the render-blocking CSS; the .fi rules are inlined below.
import saFlag from 'flag-icons/flags/4x3/sa.svg';
import gbFlag from 'flag-icons/flags/4x3/gb.svg';

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
      <span
        className="relative inline-block w-[1.333333em] leading-[1em] bg-contain bg-center bg-no-repeat before:content-['_'] me-1 rounded"
        style={{ backgroundImage: `url(${(locale === 'ar' ? saFlag : gbFlag).src})` }}
      />
      {locale === 'ar' ? 'AR' : 'EN'}
    </Link>
  );
}
