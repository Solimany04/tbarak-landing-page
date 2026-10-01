import type { Metadata } from 'next';
import KeystaticApp from './keystatic';

// The CMS admin must never show up in search (public/_headers also sends
// X-Robots-Tag for /keystatic/*, which covers the client-routed deep links).
export const metadata: Metadata = {
  title: 'Tbarak CMS',
  robots: { index: false, follow: false },
};

// A second root layout, beside app/[locale]/layout.tsx, so it needs its own
// <html>/<body>. The admin UI is rendered here; the catch-all page is empty.
export default function RootLayout() {
  return (
    <html lang="en">
      <head />
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
