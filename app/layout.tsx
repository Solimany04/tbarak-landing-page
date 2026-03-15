import { IBM_Plex_Sans_Arabic } from "next/font/google";

import { DirectionProvider } from "@/components/ui/direction"
import "flag-icons/css/flag-icons.min.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-arabic",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tbarak",
  description: "Tbarak for high quality textiles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" className={ibmPlexSansArabic.variable} dir="rtl">
      <body
        className={`${ibmPlexSansArabic.variable} antialiased`}
      >
        <DirectionProvider dir="rtl">
        {children}
        </DirectionProvider>
      </body>
    </html>
  );
}
