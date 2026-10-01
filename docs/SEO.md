# SEO & GEO

Everything is generated at build time (`output: "export"`); nothing runs per request.

## Where things live

| What | File |
| --- | --- |
| Domain, contact facts, social profiles, hero stats, theme colours | `lib/site.ts` |
| Titles, descriptions, OG text, alt text (per locale) | `messages/{ar,en}.json` → `meta`, `alt` |
| `<head>`: title, description, canonical, hreflang, OG/Twitter, robots, theme-color | `app/[locale]/layout.tsx` (`generateMetadata`, `viewport`) |
| JSON-LD (Organization, WebSite, WebPage, Service) | `lib/seo/structured-data.ts`, rendered by `components/StructuredData.tsx` |
| `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` | `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts` |
| `/llms.txt` | `lib/seo/llms.ts`, served by `app/llms.txt/route.ts` |
| Favicon / apple-touch-icon | `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png` |
| OG images, manifest icons, JSON-LD logo | `public/og/`, `public/icons/`, `public/logo.png` |
| `/` → `/ar` (301) | `public/_redirects` |
| `noindex` on `*.pages.dev` and `/keystatic` | `public/_headers` |

JSON-LD and `llms.txt` are built from the same strings the page renders, so edit
copy in `messages/*.json` (or products in Keystatic) and both follow on the next build.

## Hreflang

`/ar` and `/en` are self-canonical and list each other. `x-default` points to `/ar`,
the URL `/` permanently redirects to — a static host can't negotiate language, and
hreflang targets must return 200. Change `X_DEFAULT_LOCALE` in `lib/site.ts` and the
rule in `public/_redirects` together.

## Social profiles

Fill the URLs in `SOCIAL_PROFILES` (`lib/site.ts`). The footer icons link to them and
`Organization.sameAs` picks them up automatically; empty entries are left out.

## Regenerating brand assets

```bash
node scripts/generate-brand-assets.mjs                       # favicon, icons, logo
npx -y -p puppeteer node scripts/generate-brand-assets.mjs --og   # + OG images
```

OG text comes from `meta.ogHeadline` / `meta.ogTagline` in `messages/*.json`.
