import { allFontFaces } from '@/lib/fonts';

// Rendered once during `next build` and exported as the static file /fonts.css:
// every IBM Plex Sans Arabic face, attached after page load (app/[locale]/layout.tsx).
export const dynamic = 'force-static';

export function GET() {
  return new Response(`${allFontFaces()}\n`, {
    headers: { 'Content-Type': 'text/css; charset=utf-8' },
  });
}
