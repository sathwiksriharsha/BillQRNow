# BillQRNow

Static Astro 5 document generators for UPI payment QR codes, Indian GST invoices, HRA receipts, salary slips, and US/global customs paperwork. Forms and exports run in the visitor's browser; this project has no application backend.

## Local development

```sh
npm install
npm run dev
```

## Production build and checks

```sh
npm run build
npm test
```

The SEO test reads `dist/`, so build before running the tests. The production build emits 66 static pages, sitemap files, `robots.txt`, and Cloudflare `_headers`/`_redirects` files.

## Configuration

Set `PUBLIC_SITE_URL` to the deployed origin when building a non-default deployment. It defaults to `https://billqrnow.pages.dev`.

## Privacy and document review

Form values are processed locally and are not sent to an application server. Check generated totals and document contents against current business, tax, HR, banking, and customs requirements before issuing them. BillQRNow is a document tool, not professional tax, legal, or customs advice.
