# Commit plan — staging the current working tree

Verified against the real diffs (`git diff`, file contents), not inferred.
Commit in order: later commits depend on earlier ones, so the tree stays buildable
at every step. Nothing is committed for you — run the `git add` block, then
`git commit` with the message below it.

---

## 1. `chore(deps)` — toolchain upgrade + new runtime dependencies

```bash
git add package.json package-lock.json css.d.ts UPGRADE.md docs/TS7_UPGRADE.md
```

```
chore(deps): upgrade toolchain to Next 16.2.11 / React 19.2.8 / TypeScript 6

Bump next and eslint-config-next to 16.2.11, react/react-dom to 19.2.8,
typescript to ~6.0.3 and @types/node to 24, and pin Node >= 24 via engines.

Add the dependencies the following commits need: next-intl, @keystatic/core,
@keystatic/next, resend, @react-email/components, react-hook-form,
@hookform/resolvers, zod, react-phone-number-input, libphonenumber-js,
@marsidev/react-turnstile, @vercel/functions, @vercel/speed-insights and sharp.
Drop i18next in favour of next-intl.

Add css.d.ts declaring side-effect CSS imports, needed once
noUncheckedSideEffectImports is on.

TypeScript 7 stays deferred — next.config.ts loading and typescript-eslint both
depend on the compiler JS API that 7.0 removed. See docs/TS7_UPGRADE.md.
Refs UPGRADE.md.
```

> `package.json` mixes version bumps with new feature deps and can't be split
> per-feature without `git add -p`. Landing it first keeps every later commit
> installable.

---

## 2. `chore(config)` — env handling

```bash
git add .gitignore .env.example
```

```
chore(config): whitelist .env.example and document required env vars

Un-ignore .env.example under the existing .env* rule and add it, covering
Keystatic storage kind and GitHub App credentials, Turnstile, Resend and
Upstash keys.
```

---

## 3. `build(i18n)` — next-intl wiring

```bash
git add next.config.ts next.config.mjs i18n/ messages/ lib/actions/locale.ts \
        components/LocaleSwitcher.tsx app/layout.tsx
```

```
build(i18n): set up next-intl with Arabic/English and cookie-based locale

Replace next.config.ts with next.config.mjs wrapped in createNextIntlPlugin.
Add i18n/config.ts (ar/en, ar default), i18n/request.ts resolving the locale
from the NEXT_LOCALE cookie, the en/ar message catalogs, a setLocale server
action and a LocaleSwitcher toggle.

Make the root layout async: read the locale via getLocale, drive html lang/dir
and DirectionProvider from it, and wrap the tree in NextIntlClientProvider.
Drop the unused Geist fonts and mount Vercel SpeedInsights.
```

> Deleting `next.config.ts` and adding `next.config.mjs` **must** be in this one
> commit — the app has no valid Next config in between.

---

## 4. `feat(i18n)` — localize the static sections

```bash
git add components/sections/A_Navbar.tsx components/sections/B_Hero.tsx \
        components/sections/C_About.tsx components/sections/E_ProductionProcess.tsx \
        components/sections/F_WhySection.tsx
```

```
feat(i18n): localize navbar, hero, about, process and why sections

Replace hardcoded Arabic copy with useTranslations lookups against the en/ar
catalogs, and swap the static AR flag button in the navbar for LocaleSwitcher.
Also widen the vertical spacing between process steps on desktop.
```

---

## 5. `feat(footer)` — localize footer + social icons

```bash
git add components/sections/J_FooterSection.tsx public/Icons/Facebook.svg \
        public/Icons/Google.svg public/Icons/Instagram.svg public/Icons/LinkedIn.svg
```

```
feat(footer): localize footer copy and swap in custom social icons

Pull footer strings from the message catalogs, replace the react-bootstrap-icons
glyphs with local Facebook, Instagram, LinkedIn and Google SVGs, and give the
product shortcuts a productId so they focus the right carousel card.
```

> Depends on commit 7 for `productId` to actually do anything — the prop is
> accepted either way, so this still builds.

---

## 6. `feat(cms)` — Keystatic core

```bash
git add keystatic.config.ts lib/content/reader.ts app/keystatic/ app/api/keystatic/
```

```
feat(cms): add Keystatic admin and content reader

Define bilingual products and feedbacks collections in keystatic.config.ts,
mount the admin UI at /keystatic and its route handler at /api/keystatic, and
expose a shared reader for server components. Storage is env-driven: local in
dev, GitHub in production.
```

---

## 7. `refactor(products)` — Keystatic-backed products

```bash
git add content/products/ lib/content/products.ts components/sections/D_Products.tsx \
        components/ProductCard.tsx components/ProductCarousel.tsx \
        components/NaviagtionButton.tsx app/utils/types.ts
```

```
refactor(products): source products from Keystatic instead of a hardcoded array

Move the ten products out of D_Products into content/products/*.json, read
through getProducts, which picks the locale's title/description and falls back
to Arabic when a translation is missing. Make the section a server component
that derives carousel direction from the active locale.

Localize the card CTA and carousel arrow labels, and add the missing
NavigationButtonProps type — including the optional productId that
NaviagtionButton already destructured.
```

---

## 8. `fix(assets)` — avatar folder typo

```bash
git add public/FeadbackAvatars/Ellipse.png public/FeedbackAvatars/ components/FeedbackCard.tsx
```

```
fix(assets): rename FeadbackAvatars to FeedbackAvatars

Correct the misspelled avatar folder and add the three placeholder avatars.
Point FeedbackCard at the new path and drop its hardcoded Arabic fallback
name, role and quote — the data now always comes from the caller.
```

> Staging the deletion and the additions together lets Git record it as a rename,
> and keeping FeedbackCard here means no commit points at a deleted file.

---

## 9. `refactor(feedback)` — Keystatic-backed testimonials

```bash
git add content/feedbacks/ lib/content/feedbacks.ts \
        components/sections/G_FeedbackSection.tsx components/FeedbackCarousel.tsx
```

```
refactor(feedback): source testimonials from Keystatic

Move the dummy feedback array into content/feedbacks/*.json, read through
getFeedbacks with the same locale fallback as products, and assign avatars
round-robin from the placeholder set. Localize the section heading, widen the
carousel track and tighten the edge fade.
```

---

## 10. `feat(contact)` — working contact form

```bash
git add app/api/contact/ lib/actions/contact/ lib/emails/ \
        components/ContactForm.tsx components/sections/H_ContactSection.tsx \
        app/globals.css docs/CONTACT_FORM_PLAN.md
```

```
feat(contact): submit the contact form to a validated, rate-limited API route

Add POST /api/contact with content-type and body-size guards, a honeypot,
Zod validation, Turnstile verification, Upstash sliding-window rate limiting
keyed on client IP, and Resend delivery of an owner notification plus a
customer auto-reply.

Wire ContactForm to it with react-hook-form and a Zod schema built from
localized messages, add a phone field backed by react-phone-number-input, and
render success and error states. Localize the surrounding section copy.

Add the unlayered .phone-field CSS overrides that pull the country flag out of
the input's flex row and keep the number LTR while the field follows page
direction — Tailwind utilities can't win against the library's unlayered rules.
```

---

## 11. `docs` — planning and setup notes

```bash
git add docs/IMPLEMENTATION_PLAN_i18n_Keystatic.md docs/i18n_keystatic_SETUP.md \
        docs/walkthrough.md "docs/Deployment claude Chat.md"
```

```
docs: add i18n/Keystatic implementation plan, setup guide and walkthrough
```

> `docs/Deployment claude Chat.md` is a raw chat transcript — consider renaming
> it to `docs/deployment-notes.md` or leaving it out.

---

## Known issues found while reading the diffs

Fix before or after the relevant commit — none of them block the split.

1. **Broken footer icons** (`components/sections/J_FooterSection.tsx`) — the four
   local icon components pass `src="../../public/Icons/Facebook.svg"` to
   `next/image`. Public assets are served from the root, so these must be
   `/Icons/Facebook.svg`. There is also a stray top-level
   `import "../../public/Icons/Facebook.svg"` that does nothing.
2. **Product 1 has no image** — `content/products/1.json` stores
   `"images": [null]`. `getProducts` filters the null out, so `productImage`
   ends up `[]` and the placeholder fallback (`entry.images.length`) never
   fires. Either set a real filename or check the filtered array instead.
3. **Stray content entry** — `content/feedbacks/123.json` sits between slugs
   1 and 3; numeric sort puts it last. Rename to `2.json` if that was the intent.
4. **`react-bootstrap-icons`** is still in `package.json` but its footer import
   is now commented out. Check for other uses before dropping it.
5. **Line endings** — Git warns LF→CRLF on nearly every file. Adding a
   `.gitattributes` with `* text=auto eol=lf` (in commit 2) stops the churn.

## Before you start

- Verify as you go: `npm run build && npm run lint` at least once at the end.
- Sanity check the split: `git log --oneline --stat` should show no file twice.
- Delete this file when done — it's scratch, not part of the deliverable.
