import type { MetadataRoute } from 'next';
import { BACKGROUND_COLOR, THEME_COLOR, localePath, X_DEFAULT_LOCALE } from '@/lib/site';
import ar from '@/messages/ar.json';

// Emitted once at build time as /manifest.webmanifest and linked from every page.
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${ar.meta.siteName} | Tbarak Fabrics`,
    short_name: 'Tbarak',
    description: ar.meta.description,
    lang: 'ar',
    dir: 'auto',
    start_url: localePath(X_DEFAULT_LOCALE),
    scope: '/',
    display: 'standalone',
    background_color: BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
