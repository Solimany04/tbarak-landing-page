import { IBM_Plex_Sans_Arabic } from "next/font/google";

import { DirectionProvider } from "@/components/ui/direction"
import "flag-icons/css/flag-icons.min.css";
import type { Metadata } from "next";
import "../globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-arabic",
});

export const metadata: Metadata = {
  title: "Tbarak",
  description: "Tbarak for high quality textiles",
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
