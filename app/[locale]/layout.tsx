import { preload } from "react-dom";
import { DirectionProvider } from "@/components/ui/direction"
import type { Metadata, Viewport } from "next";
import "../globals.css";
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { criticalFonts, DEFERRED_STYLESHEET } from '@/lib/fonts';
import {
  OG_IMAGE,
  OG_LOCALE,
  SITE_URL,
  THEME_COLOR,
  hreflangAlternates,
  localePath,
} from '@/lib/site';

// Attaches every font face once the page has loaded (see lib/fonts.ts).
const loadDeferredFonts = `addEventListener("load",function(){var l=document.createElement("link");l.rel="stylesheet";l.href="${DEFERRED_STYLESHEET}";document.head.appendChild(l)})`;

// Everything below is resolved at build time: one <head> per exported locale.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });

  const title = t('title');
  const description = t('description');
  const url = localePath(locale);
  const image = {
    url: OG_IMAGE.path(locale),
    width: OG_IMAGE.width,
    height: OG_IMAGE.height,
    alt: t('ogImageAlt'),
    type: 'image/png',
  };

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    applicationName: t('siteName'),
    alternates: {
      canonical: url,
      languages: hreflangAlternates(),
    },
    openGraph: {
      type: 'website',
      url,
      siteName: t('siteName'),
      title,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
};

// Static export: emit /ar and /en at build time and nothing else.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Lets getLocale()/getTranslations() in nested server components resolve
  // without request-time state, which is what makes static rendering possible.
  setRequestLocale(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";
  // IBM Plex Sans Arabic: only this locale's 400/500 faces are needed for the
  // first paint; they are declared inline and preloaded, the rest load later.
  const fonts = criticalFonts(locale);
  for (const href of fonts.urls) preload(href, { as: "font", type: "font/woff2" });

  return (
    <html lang={locale} dir={dir}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: fonts.css }} />
        <script dangerouslySetInnerHTML={{ __html: loadDeferredFonts }} />
        <noscript>
          <link rel="stylesheet" href={DEFERRED_STYLESHEET} />
        </noscript>
      </head>
      <body className="antialiased">
        <NextIntlClientProvider>
          <DirectionProvider dir={dir}>
            {children}
          </DirectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
