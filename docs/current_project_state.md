# Current Project State

This document outlines the exact codebase structure, rendering methods, static data locations, and configuration details for the landing page project prior to integrating **Keystatic CMS** and **`next-intl` (Bilingual English/Arabic)**.

---

## 1. App Structure & Routing State

* **App Router Location:** 
  * Located in the root `app/` directory (no `src/app/` folder).
* **Exact Paths for Root Layout & Page:**
  * Root Layout: `app/layout.tsx`
  * Root Page: `app/page.tsx`
* **Middleware State:**
  * There is **no** existing `middleware.ts` file in the workspace root or `app/` directory.
* **Next.js Configuration:**
  * File path: `next.config.ts` (root)
  * Current content:
    ```typescript
    import type { NextConfig } from "next";

    const nextConfig: NextConfig = {
      /* config options here */
    };

    export default nextConfig;
    ```

---

## 2. Target Entities (Products & Feedback)

### A. Products
* **Component File Paths:**
  * Section wrapper: `components/sections/D_Products.tsx`
  * Card component: `components/ProductCard.tsx`
  * Page location: Imported and rendered directly in `app/page.tsx`
* **Server vs. Client Component State:**
  * `D_Products.tsx` is a **Client Component** (marked with `"use client";`).
  * `ProductCard.tsx` does not have a `"use client"` directive, but runs as a **Client Component** because it is imported and rendered inside the client-side carousel of `D_Products.tsx`.
* **Static/Mock Data Location:**
  * The product data array (`productsList`) is hardcoded directly inside `components/sections/D_Products.tsx` (lines 48–119).
  * Structure per item:
    ```typescript
    {
      productId: number,
      productTitle: string,
      productDesc: string,
      productImage: string
    }
    ```

### B. Feedback
* **Component File Paths:**
  * Section wrapper: `components/sections/G_FeedbackSection.tsx`
  * Card component: `components/FeedbackCard.tsx`
  * Page location: Imported and rendered directly in `app/page.tsx`
* **Server vs. Client Component State:**
  * `G_FeedbackSection.tsx` is a **Server Component** (no `"use client"` directive).
  * `FeedbackCard.tsx` is executed as a **Server Component** as it is imported by `G_FeedbackSection.tsx`.
* **Static/Mock Data Location:**
  * The feedback data is **hardcoded directly inside the JSX** of `components/FeedbackCard.tsx` (lines 15–21). 
  * *Note:* The parent wrapper `G_FeedbackSection.tsx` instantiates the card with empty props (`<FeedbackCard avatar='' name='' desc='' content=''/>`), which are currently ignored by the card's implementation.

---

## 3. Assets & Configuration

* **Image Reference & Storage:**
  * Stored in the `public/` directory inside dedicated subfolders:
    * Products: `public/Products/` (e.g., `public/Products/Picture 1.png`)
    * Feedback Avatars: `public/FeadbackAvatars/` (e.g., `public/FeadbackAvatars/Ellipse.png`)
  * Referenced using root-relative path strings:
    * `/Products/Picture 1.png`
    * `/FeadbackAvatars/Ellipse.png`
* **Path Aliases in `tsconfig.json`:**
  * `"@/*": ["./*"]` (maps the `@` alias directly to the workspace root directory).
* **Package Versions in `package.json`:**
  * Next.js: `"next": "16.1.6"`
  * React / React DOM: `"react": "19.2.3"`, `"react-dom": "19.2.3"`
