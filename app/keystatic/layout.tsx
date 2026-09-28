import KeystaticApp from './keystatic';

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
