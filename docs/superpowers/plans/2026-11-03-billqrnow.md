# BillQRNow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a complete static Astro 5 BillQRNow application with client-side UPI, GST, HR, US/global invoice tools, 66+ SEO pages, and passing build/engine/site audits.

**Architecture:** Astro static routes are generated from a typed page catalog. A shared layout renders each landing page and mounts a route-aware browser workbench; focused engines provide payment links, tax calculations, words, QR rendering, and PDFs. Vitest validates math, generated PDFs, and the built static site.

**Tech Stack:** Astro 5, TypeScript, Vitest, `pdf-lib`, `qrcode`, `@astrojs/sitemap`.

**Spec:** `docs/superpowers/specs/2026-11-03-billqrnow-design.md`; detailed route and feature source: `claude.md.txt`.

## Global Constraints

- `output: 'static'`; no server, database, login, watermark, or remote financial-data upload.
- Canonical base URL defaults to `https://billqrnow.pages.dev` and supports `PUBLIC_SITE_URL`.
- Build all routes in `claude.md.txt`, with no literal dots in route slugs.
- UPI locked amounts use two decimals; GSTIN state codes select split GST versus IGST.
- HRA emits 3 receipts per A4 page and flags missing PAN when annual rent exceeds ₹1,00,000.
- Commercial invoice and packing list share one item model and support matching, individual, and combined exports.
- Every route provides a context-specific one-click sample loader.

## Review Focus

- Invalid or absent amounts/VPAs: keep preview and generation safe and explain validation errors; test UPI validation and amount encoding.
- Different GSTIN lengths and unknown state codes: avoid a false same-state tax split; test extraction and fallback behavior.
- Decimal and large Indian currency values: preserve paise and Lakhs/Crores words; test boundary values.
- Long item/receipt lists: paginate without clipping; test HRA 12-month page count and multi-page customs PDFs.
- User data privacy: all form state stays in browser and links do not submit it; inspect generated HTML for external form actions.

---

### Task 1: Astro scaffold and page catalog

**Files:** Create `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/config/site.ts`, `src/data/routes.ts`, `src/pages/index.astro`, `src/pages/[slug].astro`, `src/pages/us/[slug].astro`, and shared styles/layout.

**Interfaces:** `routes.ts` exports the complete typed route catalog and `RoutePage` shape; Astro pages consume it for static paths.

- [ ] Create the Astro 5 static project config, dependencies, site config, catalog with all 60 listed tool pages, and core pages.
- [ ] Build shared SEO layout and top-of-home quick-switch links.
- [ ] Verify static path generation and unique route slugs.

### Task 2: Client-side math and QR engines

**Files:** Create `src/utils/upiQrEngine.ts`, `src/utils/gstEngine.ts`, `src/utils/samplePresets.ts`.

**Interfaces:** Export URI/VPA/payment-link validation, GSTIN state extraction and line totals, INR/USD words, and route-mode sample objects.

- [ ] Add `src/tests/engines.test.ts` cases for locked UPI URL, validation, state tax modes, currency words, and presets.
- [ ] Run focused Vitest and verify expected failure.
- [ ] Implement the engine functions and rerun focused tests.

### Task 3: Browser PDF engine

**Files:** Create `src/utils/pdfDocumentEngine.ts`.

**Interfaces:** Export typed mode inputs and functions returning `Promise<Uint8Array>` for GST, rent batch, salary/1099, and customs invoice/packing/combined PDFs.

- [ ] Add PDF header/page-count tests, including 12 rent months => 4 A4 pages and customs bundle => 2 pages.
- [ ] Implement vector PDF builders, embedded QR image on GST, and separate/combined customs exports.
- [ ] Rerun engine tests.

### Task 4: Route-aware interactive workbench

**Files:** Create `src/components/BillWorkbench.astro`, client-side workbench module, and route-specific presentation components/styles as needed.

**Interfaces:** Consume `RoutePage`, preset model, engine APIs, and route slug; expose sample load, live preview, download, and copy controls.

- [ ] Add all required mode forms, bank handle pills, dynamic QR Canvas, standee export, WhatsApp copy, GST builder controls, rent/salary controls, and dual customs exports.
- [ ] Add the exact one-click sample action to every route and verify each mode sample renders and exports.

### Task 5: Core pages and SEO/privacy audit

**Files:** Create core pages, `public/robots.txt`, Cloudflare `_headers`/`_redirects`, sitemap config, and `src/tests/seo_and_privacy.test.ts`.

- [ ] Add tests for sitemap files, metadata uniqueness, canonical paths, one H1, internal links, slugs, and no external form submissions.
- [ ] Implement all core route pages, cross-links, sitemap, robots, privacy/terms/about/contact, and static host headers.
- [ ] Run `npm run build && npm test`, fix issues, and verify the 66+ page crawl passes.

### Task 6: GitHub publication

**Files:** all project files.

- [ ] Initialize Git on `main`, inspect the staged file list, and commit the completed project.
- [ ] Configure `origin` to `https://github.com/sathwiksriharsha/BillQRNow.git`; check repository/credentials availability.
- [ ] Push `main` and confirm the resulting remote branch/commit.
