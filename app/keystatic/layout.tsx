import KeystaticApp from './keystatic';

// A second root layout, beside app/[locale]/layout.tsx. KeystaticApp renders its
// own <html>/<body>, so this returns it directly (the official Keystatic pattern).
export default function RootLayout() {
  return <KeystaticApp />;
}
