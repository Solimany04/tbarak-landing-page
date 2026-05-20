# Technical Specification & Architecture Decisions

**Subject:** Next.js + Keystatic CMS with Field-Level Bilingual Support (EN/AR)

## 1. Core Stack

- **Framework:** Next.js (App Router).
    
- **CMS:** Keystatic (Embedded Admin UI).
    
- **Storage Strategy:** Local repository files (JSON or YAML preferred over Markdown, as all text is plain text and JSON/YAML natively handle nested translation objects cleaner).
    
- **i18n Library:** `next-intl`.
    

## 2. Internationalization (i18n) Routing Strategy

**Decision:** Subpath routing using Next.js App Router dynamic segments and `next-intl` middleware.

- **Supported Locales:** `en` (English), `ar` (Arabic).
    
- **URL Structure:** `[domain.com/](https://domain.com/)[locale]/path` (e.g., `/en/products`, `/ar/products`).
    
- **Implementation Mechanics:**
    
    - A Next.js `middleware.ts` will intercept requests to detect user language preference and redirect to the appropriate `/[locale]` subpath.
        
    - The entire application resides within `app/[locale]/layout.tsx`.
        
    - Static UI elements (non-CMS text) will be handled via standard `next-intl` message dictionaries (`messages/en.json`, `messages/ar.json`).
        

## 3. Keystatic CMS Content Modeling

**Decision:** Field-Level Translation via Unified Objects.

- **Admin Experience:** The admin will manage both English and Arabic translations concurrently on a single page for each entry.
    
- **Asset Management:** Images are defined globally at the entry level, not duplicated per language.
    

### 3.1. Field Structure Design Pattern

For any localized plain text field, we will implement a custom Keystatic `fields.object` pattern:

TypeScript

```
// Reusable Keystatic i18n field pattern
const i18nTextField = (label: string) => fields.object({
  en: fields.text({ label: `${label} (English)` }),
  ar: fields.text({ label: `${label} (Arabic)` }),
});
```

### 3.2. Defined Collections

Based on the current requirements, Keystatic collections will be structured as follows:

**A. Products Collection**

- `image`: `fields.image` (Shared between locales)
    
- `title`: `i18nTextField("Title")`
    
- `description`: `i18nTextField("Description")`
    

**B. Feedback Collection**

- `name`: `i18nTextField("Name")`
    
- `desc`: `i18nTextField("Short Description")`
    
- `content`: `i18nTextField("Content")`
    

## 4. Keystatic Integration Details

- **Route Setup:** Keystatic Admin UI will be mounted outside the `[locale]` segment (e.g., `app/keystatic/[[...params]]/page.tsx` and `app/api/keystatic/[...params]/route.ts`) to prevent the CMS interface itself from being intercepted by the i18n middleware routing rules.
    
- **Data Fetching:** Content will be read directly from the file system using Keystatic's `createReader` API on the server components. The current `[locale]` param from the App Router will be used to dynamically select either the `.en` or `.ar` property from the fetched CMS objects.
    

## 5. Expected Directory Structure (High-Level)

Plaintext

```
├── keystatic.config.ts        # Keystatic schema defining collections and i18n field objects
├── content/                   # Stored CMS files (committed to git)
│   ├── products/              # e.g., product-1.json (contains both en/ar data + 1 image path)
│   └── feedback/              
├── messages/                  # next-intl static dictionaries
│   ├── en.json
│   └── ar.json
├── middleware.ts              # next-intl locale routing logic
└── src/app/
    ├── api/keystatic/         # Keystatic API routes
    ├── keystatic/             # Keystatic Admin UI pages (exempt from i18n)
    └── [locale]/              # Main bilingual application
        ├── layout.tsx         
        └── products/page.tsx  # Server Component fetching via Keystatic Reader
```