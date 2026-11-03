# BillQRNow Design

## Intent

Build a static Astro 5 site for India-focused UPI/GST/HR documents and US/global billing and customs documents. Visitors can use generators entirely in their browser, preview results, and download print-ready PDFs or QR artwork without accounts or server-side financial-data uploads.

## Goals

- Generate all 66+ SEO landing pages listed in `claude.md.txt`, plus core pages, with unique metadata, canonical URLs, crawlable internal links, and sitemap/robots/Cloudflare static-host files.
- Provide one route-aware, client-side workbench with sample data on every page.
- Implement UPI/payment URL and QR, GST math and words, vector PDF templates, HRA batching, salary/1099, and US commercial invoice/packing-list calculations and exports.
- Prove core engines and built-site SEO/privacy properties in the requested Vitest suites.
- Initialize `main`, commit, connect `origin`, and push to the specified GitHub repository.

## Architecture and implementation calls

- Astro 5 with `output: 'static'`; data-driven `getStaticPaths()` routes render the full route matrix from a typed catalog.
- Shared layouts and a route-aware Astro workbench hydrate as a client-side island. Use browser Canvas QR rendering backed by `qrcode`, and `pdf-lib` for browser-generated PDFs.
- Keep business math in focused TypeScript utility modules, route metadata in a catalog, sample state in presets, and document rendering in the PDF engine.
- Use one deterministic PDF engine with mode-specific page builders, including QR PNG embedding for the GST invoice and two-page customs bundle.
- All generated documents remain in browser memory; no upload endpoint or analytics payload carries form data.
- Target the current requested sample cases and exact static host `https://billqrnow.pages.dev` by default, overridable with `PUBLIC_SITE_URL`.

## Constraints

- No backend, database, login, or watermark.
- Keep all route slugs free of literal dots; normalize case in URLs.
- Amount-locked UPI links include an exact two-decimal INR amount unless open-amount mode is explicitly selected.
- GST state codes drive CGST+SGST versus IGST. HRA includes three receipts per A4 page and PAN threshold handling.
- US export documents support DDP/DAP/FOB/EXW, HS codes, origin, weights, dual exports, and combined export.
- Build and run `npm run build && npm test`; push only after local checks pass.

## Non-goals

- Persisting customer financial or identity data remotely.
- Claiming legal or tax certification; pages provide document tools and clear user-editable templates.
- Adding third-party payment processing; QR codes encode user-provided links only.

## Open implementation decisions

- Use standard browser print-ready vector PDFs sized A4 or US Letter as specified by each document family.
- Generic routes share the closest relevant invoice/receipt template while route-specific headings and copy stay unique.
- When repository or GitHub credentials are unavailable, finish local artifacts and report the exact push blocker rather than fabricating a successful push.
