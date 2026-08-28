# i18n (next-intl, unprefixed) + Keystatic — Setup & Handoff

This implements the plan in `IMPLEMENTATION_PLAN_i18n_Keystatic.md`.

## What was built

**Localization (next-intl, cookie-based, no URL prefix)**
- `i18n/config.ts` — `SUPPORTED = ['ar','en']`, `DEFAULT_LOCALE = 'ar'`, `Locale` type.
- `i18n/request.ts` — reads the `NEXT_LOCALE` cookie, falls back to `ar`, loads the matching dictionary.
- `messages/ar.json` / `messages/en.json` — UI dictionaries (Arabic is the base; some English left blank falls back to Arabic).
- `lib/actions/locale.ts` — `'use server'` `setLocale()` writes the cookie.
- `components/LocaleSwitcher.tsx` — replaces the old Navbar "AR" button; toggles ar↔en and refreshes.
- `app/layout.tsx` — `lang`/`dir` now derive from the active locale (rtl for `ar`, ltr for `en`) and the tree is wrapped in `NextIntlClientProvider`.
- All section components + `ContactForm` pull copy from the dictionaries. Contact-form validation is localized via a schema factory (`makeContactSchema(t)` in `lib/actions/contact/contact-schema.ts`); the API route keeps a default schema.

**CMS (Keystatic)**
- `keystatic.config.ts` — `products` and `feedbacks` collections, JSON format under `content/`. Storage switches on `NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND` (`local` dev / `github` prod). Per-locale flat fields (`titleAr/titleEn`, …) with one shared `slug`. Feedback avatars are assigned in code (not editable).
- Admin UI at `/keystatic` (`app/keystatic/[[...params]]/page.tsx`); API at `app/api/keystatic/[...params]/route.ts`.
- `lib/content/reader.ts` reads committed files with `createReader(process.cwd(), config)` in both modes.
- `lib/content/products.ts` / `feedbacks.ts` — `getProducts(locale)` / `getFeedbacks(locale)` with Arabic fallback (`pick()`), numeric slug sort, and image paths normalized to `/Products/...`.
- Seed data migrated to `content/products/1..10.json` and `content/feedbacks/1..5.json` (Arabic filled, English blank → falls back). Verified: the reader parses all 15 entries and resolves image paths correctly.
- `public/FeadbackAvatars` renamed to `public/FeedbackAvatars` (typo fix).

## Dependencies
```bash
npm install next-intl @keystatic/core @keystatic/next
npm rm i18next
```

## Two manual cleanup items (couldn't be done from the sandbox)
1. Delete the now-empty stub `app/utils/i18n.ts` (the mounted-drive sandbox refused the delete).
2. If a future `npm install` errors with `ENOTEMPTY` on `node_modules/.icu-minify-*` (leftover partial staging dirs from a failed sandbox install), delete `node_modules` and reinstall clean (`rm -rf node_modules && npm install`).

## Local run / gates
- `npm run dev` → `/` renders Arabic; the switcher flips all static UI + `<html dir>` and persists on reload.
- `/keystatic` loads in local mode; creating/editing an entry writes `content/<collection>/<slug>.json`; reload shows the change.
- English shows English where filled, Arabic where blank (never empty).
- `npm run build` should compile. (The build was not run inside the sandbox — see note below — so run it once on your machine.)

## Production (Vercel + GitHub App) — Phase 5, requires your credentials
1. Create the Keystatic GitHub App: run locally with `NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND=github` and visit `/keystatic`; it walks through App creation. Capture the App slug, Client ID, Client Secret.
2. Set env vars (see `.env.example`):

   | Var | dev (`.env`) | Vercel (prod) |
   |-----|------|------|
   | `NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND` | `local` | `github` |
   | `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | app slug | app slug |
   | `KEYSTATIC_GITHUB_CLIENT_ID` | id | id |
   | `KEYSTATIC_GITHUB_CLIENT_SECRET` | secret | secret |
   | `KEYSTATIC_SECRET` | random 40+ hex | same |

3. Set the GitHub App callback URLs to `http://localhost:3000/api/keystatic/github/oauth/callback` and `https://<prod-domain>/api/keystatic/github/oauth/callback`.
4. Flow in prod: a repo collaborator logs in at `/keystatic` via GitHub OAuth → edits commit to `Solimany04/tbarak-landing-page` → Vercel redeploys → `createReader` serves the new content. Non-collaborators are rejected by the App.

> Note: the final `npm run build` was not executed inside the sandbox because Keystatic's dependency tree could not finish installing there (45s-per-command cap + the Windows drive is mounted via a filesystem that rejects npm's rename step). All source was instead verified structurally, and the Keystatic reader was run successfully against the seed data. Run `npm run build` locally to complete GATE 1/2/4.
