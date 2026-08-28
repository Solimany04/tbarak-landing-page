import { IBM_Plex_Sans_Arabic } from "next/font/google";

import { DirectionProvider } from "@/components/ui/direction"
import "flag-icons/css/flag-icons.min.css";
import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-arabic",
});

export const metadata: Metadata = {
  title: "Tbarak",
  description: "Tbarak for high quality textiles",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
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
