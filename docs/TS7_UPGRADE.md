# TypeScript 7 upgrade — status & plan

**Status:** Deferred. The project stays on TypeScript 5 so `dev`, `build`, and `lint` all work.
**Reason:** Two tools in this stack embed the TypeScript compiler's programmatic JS API, which TS 7.0 removed (it returns in TS 7.1). Both break under TS7.

## Background

TypeScript 7.0 is the native Go port of the compiler (~10x faster type-checking). It ships as the normal `typescript` npm package, but its `typescript` module no longer exposes the JS API (`ts.createSourceFile`, `ts.createProgram`, etc.). Any tool that *imports* the compiler rather than shelling out to the `tsc` binary is broken until the stable API lands in 7.1.

For this repo, `tsc --noEmit` (the binary) works fine under TS7 — only the API-dependent tooling fails.

## Blockers (must be resolved before upgrading)

1. **Next.js 16.1.6 config loader** — `next build` transpiles `next.config.ts` via the TS JS API and fails with `Cannot read properties of undefined (reading 'fileExists')`.
   - Workaround: use `next.config.mjs` (plain ESM, no TS transpile). See snippet below.
   - Real fix: a Next.js release that loads `.ts` config without the removed API, or that shells to the native binary.

2. **`typescript-eslint` 8.64 (bundled by `eslint-config-next` 16.1.6)** — requires `typescript >=4.8.4 <6.1.0` and calls the removed API, so `npm run lint` fails with `Cannot read properties of undefined (reading 'Cjs')` / `Cannot find module '@typescript/old'`.
   - No clean workaround: `typescript` is a hoisted peer dependency, so you can't run `tsc` on 7.x while giving the linter a separate 5.x copy.
   - Real fix: upgrade `eslint-config-next` / `typescript-eslint` to a TS7-compatible release, or wait for TS 7.1's stable API.

## What already works under TS7 (keep these when upgrading)

- **`tsconfig.json`** needs no changes — it has no deprecated/hard-error flags and is already `strict`.
- **CSS side-effect imports** — TS7 defaults `noUncheckedSideEffectImports: true`, which rejects `import "x.css"`. Fix with an ambient declaration at project root (`css.d.ts`):

  ```ts
  // Required under TypeScript 7's noUncheckedSideEffectImports default (true).
  declare module "*.css";
  ```

  (Harmless under TS5, so it can stay in the repo as prep.)

- **`next.config.mjs`** (instead of `next.config.ts`):

  ```js
  import createNextIntlPlugin from 'next-intl/plugin';

  const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    /* config options here */
  };

  export default withNextIntl(nextConfig);
  ```

## Upgrade procedure (when the blockers above are cleared)

1. Confirm `eslint-config-next` / `typescript-eslint` versions support TS7 (or move to TS 7.1).
2. Set `"typescript": "^7.0.2"` in `devDependencies`.
3. Add the `css.d.ts` declaration above.
4. Convert `next.config.ts` → `next.config.mjs` (or keep `.ts` if the Next release supports it).
5. `npm install`
6. Verify: `npx tsc --noEmit`, `npm run build`, `npm run lint`.
7. In CI, tune worker count if desired (`tsc --checkers 8` on larger runners).

## Re-check triggers

Revisit this upgrade when any of the following ship:
- TypeScript 7.1 (stable programmatic API).
- A `typescript-eslint` release supporting TS7.
- A `next` / `eslint-config-next` release supporting TS7.
