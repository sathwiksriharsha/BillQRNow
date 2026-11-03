# BillQRNow Workbench and Route Compliance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the overflowing UPI QR preview and make every generated tool route expose concise route-specific controls, compliance facts, structured data, and related links.

**Architecture:** Keep Astro static generation and browser-only PDF/QR processing. Extend route metadata as the single source for titles, compliance tables, FAQ content, and related links; render schema at the route layout. Keep archetype controls in the shared form component and pass uploaded image bytes into existing client-side PDF paths.

**Tech Stack:** Astro 5, TypeScript, Vitest, pdf-lib, qrcode.

**Spec:** User's direct requirements in the 2026-11-03 request (six laws, QR overflow, supplied logo as favicon); supporting context in `claude.md.txt` and the pasted audit.

## Global Constraints

- Static output only; no financial form values leave the browser.
- Every generated route remains dot-free and has unique title, description, canonical URL, one H1, compliance table, FAQs, schema, and related internal links.
- The UPI QR canvas must stay within its preview card at all viewport widths.
- All 8 requested handle pills and the sample loader remain usable.
- Uploaded business logos and signatures stay in browser memory and are embedded into exported PDFs.

## Review Focus

- Route-specific labels render on the correct archetypes; cover jewellery, pharmacy, transport, and HR letters in generated HTML tests.
- Region-specific tax facts stay distinct for UK VAT and Canada GST/HST pages.
- QR preview and workbench remain constrained and above the fold on narrow and wide layouts.
- Client-side image uploads do not create remote form actions or upload requests.
- Canonical URLs, schema JSON, sitemap, and all root-relative links remain valid after static generation.

---

### Task 1: Route metadata, titles, and structured content

**Files:** Modify `src/data/routes.ts`, `src/components/ToolPage.astro`, `src/layouts/SiteLayout.astro`; test `src/tests/seo_and_privacy.test.ts`.

**Interfaces:** `RoutePage` owns `title`, `complianceRows` (four label/value rows), and four FAQ question/answer records. Route helpers return in-silo related pages plus linked core hubs.

- [x] Write tests for every route's title formula, four distinct compliance rows, four FAQs, and contextual related links.
- [x] Run Vitest and verify the new assertions fail against existing route metadata.
- [x] Add route metadata and render the compliance table directly after the workbench, FAQ section, and SoftwareApplication/FAQPage/BreadcrumbList JSON-LD.
- [x] Build and run the SEO tests; verify all 60 tool routes and 66+ output pages are represented.

### Task 2: Workbench archetypes and client-side assets

**Files:** Modify `src/components/WorkbenchFields.astro`, `src/components/BillWorkbench.astro`, `src/scripts/workbench.ts`, `src/styles/global.css`, `src/layouts/SiteLayout.astro`; add favicon/logo assets; test `src/tests/seo_and_privacy.test.ts`.

**Interfaces:** Form fields use stable `data-key` values. Four route archetypes are specialized by slug: jewellery, pharmacy, transport bilty, and experience/relieving/NOC letters. Optional logo and signature inputs use `data-key="logoFile"` and `data-key="signatureFile"`.

- [x] Write built-HTML tests for all four archetypes, eight UPI handle pills, optional logo/signature file inputs, favicon, and a sample loader on every tool route.
- [x] Run tests and verify the new assertions fail.
- [x] Add the route-specific controls and load the supplied logo mark as the favicon.
- [x] Restrict QR canvas size to the preview card with responsive width/height rules, move the tool entry point into the top 500px, and move the six-link home quick switch above the fold.
- [x] Rebuild and verify the HTML assertions and all root-relative links.

### Task 3: PDF data flow and privacy-safe uploads

**Files:** Modify `src/scripts/workbench.ts`, `src/utils/pdfDocumentEngine.ts`; test `src/tests/engines.test.ts`.

**Interfaces:** Specialized fields are passed to a route-aware document builder; image uploads are decoded locally to PNG/JPEG bytes and embedded in pdf-lib output. Transport output contains three labeled copies. Jewellery totals apply the requested 3% item GST plus 5% making-charge GST.

- [x] Add failing PDF tests for the jewellery calculation and total, three-copy transport output, letter fields, and embedded PNG/JPEG assets.
- [x] Run the targeted Vitest tests and verify expected failures.
- [x] Implement route-aware PDF rendering and in-memory image embedding; retain existing GST/HRA/customs PDF paths.
- [x] Run engine tests and verify PDFs load with `pdf-lib`.

### Task 4: Static build audit and delivery

**Files:** Modify `src/tests/seo_and_privacy.test.ts`, `src/tests/engines.test.ts` as needed; rename `claude.md.txt` to `CLAUDE.md`.

- [x] Run `npm run build && npm test` and verify sitemap index/sitemap, dot-free slugs, unique metadata, schema, tables, and zero broken root-relative links across all generated HTML.
- [x] Review Git diff and status, then commit on `main` and push to the authorized `origin` if the configured repository is accessible.

