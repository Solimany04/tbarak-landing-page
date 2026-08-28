# Implementation Plan — next-intl (unprefixed) + Keystatic

> Supersedes `docs/Recommended General Architecture...md` (that doc assumed **prefixed** `/en /ar` routing; this spec is **unprefixed**).
> Stack verified in repo: Next.js `16.1.6`, React `19.2.3`, App Router in **root `app/`** (no `src/`), tsconfig alias `@/* → ./*`, no middleware. Repo: `Solimany04/tbarak-landing-page` (Vercel host).

---

## 0. How to execute this plan (agent instructions — read first)

- Work **phase by phase, top to bottom**. Each phase ends with a **GATE** (a command that must pass). Do not start the next phase until the current GATE passes.
- **Reuse, don't repeat.** Two helpers do all the heavy lifting — the `pick()` locale-fallback helper (Phase 4) and the **string-extraction recipe** (Phase 2, §2.4). Apply the recipe mechanically per file; do not invent per-string logic.
- **Minimal diffs.** Touch only files named in each step. Do not reformat untouched code.
- **Never** add a `[locale]` folder, `middleware.ts`, or locale URL prefixes — routing is unprefixed/cookie-based by decision D1.
- Keep secrets in `.env` (dev) and Vercel env (prod). Never commit `.env`.
- When a step says "translate strings", fill **Arabic = existing copy**, **English = translation**. Arabic is the base; English may be left empty and will fall back.

### Key decisions (locked)
| # | Decision | Rationale |
|---|----------|-----------|
| D1 | next-intl **without i18n routing** (cookie `NEXT_LOCALE`, no `[locale]` segment, no middleware) | Spec says *unprefixed*. Keeps `/keystatic` & `/api/keystatic` un-intercepted; no app restructure. |
| D2 | `ar` default + fallback; `en` secondary | Spec. `pick()` returns Arabic whenever English is missing. |
| D3 | Keystatic storage switched by `NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND` (`local` dev / `github` prod) | Spec. |
| D4 | **Read** content from committed files via `createReader(process.cwd())` in *both* modes | GitHub mode only changes where the **admin writes** (commits→Vercel redeploy); runtime always reads the filesystem. Simplest + correct. |
| D5 | Per-locale flat fields in ONE entry: `titleAr/titleEn`, `descAr/descEn`. Shared `slug`. | Spec — not duplicate collections. |
| D6 | Feedback avatars **not** editable → assigned in code from `public/FeedbackAvatars/` placeholders by index | Spec. |
| D7 | Keystatic content format = **JSON** (`format:{data:'json'}`), stored in `content/` | Clean nested/plain text, git-diff friendly. |

### Deliverable file map (what gets created)
```
i18n/request.ts                      # getRequestConfig (cookie → messages)
i18n/config.ts                       # SUPPORTED, DEFAULT, Locale type
messages/ar.json  messages/en.json   # static UI dictionaries
lib/actions/locale.ts                # 'use server' setLocale(cookie)
components/LocaleSwitcher.tsx         # client switch (replaces Navbar AR button)
keystatic.config.ts                  # collections: products, feedbacks
app/keystatic/[[...params]]/page.tsx # admin UI  (/keystatic)
app/api/keystatic/[...params]/route.ts
lib/content/reader.ts                # createReader(process.cwd(), config)
lib/content/products.ts              # getProducts(locale) → ProductItem[]
lib/content/feedbacks.ts             # getFeedbacks(locale) → FeedbackCardProps[]
content/products/*.json              # migrated seed data (10 items)
content/feedbacks/*.json             # migrated seed data
public/FeedbackAvatars/              # renamed from FeadbackAvatars (fix typo)
```
Edited: `next.config.ts`, `app/layout.tsx`, `package.json`, all `components/sections/*`, `components/ContactForm.tsx`, `components/FeedbackCard.tsx`, `components/ProductCard.tsx`, `.env`, `.gitignore`. Removed: `i18next` dep, empty `app/utils/i18n.ts`.

---

## Phase 1 — Dependencies & config wiring

**1.1** Install / remove:
```bash
npm i next-intl @keystatic/core @keystatic/next
npm rm i18next            # unused; switching to next-intl
rm app/utils/i18n.ts      # empty stub
```
**1.2** `next.config.ts` — wrap with the next-intl plugin **and** allow Keystatic images:
```ts
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
const nextConfig: NextConfig = {};
export default withNextIntl(nextConfig);
```
**1.3** `i18n/config.ts`:
```ts
export const SUPPORTED = ['ar', 'en'] as const;
export const DEFAULT_LOCALE = 'ar';
export type Locale = (typeof SUPPORTED)[number];
```

**GATE 1:** `npm run build` compiles (app still Arabic-hardcoded — fine).

---

## Phase 2 — next-intl static UI (no routing)

**2.1** `i18n/request.ts`:
```ts
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { SUPPORTED, DEFAULT_LOCALE, type Locale } from './config';

export default getRequestConfig(async () => {
  const cookie = (await cookies()).get('NEXT_LOCALE')?.value;
  const locale: Locale = (SUPPORTED as readonly string[]).includes(cookie ?? '')
    ? (cookie as Locale)
    : DEFAULT_LOCALE;
  return { locale, messages: (await import(`../messages/${locale}.json`)).default };
});
```
**2.2** `lib/actions/locale.ts`:
```ts
'use server';
import { cookies } from 'next/headers';
import type { Locale } from '@/i18n/config';
export async function setLocale(locale: Locale) {
  (await cookies()).set('NEXT_LOCALE', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
}
```
**2.3** `app/layout.tsx` — make `lang`/`dir` dynamic, add provider:
```tsx
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
// ...existing font imports...

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  return (
    <html lang={locale} dir={dir} className={ibmPlexSansArabic.variable}>
      <body className={`${ibmPlexSansArabic.variable} antialiased`}>
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
```
> Note: `cookies()`/`getLocale()` opt the page into dynamic rendering — expected and acceptable for a landing page.

**2.4 — STRING-EXTRACTION RECIPE (apply to every file in the namespace map below).**
For each hardcoded human-readable string in a component:
1. Add key to **both** `messages/ar.json` (existing Arabic copy) and `messages/en.json` (English translation) under the file's namespace.
2. In the component:
   - **Client component** (`"use client"`): `import {useTranslations} from 'next-intl'; const t = useTranslations('hero');` → replace string with `{t('title')}`.
   - **Server component**: `import {getTranslations} from 'next-intl/server'; const t = await getTranslations('feedback');` (make the component `async`).
3. Never hardcode locale-specific values (numbers like `30+` stay; their labels get keys).

**Namespace map** (file → namespace → representative keys):
| File | `"use client"`? | namespace | keys |
|------|------|-----------|------|
| `sections/A_Navbar.tsx` | yes | `nav` | `home, about, products, process, why, contact, ctaNow` |
| `sections/B_Hero.tsx` | yes | `hero` | `title, subtitle, body, contact, explore, yearsLabel, clientsLabel, fabricsLabel` |
| `sections/C_About.tsx` | check | `about` | headings/body |
| `sections/D_Products.tsx` | → server (Phase 4) | `products` | `heading, brand` |
| `sections/E_ProductionProcess.tsx` | check | `process` | steps |
| `sections/F_WhySection.tsx` | check | `why` | features |
| `sections/G_FeedbackSection.tsx` | server | `feedback` | `heading` |
| `sections/H_ContactSection.tsx` + `ContactForm.tsx` | yes | `contact` | labels, placeholders, submit, validation msgs |
| `sections/J_FooterSection.tsx` | check | `footer` | links, rights |
| shared button "أحصل عليه الآن" etc. | — | `common` | `getItNow, contactNow, whatsapp` |

**2.5** Contact form validation: `lib/actions/contact/contact-schema.ts` currently has Arabic zod messages. Move messages into `contact` namespace and build the schema inside the component with `useTranslations` (or pass `t` into a schema factory `makeSchema(t)`), so validation text localizes.

**2.6** `LocaleSwitcher` — replace the Navbar's static `activeLang`/`#lang` button:
```tsx
'use client';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setLocale } from '@/lib/actions/locale';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [pending, start] = useTransition();
  const next = locale === 'ar' ? 'en' : 'ar';
  return (
    <button disabled={pending} onClick={() => start(async () => { await setLocale(next); router.refresh(); })}>
      <span className={`fi fi-${locale === 'ar' ? 'sa' : 'gb'} me-1 rounded`} />
      {locale === 'ar' ? 'AR' : 'EN'}
    </button>
  );
}
```
Import it into `A_Navbar.tsx` in place of the current language button.

**GATE 2:** `npm run dev` → toggling the switcher flips all static UI ar↔en, `<html dir>` flips rtl↔ltr, choice persists on reload. `npm run build` passes. No `[locale]` route exists.

---

## Phase 3 — Keystatic install & admin (data still from arrays)

**3.1** `keystatic.config.ts` (root):
```ts
import { config, fields, collection } from '@keystatic/core';

const isGithub = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND === 'github';

export default config({
  storage: isGithub
    ? { kind: 'github', repo: { owner: 'Solimany04', name: 'tbarak-landing-page' } }
    : { kind: 'local' },
  ui: { brand: { name: 'Tbarak CMS' } },
  collections: {
    products: collection({
      label: 'Products',
      slugField: 'slug',
      path: 'content/products/*',
      format: { data: 'json' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug (shared across locales)', validation: { length: { max: 60 } } } }),
        // validation.length.max = character limit enforced in the admin UI
        titleAr: fields.text({ label: 'Title (Arabic)', validation: { length: { max: 60 } } }),
        titleEn: fields.text({ label: 'Title (English)', validation: { length: { max: 60 } } }),
        descAr: fields.text({ label: 'Description (Arabic)', multiline: true, validation: { length: { max: 300 } } }),
        descEn: fields.text({ label: 'Description (English)', multiline: true, validation: { length: { max: 300 } } }),
        images: fields.array(
          fields.image({ label: 'Image', directory: 'public/Products', publicPath: '/Products' }),
          { label: 'Images', itemLabel: (p) => p.value?.filename ?? 'Image' }
        ),
      },
    }),
    feedbacks: collection({
      label: 'Feedbacks',
      slugField: 'slug',
      path: 'content/feedbacks/*',
      format: { data: 'json' },
      schema: {
        slug: fields.slug({ name: { label: 'Slug', validation: { length: { max: 60 } } } }),
        nameAr: fields.text({ label: 'Name (Arabic)', validation: { length: { max: 50 } } }),
        nameEn: fields.text({ label: 'Name (English)', validation: { length: { max: 50 } } }),
        roleAr: fields.text({ label: 'Role (Arabic)', validation: { length: { max: 60 } } }),
        roleEn: fields.text({ label: 'Role (English)', validation: { length: { max: 60 } } }),
        contentAr: fields.text({ label: 'Content (Arabic)', multiline: true, validation: { length: { max: 400 } } }),
        contentEn: fields.text({ label: 'Content (English)', multiline: true, validation: { length: { max: 400 } } }),
      },
    }),
  },
});
```
> Avatars intentionally absent (D6).
> Every text input carries a `validation.length.max` limit defined here in dev. These are hard-coded in the schema — the admin sees them enforced in the UI but cannot change them. Tune the numbers (title 60, desc 300, name 50, role 60, content 400) to the real design constraints before shipping.

**3.2** Admin UI — `app/keystatic/[[...params]]/page.tsx`:
```tsx
'use client';
import { makePage } from '@keystatic/next/ui/app';
import config from '@/keystatic.config';
export default makePage(config);
```
**3.3** API route — `app/api/keystatic/[...params]/route.ts`:
```ts
import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '@/keystatic.config';
export const { POST, GET } = makeRouteHandler({ config });
```
**3.4** `.env` (dev) add: `NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND=local`. Add to `.gitignore` if not: keep `.env` ignored; ensure `content/` is **tracked**.

**GATE 3:** `/keystatic` loads in local mode; can create/edit a product and it writes `content/products/<slug>.json`. Public site unchanged.

---

## Phase 4 — Wire content into the site (fallback logic)

**4.1** `lib/content/reader.ts`:
```ts
import { createReader } from '@keystatic/core/reader';
import config from '@/keystatic.config';
export const reader = createReader(process.cwd(), config);
```
**4.2** Fallback helper + `lib/content/products.ts`:
```ts
import { reader } from './reader';
import type { Locale } from '@/i18n/config';
import type { ProductItem } from '@/app/utils/types';

const pick = (locale: Locale, ar?: string, en?: string) =>
  (locale === 'en' ? en || ar : ar) ?? '';   // missing translation → Arabic

export async function getProducts(locale: Locale): Promise<ProductItem[]> {
  const rows = await reader.collections.products.all();
  return rows.map(({ slug, entry }) => ({
    productId: slug,
    productTitle: pick(locale, entry.titleAr, entry.titleEn),
    productDesc: pick(locale, entry.descAr, entry.descEn),
    productImage: entry.images.length ? [...entry.images] : ['/Products/Picture 1.png'],
  }));
}
```
**4.3** `lib/content/feedbacks.ts` (avatars assigned by index, D6):
```ts
import { reader } from './reader';
import type { Locale } from '@/i18n/config';
import type { FeedbackCardProps } from '@/app/utils/types';

const AVATARS = ['/FeedbackAvatars/Ellipse1.png', '/FeedbackAvatars/Ellipse2.png', '/FeedbackAvatars/Ellipse3.png'];
const pick = (locale: Locale, ar?: string, en?: string) => (locale === 'en' ? en || ar : ar) ?? '';

export async function getFeedbacks(locale: Locale): Promise<FeedbackCardProps[]> {
  const rows = await reader.collections.feedbacks.all();
  return rows.map(({ entry }, i) => ({
    avatar: AVATARS[i % AVATARS.length],
    name: pick(locale, entry.nameAr, entry.nameEn),
    desc: pick(locale, entry.roleAr, entry.roleEn),
    content: pick(locale, entry.contentAr, entry.contentEn),
  }));
}
```
**4.4** Rename avatar folder to match spec: `public/FeadbackAvatars/` → `public/FeadbackAvatars` **→ `public/FeedbackAvatars/`** (git mv, keep Ellipse1–3.png). Grep & fix the old `/FeadbackAvatars/` reference remaining in `G_FeedbackSection.tsx`.

**4.5** Refactor **Products** from client-hardcoded to server-fetched:
- `sections/D_Products.tsx` → `async` **server** component (remove `"use client"`, delete the inline `productsList`). Fetch: `const locale = await getLocale(); const items = await getProducts(locale);` then render `<ProductCarousel items={items} dir={locale==='ar'?'rtl':'ltr'} />`. Heading via `getTranslations('products')`.
- `ProductCarousel.tsx` stays the client component (unchanged props).

**4.6** Refactor **Feedback** (already server): in `G_FeedbackSection.tsx` replace `dummyFeedbacks` with `const locale = await getLocale(); const items = await getFeedbacks(locale);` and pass to `FeedbackCarousel`. Ensure `FeedbackCard.tsx` renders from props (current version ignores props per `docs/current_project_state.md` — fix it to use `avatar/name/desc/content`).

**4.7** Migrate seed data (one-time) — create JSON files from the current arrays so the site isn't empty:
- `content/products/1.json … 10.json` from `D_Products.tsx` array → `{slug, titleAr, titleEn:"", descAr, descEn:"", images:["/Products/Picture N.png"]}`.
- `content/feedbacks/*.json` from `G_FeedbackSection.tsx` array → name/role/content Ar filled, En empty.
- Leaving `*En` empty is intentional; `pick()` falls back to Arabic. Commit `content/`.

**GATE 4:** Home page renders products + feedbacks from `content/` (not arrays). Editing an entry at `/keystatic` (local) → reload → change appears. Switching to EN shows English where filled, Arabic where empty. `npm run build` passes.

---

## Phase 5 — Production (Vercel + GitHub App OAuth)

**5.1** Create the Keystatic **GitHub App** (grants only repo collaborators edit access): run locally with `NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND=github` and visit `/keystatic` — it walks through GitHub App creation, or create manually per Keystatic docs. Capture: App slug, Client ID, Client Secret.
**5.2** Env vars:
| Var | dev (`.env`) | Vercel (prod) |
|-----|------|------|
| `NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND` | `local` | `github` |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | (app slug) | (app slug) |
| `KEYSTATIC_GITHUB_CLIENT_ID` | id | id |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | secret | secret |
| `KEYSTATIC_SECRET` | random 40+ hex | same |

Set the GitHub App callback URLs to `http://localhost:3000/api/keystatic/github/oauth/callback` and `https://<prod-domain>/api/keystatic/github/oauth/callback`.
**5.3** Flow in prod: collaborator logs in at `/keystatic` via GitHub OAuth → edits commit to the repo → Vercel redeploys → `createReader` serves new content. Non-collaborators are rejected by the GitHub App.

**GATE 5 (final verification):**
1. `npm run build` clean, no `i18next` in the tree, no `[locale]` route, no `middleware.ts`.
2. Prod `/keystatic` requires GitHub login; a non-collaborator cannot edit.
3. An edit in prod commits to `Solimany04/tbarak-landing-page` and appears after redeploy.
4. `grep -rn "FeadbackAvatars"` returns nothing; `grep -rniP "[\x{0600}-\x{06FF}]" components/sections lib/content` returns no **hardcoded** UI strings (only comments/JSON allowed).
5. EN with a missing field shows Arabic (fallback), never blank.

---

## Risks / guards
- **Do not** put `getLocale()` calls in the Keystatic route tree — keep CMS outside i18n entirely (it already is; no middleware means nothing to exclude).
- `fields.image` writes to `public/Products`; ensure that dir stays committed and Vercel serves it.
- Reader is filesystem-based → content edits require a redeploy to show in prod (expected with git-backed CMS). If instant preview is later needed, switch reader to `@keystatic/core/reader/github`.
- Keep `slug` stable across locales (D5) — it's the join key used by both `getProducts`/`getFeedbacks`.
