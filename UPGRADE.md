# Dependency Upgrade — July 2026

## Done (applied to this repo, safe patch/minor bumps)

`package.json` + `package-lock.json` updated to:

| Package | From | To |
|---|---|---|
| next | 16.2.10 | **16.2.11** |
| react / react-dom | 19.2.7 | **19.2.8** |
| next-intl | 4.13.2 | **4.13.3** |
| resend | 6.14.0 | **6.18.0** |
| @types/node | 20 | **24** |
| eslint-config-next | 16.2.10 | 16.2.11 |

Also added `"engines": { "node": ">=24" }` — **Node 24** is the current Active LTS (supported to Apr 2028). Install it locally, then:

```bash
npm install
npm run build && npm run lint
```

The lockfile was resolved with no peer-dependency conflicts. Tailwind (4.3.3), keystatic-next, radix, zod, etc. were already at their latest within-range versions.

## Staged majors (do one at a time, `npm run build` + `npm run lint` between each)

These were intentionally **not** applied — each is a major with breaking-change risk, and this project should be built + tested locally after each.

### 1. lucide-react 0.563 → 1.25  — LOW RISK ✅
Only icons used here are `ArrowLeft`, `ArrowRight`, `ChevronDown`, `Mail`, `MapPin` — none are brand icons (removed in v1) and none were renamed. Note v1 sets `aria-hidden="true"` by default.
```bash
npm i lucide-react@^1.25.0
```

### 2. @keystatic/core 0.5.51 → 0.6  — LOW/MED RISK
Minor 0.x bump; review the Keystatic changelog for config/schema changes, then verify the `/keystatic` admin route and `keystatic.config.ts` still load.
```bash
npm i @keystatic/core@^0.6.0
```

### 3. ESLint 9 → 10  — MED RISK
Requires an `eslint-config-next` release that supports ESLint 10. Bump both together; the flat config in `eslint.config.mjs` should carry over.
```bash
npm i -D eslint@^10 eslint-config-next@latest && npm run lint
```

### 4. TypeScript 6 → 7  — HOLD / HIGH RISK ⚠️
TypeScript 7 (the Go "native" compiler) went GA July 8 2026 and is 8–12x faster, **but it ships without a stable programmatic API**. That breaks API-dependent tooling — including `typescript-eslint`, which `eslint-config-next` uses for type-aware linting. Upgrading now will likely break `npm run lint`.

**Recommendation: stay on TypeScript 6 until `eslint-config-next` / `typescript-eslint` officially support TS 7.** "Best stable" here means TS 6, not TS 7. Re-evaluate once TS 7.1 (planned stable API) lands and Next's lint stack supports it.

## Note on this environment
Full `npm install` + build could not be run in the assistant sandbox — its outbound proxy throttles package downloads (~30s each) and stalls on native-module postinstall steps. Run the commands above on your machine, where install is fast and reliable.
