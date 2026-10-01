import { IBM_Plex_Sans_Arabic } from "next/font/google";

import { DirectionProvider } from "@/components/ui/direction"
import "flag-icons/css/flag-icons.min.css";
import type { Metadata, Viewport } from "next";
import "../globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import {
  OG_IMAGE,
  OG_LOCALE,
  SITE_URL,
  THEME_COLOR,
  hreflangAlternates,
  localePath,
} from '@/lib/site';

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-arabic",
});

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

  return (
    <html lang={locale} className={ibmPlexSansArabic.variable} dir={dir}>
      <body
        className={`${ibmPlexSansArabic.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <DirectionProvider dir={dir}>
            {children}
            <SpeedInsights />
          </DirectionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
