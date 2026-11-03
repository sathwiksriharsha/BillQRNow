# CLAUDE.md — Master Architecture & Engineering Specification
## Project: BillQRNow — 100% Client-Side Dynamic UPI QR Code, GST Tax Invoice, HRA Rent Receipt & US Commercial Invoice / Packing List PDF Suite

---

## 1. MISSION & CORE ARCHITECTURE
Build **BillQRNow** (`https://billqrnow.pages.dev`), a 100% client-side billing, dynamic payment QR, tax compliance, and international shipping document workbench serving two high-intent markets at **₹0.00 infrastructure cost**:
1. **India FinTech & SMB Market (High Volume + $8–$12 FinTech RPM):** Dynamic Amount-Locked NPCI UPI QR Generator (`upi://pay`), Auto-State-Code GST Tax Invoice PDF Generator (`CGST+SGST` vs. `IGST` + HSN/SAC + Indian Lakhs/Crores in words + embedded UPI QR), 12-Month Batch HRA Rent Receipt PDF Generator, and Salary Slip / Voucher PDF Maker.
2. **United States & Global B2B Market ($24–$38 Accounting/Shipping RPM):** 1-Click Dual-Export **Commercial Invoice + Packing List PDF Generator** (with HS Codes, Incoterms `DDP`/`DAP`/`FOB`, `kg`/`lbs` weight auto-conversion), US 1099 Contractor Invoice with embedded Stripe/PayPal/Venmo QR Code, and Late Fee Calculator.

- **Strict Static Output (`output: 'static'`):** Everything executes in browser RAM via `pdf-lib` and pure client-side QR matrix canvas rendering. Zero backend servers, zero database, zero login walls, zero watermarks.
- **Canonical Domain:** `const siteUrl = process.env.PUBLIC_SITE_URL || 'https://billqrnow.pages.dev';` in both `astro.config.mjs` (with `@astrojs/sitemap`) and `src/config/site.ts`.

---

## 2. CORE MATHEMATICAL & PDF ENGINES (`src/utils/`)

### 2.1 Dynamic NPCI UPI URI & Client-Side QR Matrix Engine (`src/utils/upiQrEngine.ts`)
- Construct RFC-compliant NPCI deep links:
  `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`
  (Omit `am` only when the user explicitly selects "Static Open-Amount QR").
- Validate UPI ID (VPA) format (`^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$`) with helpful bank handle presets (`@okaxis`, `@okicici`, `@okhdfcbank`, `@oksbi`, `@ybl`, `@paytm`, `@ibl`, `@upi`).
- Also support **US/Global Payment Link QR Mode** (validating `https://` links for Stripe Payment Links, PayPal.me, Venmo, Square, Wise) for US freelancers.
- Render crisp, scannable QR codes entirely in-browser (using `qrcode` npm package or zero-dependency Canvas/SVG matrix generator) and support exporting:
  1. **High-Res PNG Payment Card / Printable Shop Standee** (showing Business Name, Exact Locked Amount `₹4,350.00`, Invoice Reference, UPI ID, and Supported App Badges).
  2. **Embedded QR Image Bytes** directly inside generated `pdf-lib` GST & Freelance Invoices.

### 2.2 Indian GST Tax Math & Number-to-Words Engine (`src/utils/gstEngine.ts`)
- **State Code Detection from GSTIN (First 2 Digits):**
  - Maintain a complete lookup map of all 38 Indian State/UT GST codes (`01` Jammu & Kashmir through `36` Telangana, `37` Andhra Pradesh, `38` Ladakh, `97` Other Territory).
  - If `sellerStateCode === buyerStateCode`, compute **Intra-State Tax**: split each line item's GST rate (`0%, 5%, 12%, 18%, 28%`) evenly into **`CGST (rate/2)%` + `SGST (rate/2)%`**.
  - If `sellerStateCode !== buyerStateCode`, compute **Inter-State Tax**: apply 100% of the tax rate to **`IGST (rate)%`**.
- **Indian & International Number-to-Words Converter:**
  - `amountToIndianWords(145250)` -> `"Rupees One Lakh Forty-Five Thousand Two Hundred Fifty Only"` (supporting Paise when decimals exist).
  - `amountToUSDWords(4250.50)` -> `"Four Thousand Two Hundred Fifty Dollars and Fifty Cents Only"`.

### 2.3 Vector PDF Document Generator (`src/utils/pdfDocumentEngine.ts` using `pdf-lib`)
Generate clean, print-ready A4 and US Letter vector PDFs in browser RAM across **4 Specialized Document Modes**:
1. **Mode A — GST Tax Invoice / Proforma / Quotation / Bill of Supply PDF:**
   - Seller & Buyer blocks (Name, Address, GSTIN, State Name & Code), Invoice #, Date, Due Date, Place of Supply.
   - Line items table (`# | Description | HSN/SAC | Qty | Rate | Taxable Value | CGST/SGST or IGST | Total`).
   - Summary block with Subtotal, Tax Breakdown table, Grand Total, **Amount in Words**, Bank Account / NEFT / IFSC details, **Embedded Dynamic Amount-Locked UPI QR Code** (scannable right off the PDF!), and Authorized Signatory box.
2. **Mode B — US & International "Dual Export" Commercial Invoice + Packing List PDF:**
   - Single unified input table (`Description | HS Tariff Code | Country of Origin | Qty | Unit Price USD | Net Wt (kg) | Gross Wt (kg)` + Exporter/Consignee/Carrier/AWB/Incoterms `DDP`/`DAP`/`FOB`/`EXW`).
   - **1-Click Dual Export:**
     - Button 1: **Download Commercial Invoice PDF** (with HS Codes, Unit Prices, Total Customs Value, Incoterms & Customs Declaration Signature Block).
     - Button 2: **Download Matching Packing List PDF** (automatically hides prices and outputs Carton #, Net Weight in `kg & lbs`, Gross Weight in `kg & lbs`, Total Packages, and Dimensions).
     - Button 3: **Download Combined 2-Page Customs Bundle PDF** (Page 1: Commercial Invoice, Page 2: Packing List).
3. **Mode C — 12-Month Batch HRA Rent Receipt PDF Generator:**
   - Inputs: Tenant Name, Landlord Name, Landlord PAN (auto-flags mandatory warning if annual rent > `₹1,00,000`), Monthly Rent (`₹`), Property Address, Start Month/Year, End Month/Year, Payment Mode (UPI/Bank Transfer/Cash).
   - Automatically generates a multi-receipt A4 PDF (3 receipts per A4 page) with formal HRA declaration text, receipt period, amount in words, and a **`[ Affix ₹1 Revenue Stamp Here ]`** signature box for every month in the selected date range.
4. **Mode D — Employee Salary Slip / Payment Voucher / US 1099 Contractor Invoice PDF:**
   - Clean Earnings (Basic, HRA, Special Allowance, Bonus) vs. Deductions (EPF, Professional Tax, TDS) payslip table with Net Take-Home Pay in words.

---

## 3. CONTEXT-AWARE 1-CLICK SAMPLE LOADER (`src/utils/samplePresets.ts`)
Every single route must include a **"⚡ Load Realistic Sample Data"** button that populates the exact document type for that URL and renders a live preview + downloadable PDF in 1 click:
- On UPI QR pages: Loads a `₹2,499.00` locked UPI payment (`merchant@okicici`, `INV-2026-402`) and renders the scannable QR + downloadable standee immediately.
- On GST Invoice pages: Loads a realistic 3-item Hyderabad (`36`) to Bengaluru (`29`) B2B GST invoice with HSN codes and embedded UPI QR.
- On HRA Rent Receipt pages: Loads a 12-month (`Apr 2026 – Mar 2027`) `₹18,500/mo` rent receipt batch.
- On US Commercial Invoice / Packing List pages: Loads a 3-item US-to-UK DHL Express shipment with 6-digit HS codes, `DDP` Incoterms, and `kg/lbs` weights.

---

## 4. COMPLETE PROGRAMMATIC ROUTE MATRIX (66+ STATIC PAGES, ZERO DOTS IN SLUGS)

### Silo 1: Dynamic UPI QR & Indian GST Billing Suite (`src/pages/[slug].astro` — 24 Routes)
1. `upi-qr-code-generator` — **Dynamic UPI QR Code Generator with Locked Amount (Free, No Commission)**
2. `upi-payment-link-generator` — **Create Shareable WhatsApp UPI Payment Link & Amount-Locked QR Card**
3. `gst-invoice-generator` — **Free GST Invoice Generator Online (Auto CGST/SGST/IGST & Embedded UPI QR PDF)**
4. `proforma-invoice-generator` — **Free Proforma Invoice Generator PDF (India GST & Export Ready)**
5. `bill-of-supply-generator` — **GST Composition Scheme Bill of Supply PDF Generator (0% Tax)**
6. `quotation-maker-online` — **Free Business Quotation & Estimate PDF Generator with UPI QR**
7. `purchase-order-generator` — **Free B2B Purchase Order (PO) PDF Generator Online**
8. `delivery-challan-generator` — **GST Delivery Challan PDF Format Generator (Job Work & Goods Movement)**
9. `credit-note-debit-note-generator` — **GST Credit Note & Debit Note PDF Generator**
10. `freelance-invoice-generator-india` — **Indian Freelancer Invoice Generator (SAC 998314, LUT Export & UPI QR)**
11. `cash-receipt-voucher-generator` — **Printable Cash Payment & Petty Cash Voucher PDF Generator**
12. `payment-receipt-generator` — **Customer Advance & Payment Receipt PDF Generator**
13. `shop-upi-standee-qr-maker` — **Printable Shop Countertop UPI QR Standee Poster Maker (GPay, PhonePe, Paytm)**
14. `whatsapp-bill-maker-with-upi-qr` — **Instant WhatsApp Bill & Image Invoice Maker with Amount-Locked UPI QR**
15. `jewellery-gst-invoice-generator` — **Gold & Jewellery GST Invoice Generator (3% GST on Gold + 5% Making Charges)**
16. `restaurant-food-bill-generator` — **Restaurant & Cloud Kitchen GST Bill Generator (5% GST Format)**
17. `medical-pharmacy-bill-generator` — **Medical Store & Pharmacy Bill Format PDF Generator (Batch, Expiry & HSN)**
18. `transport-bilty-lr-generator` — **Transport LR (Lorry Receipt / Bilty) & Freight Bill PDF Generator**
19. `coaching-institute-fee-receipt-generator` — **Coaching & School Tuition Fee Receipt PDF Generator**
20. `gym-membership-invoice-generator` — **Gym & Fitness Studio Membership Receipt PDF Generator**
21. `hotel-room-bill-invoice-generator` — **Hotel Stay & Tariff GST Invoice PDF Generator (For LTA & Corporate Claims)**
22. `car-cab-rental-bill-generator` — **Tour, Travels & Cab Taxi Bill PDF Generator (Per KM & Driver Allowance)**
23. `number-to-words-rupees-converter` — **Convert Amount to Indian Rupees in Words (Lakhs & Crores Cheque/Invoice Helper)**
24. `gst-state-code-hsn-lookup` — **Complete Indian GST State Code List (01 to 38) & Common HSN/SAC Directory**

### Silo 2: Salaried Employee & HR Compliance Document Suite (14 Routes)
25. `hra-rent-receipt-generator` — **Free HRA Rent Receipt Generator PDF (12-Month Batch & ₹1 Revenue Stamp Box)**
26. `salary-slip-generator` — **Free Monthly Salary Slip & Payslip PDF Generator Online**
27. `driver-salary-receipt-generator` — **Driver Salary Receipt PDF Generator (For Corporate Tax Reimbursement)**
28. `domestic-help-salary-receipt` — **Helper & Maid Salary Receipt Voucher Generator**
29. `lta-travel-bill-summary-generator` — **LTA (Leave Travel Allowance) Claim Annexures & Summary Sheet PDF**
30. `medical-reimbursement-bill-summary` — **OPD Medical Reimbursement Claim Summary Sheet Generator**
31. `experience-certificate-format-generator` — **Employee Work Experience Letter PDF Generator**
32. `relieving-letter-generator` — **Formal Employee Relieving Letter PDF Generator**
33. `internship-completion-certificate-generator` — **Internship Certificate PDF Generator**
34. `no-objection-certificate-noc-generator` — **Address Proof & Landlord/Employer NOC PDF Generator**
35. `gift-deed-format-india-pdf` — **Family Relative Tax-Free Gift Deed Declaration Format PDF**
36. `loan-emi-receipt-voucher` — **Personal & Hand Loan Repayment Receipt PDF Generator**
37. `society-maintenance-bill-generator` — **Apartment & RWA Monthly Maintenance Receipt PDF Generator**
38. `donation-receipt-80g-format` — **Trust & NGO Donation Receipt PDF Format Generator**

### Silo 3: High-RPM US & Global B2B Invoicing & Customs Export Suite (`src/pages/us/[slug].astro` — 22 Routes)
39. `us/commercial-invoice-generator` — **Free International Commercial Invoice PDF Generator (FedEx, DHL, UPS & Customs)**
40. `us/packing-list-generator` — **Export Packing List & Slip PDF Generator (Auto kg/lbs & Carton Totals)**
41. `us/commercial-invoice-and-packing-list` — **1-Click Combined Commercial Invoice & Packing List PDF Maker**
42. `us/1099-contractor-invoice-generator` — **US 1099 Independent Contractor Invoice PDF Generator (With Payment QR)**
43. `us/freelance-invoice-template-pdf` — **Free US Freelancer & Consultant Hourly/Fixed Invoice PDF Maker**
44. `us/stripe-paypal-qr-invoice-maker` — **Add a Scannable Stripe, PayPal, Venmo or Zelle QR Code to Any PDF Invoice**
45. `us/construction-invoice-generator` — **Construction & Handyman Labor + Materials Invoice PDF Generator**
46. `us/photography-videography-invoice` — **Photography & Creative Agency Deposit + Final Invoice PDF Maker**
47. `us/cleaning-service-invoice-generator` — **Residential & Commercial Cleaning Service Invoice PDF Generator**
48. `us/landscaping-lawn-care-invoice` — **Lawn Care & Landscaping Estimate & Invoice PDF Generator**
49. `us/auto-repair-mechanic-invoice` — **Auto Repair Shop Parts & Labor Invoice PDF Generator**
50. `us/Consulting-retainer-invoice` (`us/consulting-retainer-invoice`) — **B2B Consulting Retainer & Milestone Invoice PDF Generator**
51. `us/rent-receipt-generator-us` — **US Landlord Tenant Rent Receipt PDF Generator (Cash, Check, Zelle)**
52. `us/bill-of-sale-generator-pdf` — **General Personal Property & Equipment Bill of Sale PDF Generator**
53. `us/late-fee-interest-invoice-calculator` — **Overdue Invoice Late Fee Calculator & Past-Due Notice PDF Maker**
54. `us/proforma-export-invoice-generator` — **International Trade Proforma Invoice PDF Generator (Incoterms 2020)**
55. `us/fedex-dhl-customs-invoice-helper` — **FedEx & DHL Express International Customs Invoice PDF Builder**
56. `us/usps-international-customs-invoice` — **USPS Global Express & Priority Mail International Commercial Invoice**
57. `us/uk-vat-invoice-generator` — **UK VAT Invoice PDF Generator (20% Standard, 5% Reduced & Reverse Charge)**
58. `us/canada-gst-hst-invoice-generator` — **Canada GST / HST / PST Freelance & Small Business Invoice PDF Maker**
59. `us/australia-tax-invoice-abn-generator` — **Australia ATO-Compliant ABN Tax Invoice PDF Generator (10% GST)**
60. `us/eu-reverse-charge-b2b-invoice` — **EU Cross-Border B2B Reverse Charge VAT Invoice PDF Generator**

Plus Core Pages: `/`, `/all-tools`, `/about`, `/contact`, `/privacy`, `/terms`, `/robots.txt`.

---

## 5. AUTOMATED VITEST SUITE (`src/tests/`)
1. **`src/tests/engines.test.ts`:**
   - Verify NPCI UPI deep-link construction (`upi://pay?...`) with locked amounts, URL encoding, and VPA validation.
   - Verify GST state-code extraction (`36` vs `29`) and exact mathematical split between Intra-State (`CGST + SGST`) and Inter-State (`IGST`).
   - Verify Indian Rupees-in-Words conversion across Hundreds, Thousands, Lakhs, Crores, and Paise.
   - Verify `pdf-lib` PDF generation across all 4 document modes (validating `%PDF-` header bytes and page counts, including 12-month HRA rent receipt batching into 4 A4 pages at 3 receipts/page, and dual Commercial Invoice + Packing List generation).
2. **`src/tests/seo_and_privacy.test.ts`:**
   - Assert `dist/sitemap-index.xml`, `dist/sitemap-0.xml`, `dist/robots.txt`, `dist/_headers`, and `dist/_redirects` exist after `npm run build` and use `https://billqrnow.pages.dev`.
   - Assert ZERO literal dots in any route slug.
   - Crawl all 66+ built HTML files in `dist/` and verify unique `<title>`, unique `<meta name="description">`, single `<h1>`, valid canonical URLs, 0 broken internal `<a href="/...">` links, and zero external server uploads of financial data.