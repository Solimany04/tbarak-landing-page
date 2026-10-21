/* IBM Plex Sans Arabic, self-hosted from public/fonts/ibm-plex-sans-arabic/.
 *
 * The .woff2 files are the Google Fonts subsets next/font used to download
 * (Arabic + Latin, weights 300–700; OFL-1.1, see OFL.txt beside them). They
 * are cached as immutable (public/_headers): a replacement needs a new name.
 *
 * Loading, per locale:
 *  - critical: the 400 and 500 faces of the locale's own script (body copy and
 *    the hero heading) are declared inline in <head> and preloaded, and Latin
 *    600 (the hero stats) is declared inline too, so the hero is final at the
 *    first paint;
 *  - everything else (below-the-fold weights, the other script, the desktop
 *    nav's 300) is in /fonts.css, attached on the visitor's first scroll,
 *    touch or key, or 5 s after load (app/[locale]/layout.tsx). Until then
 *    600/700 text uses the 500 face (synthesised bold), 300 uses 400 and the
 *    other script the size-adjusted fallback, then swaps in.
 * Nothing font-related competes with the hero image or blocks first paint,
 * and the relayout a font swap causes stays out of the page load.
 */
import type { Locale } from '@/i18n/config';

export const FONT_FAMILY = 'IBM Plex Sans Arabic';

const DIR = '/fonts/ibm-plex-sans-arabic';

// Google Fonts' subset ranges for this family.
const UNICODE_RANGE = {
  arabic:
    'U+6??,U+750-77F,U+870-891,U+897-8E1,U+8E3-8FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,' +
    'U+FE70-FE74,U+FE76-FEFC,U+102E0-102FB,U+10E60-10E7E,U+10EC2-10EC7,U+10EC9-10EEE,U+10EF?,' +
    'U+1EE00-1EE03,U+1EE05-1EE1F,U+1EE21-1EE22,U+1EE24,U+1EE27,U+1EE29-1EE32,U+1EE34-1EE37,U+1EE39,' +
    'U+1EE3B,U+1EE42,U+1EE47,U+1EE49,U+1EE4B,U+1EE4D-1EE4F,U+1EE51-1EE52,U+1EE54,U+1EE57,U+1EE59,' +
    'U+1EE5B,U+1EE5D,U+1EE5F,U+1EE61-1EE62,U+1EE64,U+1EE67-1EE6A,U+1EE6C-1EE72,U+1EE74-1EE77,' +
    'U+1EE79-1EE7C,U+1EE7E,U+1EE80-1EE89,U+1EE8B-1EE9B,U+1EEA1-1EEA3,U+1EEA5-1EEA9,U+1EEAB-1EEBB,' +
    'U+1EEF0-1EEF1',
  latin:
    'U+??,U+131,U+152-153,U+2BB-2BC,U+2C6,U+2DA,U+2DC,U+304,U+308,U+329,U+2000-206F,U+20AC,U+2122,' +
    'U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
} as const;

type Subset = keyof typeof UNICODE_RANGE;

const WEIGHTS = [300, 400, 500, 600, 700] as const;

type Face = readonly [Subset, number];

/* Per locale: `preload` = the body and hero-heading faces of its own script;
   `inline` = faces the hero also shows (the semibold "30+" stats are Latin
   digits in both languages), declared up front but not preloaded. */
const CRITICAL: Record<Locale, { preload: readonly Face[]; inline: readonly Face[] }> = {
  ar: { preload: [['arabic', 400], ['arabic', 500]], inline: [['latin', 600]] },
  en: { preload: [['latin', 400], ['latin', 500]], inline: [['latin', 600]] },
};

/** Served by app/fonts.css/route.ts; declares every face. */
export const DEFERRED_STYLESHEET = '/fonts.css';

export const fontUrl = (subset: Subset, weight: number) => `${DIR}/${subset}-${weight}.woff2`;

const fontFace = (subset: Subset, weight: number) =>
  `@font-face{font-family:'${FONT_FAMILY}';font-style:normal;font-weight:${weight};font-display:swap;` +
  `src:url(${fontUrl(subset, weight)}) format('woff2');unicode-range:${UNICODE_RANGE[subset]}}`;

/** The locale's first-paint faces: URLs to preload and their @font-face rules. */
export function criticalFonts(locale: Locale) {
  const { preload, inline } = CRITICAL[locale];
  return {
    urls: preload.map(([subset, w]) => fontUrl(subset, w)),
    css: [...preload, ...inline].map(([subset, w]) => fontFace(subset, w)).join('\n'),
  };
}

/** Every face, for the deferred stylesheet. */
export function allFontFaces() {
  return (Object.keys(UNICODE_RANGE) as Subset[])
    .flatMap((subset) => WEIGHTS.map((w) => fontFace(subset, w)))
    .join('\n');
}
