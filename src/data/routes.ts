export type WorkMode = 'upi-qr' | 'payment-qr' | 'gst-invoice' | 'hra-rent' | 'hr-docs' | 'late-fee' | 'us-customs-b2b';
export type ComplianceRow = { label: string; value: string };
export type RouteFaq = { question: string; answer: string };
export type RoutePage = { slug: string; title: string; description: string; mode: WorkMode; category: string; headline: string; intro: string; complianceRows: ComplianceRow[]; faqs: RouteFaq[] };
const india = [
['upi-qr-code-generator','Dynamic UPI QR Code Generator with Amount Fixed (Free, No Commission)','upi-qr','Payments'],['upi-payment-link-generator','Create Shareable WhatsApp UPI Payment Link & Amount-Locked QR Card','upi-qr','Payments'],
['gst-invoice-generator','Free GST Invoice Generator PDF with Embedded UPI QR Code','gst-invoice','GST billing'],['proforma-invoice-generator','Free Proforma Invoice Generator PDF (India GST & Export Ready)','gst-invoice','GST billing'],['bill-of-supply-generator','GST Composition Scheme Bill of Supply PDF Generator (0% Tax)','gst-invoice','GST billing'],['quotation-maker-online','Free Business Quotation & Estimate PDF Generator with UPI QR','gst-invoice','GST billing'],['purchase-order-generator','Free B2B Purchase Order (PO) PDF Generator Online','gst-invoice','GST billing'],['delivery-challan-generator','GST Delivery Challan PDF Format Generator (Job Work & Goods Movement)','gst-invoice','GST billing'],['credit-note-debit-note-generator','GST Credit Note & Debit Note PDF Generator','gst-invoice','GST billing'],['freelance-invoice-generator-india','Indian Freelancer Invoice Generator (SAC 998314, LUT Export & UPI QR)','gst-invoice','GST billing'],['cash-receipt-voucher-generator','Printable Cash Payment & Petty Cash Voucher PDF Generator','gst-invoice','GST billing'],['payment-receipt-generator','Customer Advance & Payment Receipt PDF Generator','gst-invoice','GST billing'],['shop-upi-standee-qr-maker','Printable Shop Countertop UPI QR Standee Poster Maker (GPay, PhonePe, Paytm)','upi-qr','Payments'],['whatsapp-bill-maker-with-upi-qr','Instant WhatsApp Bill & Image Invoice Maker with Amount-Locked QR','upi-qr','Payments'],['jewellery-gst-invoice-generator','Gold & Jewellery GST Invoice Generator (3% GST + 5% Making Charges)','gst-invoice','GST billing'],['restaurant-food-bill-generator','Restaurant & Cloud Kitchen GST Bill Generator (5% GST Format)','gst-invoice','GST billing'],['medical-pharmacy-bill-generator','Medical Store & Pharmacy Bill Format PDF Generator (Batch, Expiry & HSN)','gst-invoice','GST billing'],['transport-bilty-lr-generator','Transport LR (Lorry Receipt / Bilty) & Freight Bill PDF Generator','gst-invoice','GST billing'],['coaching-institute-fee-receipt-generator','Coaching & School Tuition Fee Receipt PDF Generator','gst-invoice','GST billing'],['gym-membership-invoice-generator','Gym & Fitness Studio Membership Receipt PDF Generator','gst-invoice','GST billing'],['hotel-room-bill-invoice-generator','Hotel Stay & Tariff GST Invoice PDF Generator','gst-invoice','GST billing'],['car-cab-rental-bill-generator','Tour, Travels & Cab Taxi Bill PDF Generator (Per KM & Driver Allowance)','gst-invoice','GST billing'],['number-to-words-rupees-converter','Convert Amount to Indian Rupees in Words (Lakhs & Crores)','gst-invoice','GST billing'],['gst-state-code-hsn-lookup','Indian GST State Code List (01 to 38) & Common HSN/SAC Directory','gst-invoice','GST billing']
];
const hr = [
['hra-rent-receipt-generator','Free HRA Rent Receipt Generator PDF (12-Month Batch & ₹1 Revenue Stamp Box)','hra-rent','People & HR'],['salary-slip-generator','Free Monthly Salary Slip & Payslip PDF Generator Online','hr-docs','People & HR'],['driver-salary-receipt-generator','Driver Salary Receipt PDF Generator (For Corporate Tax Reimbursement)','hr-docs','People & HR'],['domestic-help-salary-receipt','Helper & Maid Salary Receipt Voucher Generator','hr-docs','People & HR'],['lta-travel-bill-summary-generator','LTA Claim Annexures & Summary Sheet PDF Generator','hr-docs','People & HR'],['medical-reimbursement-bill-summary','OPD Medical Reimbursement Claim Summary Sheet Generator','hr-docs','People & HR'],['experience-certificate-format-generator','Employee Work Experience Letter PDF Generator','hr-docs','People & HR'],['relieving-letter-generator','Formal Employee Relieving Letter PDF Generator','hr-docs','People & HR'],['internship-completion-certificate-generator','Internship Certificate PDF Generator','hr-docs','People & HR'],['no-objection-certificate-noc-generator','Address Proof & Landlord or Employer NOC PDF Generator','hr-docs','People & HR'],['gift-deed-format-india-pdf','Family Relative Tax-Free Gift Deed Declaration Format PDF','hr-docs','People & HR'],['loan-emi-receipt-voucher','Personal & Hand Loan Repayment Receipt PDF Generator','hr-docs','People & HR'],['society-maintenance-bill-generator','Apartment & RWA Monthly Maintenance Receipt PDF Generator','hr-docs','People & HR'],['donation-receipt-80g-format','Trust & NGO Donation Receipt PDF Format Generator','hr-docs','People & HR']
];
const us = [
['commercial-invoice-generator','Free International Commercial Invoice PDF Generator (FedEx, DHL, UPS & Customs)','us-customs-b2b'],['packing-list-generator','Export Packing List PDF Generator (Auto kg/lbs & Carton Totals)','us-customs-b2b'],['commercial-invoice-and-packing-list','Combined Commercial Invoice & Packing List PDF Maker','us-customs-b2b'],['1099-contractor-invoice-generator','US 1099 Independent Contractor Invoice PDF Generator (With Payment QR)','hr-docs'],['freelance-invoice-template-pdf','Free US Freelancer & Consultant Invoice PDF Maker','hr-docs'],['stripe-paypal-qr-invoice-maker','Add a Scannable Stripe, PayPal, Venmo or Zelle QR Code to Any PDF Invoice','payment-qr'],['construction-invoice-generator','Construction & Handyman Labor + Materials Invoice PDF Generator','hr-docs'],['photography-videography-invoice','Photography & Creative Agency Invoice PDF Maker','hr-docs'],['cleaning-service-invoice-generator','Residential & Commercial Cleaning Service Invoice PDF Generator','hr-docs'],['landscaping-lawn-care-invoice','Lawn Care & Landscaping Estimate & Invoice PDF Generator','hr-docs'],['auto-repair-mechanic-invoice','Auto Repair Shop Parts & Labor Invoice PDF Generator','hr-docs'],['consulting-retainer-invoice','B2B Consulting Retainer & Milestone Invoice PDF Generator','hr-docs'],['rent-receipt-generator-us','US Landlord Tenant Rent Receipt PDF Generator','hr-docs'],['bill-of-sale-generator-pdf','Personal Property & Equipment Bill of Sale PDF Generator','hr-docs'],['late-fee-interest-invoice-calculator','Overdue Invoice Late Fee Calculator & Past-Due Notice PDF Maker','late-fee'],['proforma-export-invoice-generator','International Trade Proforma Invoice PDF Generator (Incoterms 2020)','us-customs-b2b'],['fedex-dhl-customs-invoice-helper','FedEx & DHL Express International Customs Invoice Builder','us-customs-b2b'],['usps-international-customs-invoice','USPS International Commercial Invoice Generator','us-customs-b2b'],['uk-vat-invoice-generator','UK VAT Invoice PDF Generator (20%, 5% & Reverse Charge)','hr-docs'],['canada-gst-hst-invoice-generator','Canada GST / HST / PST Small Business Invoice PDF Maker','hr-docs'],['australia-tax-invoice-abn-generator','Australia ABN Tax Invoice PDF Generator (10% GST)','hr-docs'],['eu-reverse-charge-b2b-invoice','EU Cross-Border B2B Reverse Charge VAT Invoice PDF Generator','hr-docs']
];
const titleBenefit = (slug: string, mode: WorkMode) => {
  if (slug === 'upi-qr-code-generator') return 'Amount Fixed, Zero Commission';
  if (slug === 'gst-invoice-generator') return 'Auto CGST/IGST & Dynamic UPI QR';
  if (slug === 'hra-rent-receipt-generator') return 'All 12 Months & Stamp Box';
  if (slug === 'salary-slip-generator') return 'Earnings, Deductions & Net Pay';
  if (slug === 'us/commercial-invoice-generator') return 'Customs-Ready Dual PDF';
  if (slug === 'us/packing-list-generator') return 'Matching Customs Packing PDF';
  if (slug.includes('uk-vat')) return '20%, 5%, Zero Rate & Reverse Charge';
  if (slug.includes('canada-gst-hst')) return 'Province-Based GST, HST & PST';
  if (slug.includes('australia-tax')) return 'ABN & 10% GST';
  if (slug.includes('eu-reverse-charge')) return 'Article 196 Reverse Charge';
  if (mode === 'upi-qr') return 'Amount-Locked QR & Share Link';
  if (mode === 'payment-qr') return 'Scannable Payment QR';
  if (mode === 'gst-invoice') return 'Tax-Ready Fields & PDF Export';
  if (mode === 'hra-rent') return '12-Month Receipt Batch';
  if (mode === 'us-customs-b2b') return 'Invoice & Packing List PDF';
  if (mode === 'late-fee') return 'Interest Calculator & Notice PDF';
  return 'Editable, Print-Ready Document';
};

const complianceFor = (slug: string, primary: string, mode: WorkMode): ComplianceRow[] => {
  const exact: Record<string, ComplianceRow[]> = {
    'jewellery-gst-invoice-generator': [
      { label: 'Metal and weight', value: 'Record metal purity plus gross and net weight in grams.' },
      { label: 'Retail jewellery sale', value: 'GST is generally 3% on the total transaction value, including separately shown making charges.' },
      { label: 'Invoice particulars', value: 'Keep supplier and buyer GSTIN, invoice date, HSN, item value and tax visible.' },
      { label: 'Job work', value: 'Qualifying jewellery job-work charges are generally taxed at 5%; keep this service separate from a retail jewellery sale.' }
    ],
    'medical-pharmacy-bill-generator': [
      { label: 'Medicine traceability', value: 'Record medicine name, batch number, expiry in MM/YY and HSN.' },
      { label: 'Retail price and tax', value: 'Show MRP, quantity and the applicable GST rate for each medicine.' },
      { label: 'Pharmacy details', value: 'Print the pharmacy Drug Licence (DL) number on the bill.' },
      { label: 'Prescription details', value: 'Keep patient name and prescribing doctor name with the transaction record.' }
    ],
    'transport-bilty-lr-generator': [
      { label: 'Consignment record', value: 'Use a unique LR/Bilty number with consignor and consignee details.' },
      { label: 'E-Way Bill', value: 'The E-Way Bill number has 12 digits; verify it against the source document.' },
      { label: 'Movement and freight', value: 'Record loading and unloading cities, freight status and vehicle number.' },
      { label: 'Weight and copies', value: 'Show actual and charged weight and print consignor, consignee and driver copies.' }
    ],
    'us/uk-vat-invoice-generator': [
      { label: 'VAT rates', value: 'UK VAT commonly uses 20% standard, 5% reduced and 0% zero rates; eligibility depends on the supply.' },
      { label: 'Registration', value: 'Include the supplier VAT registration number when VAT-registered.' },
      { label: 'Invoice values', value: 'Separate net amount, VAT rate, VAT amount and gross amount in GBP.' },
      { label: 'Reverse charge', value: 'State the reverse-charge treatment and required customer details when it applies.' }
    ],
    'us/canada-gst-hst-invoice-generator': [
      { label: 'Ontario', value: 'HST is generally 13% for taxable supplies in Ontario.' },
      { label: 'Atlantic provinces', value: 'New Brunswick, Newfoundland and Labrador and Prince Edward Island generally use 15% HST; Nova Scotia is 14% from April 1, 2025.' },
      { label: 'GST-only provinces', value: 'Alberta and the territories generally use 5% GST; provincial rules can differ elsewhere.' },
      { label: 'Province-specific tax', value: 'British Columbia generally combines 5% GST and 7% PST; Quebec generally combines 5% GST and 9.975% QST.' }
    ],
    'us/australia-tax-invoice-abn-generator': [
      { label: 'Supplier identity', value: 'Print the supplier ABN on a tax invoice.' },
      { label: 'Tax invoice label', value: 'Use the words TAX INVOICE when the document is a tax invoice.' },
      { label: 'GST treatment', value: 'Show taxable amounts and GST separately; the standard GST rate is 10%.' },
      { label: 'Supply details', value: 'Describe each item, quantity, price and total in AUD.' }
    ],
    'us/eu-reverse-charge-b2b-invoice': [
      { label: 'VAT IDs', value: 'Show the seller and buyer VAT identification numbers for an eligible cross-border supply.' },
      { label: 'Tax treatment', value: 'Apply 0% only when the transaction qualifies for the intra-community reverse charge.' },
      { label: 'Invoice note', value: 'Include a reverse-charge statement identifying the recipient as accounting for VAT.' },
      { label: 'Evidence', value: 'Retain evidence of customer status, VAT ID validation and cross-border movement.' }
    ],
    'hra-rent-receipt-generator': [
      { label: 'Receipt period', value: 'Identify the month and year for each rent receipt.' },
      { label: 'Rent evidence', value: 'Record tenant, landlord, property address, amount and payment mode.' },
      { label: 'Landlord PAN', value: 'For HRA claims, collect landlord PAN when annual rent exceeds ₹1,00,000.' },
      { label: 'Signature and stamp', value: 'Provide a landlord signature area and a ₹1 revenue-stamp area where applicable.' }
    ],
    'experience-certificate-format-generator': [
      { label: 'Employee identity', value: 'State employee name, designation and department or role.' },
      { label: 'Employment dates', value: 'Include joining date and last working date.' },
      { label: 'Issuer', value: 'Use the organization letterhead and an authorized signatory.' },
      { label: 'Certificate text', value: 'Review the editable experience statement and dates before signing.' }
    ],
    'relieving-letter-generator': [
      { label: 'Employee identity', value: 'State employee name, designation and department or role.' },
      { label: 'Employment dates', value: 'Include joining date and last working date.' },
      { label: 'Issuer', value: 'Use the organization letterhead and an authorized signatory.' },
      { label: 'Release statement', value: 'Review the relieving date and handover or clearance wording before issue.' }
    ],
    'no-objection-certificate-noc-generator': [
      { label: 'Applicant identity', value: 'Name the employee or applicant and their role or designation.' },
      { label: 'Date range', value: 'Include joining date and last working date when the NOC is employment-related.' },
      { label: 'Issuer authority', value: 'Identify the organization or person issuing the no-objection letter.' },
      { label: 'Purpose', value: 'State the specific purpose and authorized signatory before issuing.' }
    ]
  };
  if (exact[slug]) return exact[slug];
  const routeSpecific: Record<string, ComplianceRow[]> = {
    'proforma-invoice-generator': [
      { label: 'Document status', value: 'A proforma is a preliminary offer document, not proof that goods were supplied or payment was received.' },
      { label: 'Parties and date', value: 'Identify seller, buyer, issue date and a unique proforma reference.' },
      { label: 'Items and value', value: 'Describe quantities, unit values, currency and any estimated taxes or charges.' },
      { label: 'Terms', value: 'State quote validity, delivery and payment terms; issue a tax invoice when legally required.' }
    ],
    'bill-of-supply-generator': [
      { label: 'Supplier identity', value: 'Include supplier name, address, GSTIN where registered, and serial document number.' },
      { label: 'Recipient and date', value: 'Record recipient details where required, date and place of supply.' },
      { label: 'No tax collection', value: 'A bill of supply does not separately collect GST; do not show an output GST amount as payable.' },
      { label: 'Composition scheme', value: 'Composition taxpayers must use the required composition-scheme wording and cannot collect tax on supplies.' }
    ],
    'quotation-maker-online': [
      { label: 'Quote identity', value: 'Use a unique quote number, issue date, validity date and customer name.' },
      { label: 'Scope and price', value: 'Describe each good or service, quantity, unit price, discount and total.' },
      { label: 'Tax estimate', value: 'Show applicable taxes separately and mark the document as a quotation, not a tax invoice.' },
      { label: 'Acceptance terms', value: 'State payment, delivery and acceptance terms before the customer approves the quote.' }
    ],
    'purchase-order-generator': [
      { label: 'Buyer and supplier', value: 'Identify the ordering business and the vendor with their contact details.' },
      { label: 'Order reference', value: 'Assign a unique PO number and issue date.' },
      { label: 'Goods and quantities', value: 'Specify descriptions, quantities, unit prices and delivery location.' },
      { label: 'Commercial terms', value: 'Record payment terms, delivery date, shipping and approval authority.' }
    ],
    'delivery-challan-generator': [
      { label: 'Challan reference', value: 'Add a serial number and date to identify the movement document.' },
      { label: 'Goods movement', value: 'Describe goods and quantities and identify consignor and consignee.' },
      { label: 'Movement purpose', value: 'State the reason for movement, such as job work, approval or non-sale transfer.' },
      { label: 'Transport details', value: 'Record dispatch location, destination and vehicle or transporter details.' }
    ],
    'credit-note-debit-note-generator': [
      { label: 'Original invoice', value: 'Cross-reference the original invoice number and date.' },
      { label: 'Adjustment reason', value: 'Describe the reason and affected goods or services.' },
      { label: 'Tax adjustment', value: 'Show taxable value and GST adjustment using the applicable tax treatment.' },
      { label: 'Reporting record', value: 'Keep the adjustment linked to the relevant customer and return-period records.' }
    ],
    'freelance-invoice-generator-india': [
      { label: 'Service record', value: 'Describe the freelance service, delivery period and agreed fee.' },
      { label: 'Customer and reference', value: 'Include supplier and client details with a unique invoice number and date.' },
      { label: 'Tax status', value: 'Show GST only where applicable to the supplier and supply; use the correct SAC when relevant.' },
      { label: 'Payment terms', value: 'State due date and payment instructions, including UPI details if offered.' }
    ],
    'cash-receipt-voucher-generator': [
      { label: 'Receipt number', value: 'Use a unique receipt or voucher reference and payment date.' },
      { label: 'Payer and payee', value: 'Identify who paid and who received the cash.' },
      { label: 'Amount and purpose', value: 'Record the amount and a clear reason for the cash transaction.' },
      { label: 'Acknowledgement', value: 'Include the receiver acknowledgement and retain the supporting record.' }
    ],
    'payment-receipt-generator': [
      { label: 'Payment reference', value: 'Identify the receipt date, payer and unique receipt number.' },
      { label: 'Amount received', value: 'Record amount, payment method and the invoice or order being paid.' },
      { label: 'Balance', value: 'Distinguish an advance or part-payment from full settlement.' },
      { label: 'Acknowledgement', value: 'Provide the recipient name and confirmation of payment received.' }
    ],
    'whatsapp-bill-maker-with-upi-qr': [
      { label: 'Bill details', value: 'Show seller, customer, item summary and bill reference before sharing.' },
      { label: 'Locked payment', value: 'The UPI amount is encoded in the URI when an amount is supplied.' },
      { label: 'Tax display', value: 'Show applicable tax and final payable amount clearly.' },
      { label: 'Share safely', value: 'Review the WhatsApp text and recipient before sending the payment request.' }
    ],
    'restaurant-food-bill-generator': [
      { label: 'Sale record', value: 'List food or beverage items, quantities, unit prices and the bill date.' },
      { label: 'Seller details', value: 'Identify the restaurant and provide registration particulars where applicable.' },
      { label: 'Tax treatment', value: 'Use the GST treatment applicable to the restaurant and supply; do not assume a rate from the document type alone.' },
      { label: 'Customer total', value: 'Show subtotal, applicable tax and amount payable.' }
    ],
    'coaching-institute-fee-receipt-generator': [
      { label: 'Student record', value: 'Identify the student, course or batch and fee period.' },
      { label: 'Receipt reference', value: 'Add a receipt number, date and institute details.' },
      { label: 'Fee breakdown', value: 'Separate tuition, materials or other fee components where used.' },
      { label: 'Payment evidence', value: 'Record amount, payment method and any remaining balance.' }
    ],
    'gym-membership-invoice-generator': [
      { label: 'Member and plan', value: 'Identify the member and membership plan or service period.' },
      { label: 'Invoice reference', value: 'Include invoice date, number and gym business details.' },
      { label: 'Charge breakdown', value: 'Show membership fee, add-ons, discounts and applicable taxes.' },
      { label: 'Payment status', value: 'State amount paid, payment mode and any outstanding balance.' }
    ],
    'hotel-room-bill-invoice-generator': [
      { label: 'Guest stay', value: 'Record guest name, room number and check-in/check-out dates and times.' },
      { label: 'Night calculation', value: 'Show number of nights and tariff per night.' },
      { label: 'Service classification', value: 'Use the applicable accommodation SAC; SAC 996311 is a common hotel accommodation classification.' },
      { label: 'Tax and total', value: 'Apply the current tax treatment for the accommodation value and show the final amount.' }
    ],
    'car-cab-rental-bill-generator': [
      { label: 'Vehicle and trip', value: 'Record vehicle number/type, trip route and service date.' },
      { label: 'Distance', value: 'Show opening and closing odometer readings and total kilometres.' },
      { label: 'Fare components', value: 'Separate per-kilometre charge, driver allowance, toll and parking.' },
      { label: 'Invoice total', value: 'Show subtotal, applicable tax and amount payable.' }
    ],
    'number-to-words-rupees-converter': [
      { label: 'Indian numbering', value: 'Use lakh and crore groupings for Indian rupee amounts.' },
      { label: 'Decimals', value: 'Convert fractional rupees to paise and preserve the numeric amount for checking.' },
      { label: 'Use', value: 'Copy the wording to a cheque, NEFT record or invoice after checking it against the number.' },
      { label: 'Currency', value: 'The result is Indian rupees; it does not convert exchange rates.' }
    ],
    'gst-state-code-hsn-lookup': [
      { label: 'GSTIN state code', value: 'The first two digits of a GSTIN identify its state or territory registration code.' },
      { label: 'Code directory', value: 'Use the listed State/UT codes, including code 97 for Other Territory.' },
      { label: 'HSN and SAC', value: 'HSN describes goods and SAC describes services; verify the code against the current tariff.' },
      { label: 'GSTIN check', value: 'A format or checksum check does not confirm that a GSTIN is active or belongs to a supplier.' }
    ],
    'driver-salary-receipt-generator': [
      { label: 'Worker and payer', value: 'Identify driver, employer or payer and the receipt date.' },
      { label: 'Pay period', value: 'State the work period and agreed wage amount.' },
      { label: 'Payment evidence', value: 'Record payment method, amount paid and any balance.' },
      { label: 'Acknowledgement', value: 'Provide a worker acknowledgement and keep the signed copy.' }
    ],
    'domestic-help-salary-receipt': [
      { label: 'Worker and payer', value: 'Identify the worker and household payer.' },
      { label: 'Pay period', value: 'State the month or period covered by the wage receipt.' },
      { label: 'Amount', value: 'Record wages, advances or deductions separately when applicable.' },
      { label: 'Acknowledgement', value: 'Include payment date, mode and worker confirmation.' }
    ],
    'lta-travel-bill-summary-generator': [
      { label: 'Employee and claim', value: 'Identify employee, family members covered and claim period.' },
      { label: 'Journey details', value: 'Record origin, destination, travel dates and mode of transport.' },
      { label: 'Supporting proof', value: 'Keep tickets and payment evidence for eligible travel expenses.' },
      { label: 'Employer review', value: 'Reimbursement eligibility depends on the applicable employer policy and tax rules.' }
    ],
    'medical-reimbursement-bill-summary': [
      { label: 'Patient and provider', value: 'Identify the employee or dependent and healthcare provider.' },
      { label: 'Service date', value: 'Record visit dates, provider bill number and treatment description.' },
      { label: 'Expense detail', value: 'List amount by receipt and total the claimed expenses.' },
      { label: 'Supporting proof', value: 'Retain original bills and follow the employer reimbursement policy.' }
    ],
    'internship-completion-certificate-generator': [
      { label: 'Intern identity', value: 'State intern name, role and department or project.' },
      { label: 'Internship dates', value: 'Include program start and completion dates.' },
      { label: 'Issuer', value: 'Identify the organization and an authorized signatory.' },
      { label: 'Certificate statement', value: 'Check the completion wording and dates before signing.' }
    ],
    'gift-deed-format-india-pdf': [
      { label: 'Donor and donee', value: 'Identify both parties and their relationship.' },
      { label: 'Gift description', value: 'Describe the property or amount being gifted and the transfer date.' },
      { label: 'Acceptance', value: 'Record acceptance by the donee and signatures of the parties.' },
      { label: 'Execution', value: 'Stamp duty, registration and witness requirements can depend on the asset and state.' }
    ],
    'loan-emi-receipt-voucher': [
      { label: 'Loan reference', value: 'Identify lender, borrower and original loan reference.' },
      { label: 'Installment', value: 'Record due date, amount received and payment method.' },
      { label: 'Balance tracking', value: 'Separate principal, interest and remaining balance when applicable.' },
      { label: 'Acknowledgement', value: 'Provide a receipt number and acknowledgement by the lender.' }
    ],
    'society-maintenance-bill-generator': [
      { label: 'Member and property', value: 'Identify society, unit/member and billing period.' },
      { label: 'Charge breakdown', value: 'Itemize maintenance, sinking fund, utilities and other charges.' },
      { label: 'Tax treatment', value: 'Apply GST only when the society and supply meet the applicable rules.' },
      { label: 'Payment status', value: 'Show due date, payments received and outstanding balance.' }
    ],
    'donation-receipt-80g-format': [
      { label: 'Trust identity', value: 'Include trust name, PAN and 80G registration particulars where applicable.' },
      { label: 'Donor record', value: 'Record donor name, address, PAN where collected and receipt number.' },
      { label: 'Contribution', value: 'State donation date, amount, payment mode and any in-kind description.' },
      { label: 'Tax claim', value: 'Deduction eligibility and limits depend on the donee approval and current income-tax rules.' }
    ],
    'us/1099-contractor-invoice-generator': [
      { label: 'Contracting parties', value: 'Identify the independent contractor and client with a unique invoice reference.' },
      { label: 'Services and period', value: 'Describe services, hours or milestones and the work period.' },
      { label: 'Amounts', value: 'Show gross fee, approved expenses and net amount due.' },
      { label: 'Tax records', value: 'An invoice is not a Form 1099; payer reporting and contractor tax filing are separate obligations.' }
    ],
    'us/freelance-invoice-template-pdf': [
      { label: 'Parties and reference', value: 'Include contractor, client, invoice date and invoice number.' },
      { label: 'Services', value: 'Describe services and the billing period, hours or fixed-fee milestone.' },
      { label: 'Payment terms', value: 'State due date, accepted payment method and late-fee terms if agreed.' },
      { label: 'Tax handling', value: 'State and local tax treatment depends on the service and jurisdiction.' }
    ],
    'us/stripe-paypal-qr-invoice-maker': [
      { label: 'Payment URL', value: 'Use a supported HTTPS Stripe, PayPal, Venmo, Square or Wise payment link.' },
      { label: 'Invoice amount', value: 'Confirm the amount and currency match the linked payment request.' },
      { label: 'Reconciliation', value: 'Include invoice reference and customer details.' },
      { label: 'Provider terms', value: 'Payment processing fees, settlement timing and disputes follow the provider agreement.' }
    ],
    'us/rent-receipt-generator-us': [
      { label: 'Parties and premises', value: 'Identify landlord, tenant and rental property.' },
      { label: 'Rent period', value: 'State the month, payment date and amount received.' },
      { label: 'Payment record', value: 'Record payment method and any unpaid balance.' },
      { label: 'Local requirements', value: 'Receipt and notice rules vary by state and locality.' }
    ],
    'us/bill-of-sale-generator-pdf': [
      { label: 'Buyer and seller', value: 'Identify both parties and the transfer date.' },
      { label: 'Property description', value: 'Describe the item, serial or VIN number and condition.' },
      { label: 'Price and transfer', value: 'State purchase price, payment status and delivery or transfer.' },
      { label: 'Local execution', value: 'Notarization, title and tax requirements vary with property type and location.' }
    ],
    'us/construction-invoice-generator': [
      { label: 'Project and parties', value: 'Identify contractor, customer, project location and invoice number.' },
      { label: 'Work breakdown', value: 'Separate labor, materials, approved change orders and reimbursable costs.' },
      { label: 'Billing period', value: 'State work dates, milestone or draw and any retainage.' },
      { label: 'Tax and terms', value: 'Apply taxes and payment terms required by the project contract and jurisdiction.' }
    ],
    'us/photography-videography-invoice': [
      { label: 'Project scope', value: 'Describe shoot date, deliverables, licensing and editing services.' },
      { label: 'Parties', value: 'Identify creative professional and client with an invoice reference.' },
      { label: 'Charges', value: 'Separate creative fees, usage/license fees, expenses and deposits.' },
      { label: 'Payment terms', value: 'State due date and any agreed deposit, cancellation or usage terms.' }
    ],
    'us/cleaning-service-invoice-generator': [
      { label: 'Service location', value: 'Identify client, service address and cleaning date or period.' },
      { label: 'Service scope', value: 'Describe residential or commercial service and frequency.' },
      { label: 'Charges', value: 'Separate labor, supplies, add-on work and discounts.' },
      { label: 'Payment', value: 'Show due date, payment method and amount outstanding.' }
    ],
    'us/landscaping-lawn-care-invoice': [
      { label: 'Site and period', value: 'Identify customer, property address and service dates.' },
      { label: 'Estimate or invoice', value: 'Label the document accurately as an estimate or an invoice.' },
      { label: 'Work and materials', value: 'Separate labor, materials, equipment and recurring maintenance.' },
      { label: 'Approval and payment', value: 'Record customer approval for quoted work and state payment terms.' }
    ],
    'us/auto-repair-mechanic-invoice': [
      { label: 'Vehicle and customer', value: 'Identify customer, vehicle, VIN or plate and repair order.' },
      { label: 'Repair detail', value: 'List diagnosis, parts, labor hours and completed work.' },
      { label: 'Charges', value: 'Show parts, labor, shop fees, taxes and total separately.' },
      { label: 'Authorization', value: 'Keep customer authorization and warranty details with the repair record.' }
    ],
    'us/consulting-retainer-invoice': [
      { label: 'Engagement', value: 'Identify consultant, client and retainer or project reference.' },
      { label: 'Service period', value: 'State billing dates, scope or milestone covered.' },
      { label: 'Fee accounting', value: 'Distinguish retainer drawdown, additional services, expenses and remaining balance.' },
      { label: 'Payment terms', value: 'Show due date and the applicable engagement terms.' }
    ],
    'us/proforma-export-invoice-generator': [
      { label: 'Document status', value: 'A proforma export invoice is a preliminary customs/commercial document, not proof of sale or payment.' },
      { label: 'Shipment details', value: 'Identify exporter, consignee, destination and shipment reference.' },
      { label: 'Goods and value', value: 'List quantities, unit values, currency, HS code and country of origin.' },
      { label: 'Trade terms', value: 'State Incoterm, package weights and estimated shipment details.' }
    ],
    'us/fedex-dhl-customs-invoice-helper': [
      { label: 'Carrier shipment', value: 'Match exporter, consignee, destination and waybill details to the carrier shipment.' },
      { label: 'Customs classification', value: 'List an accurate HS code and country of origin for each item.' },
      { label: 'Declared value', value: 'Declare a supportable transaction value and currency for customs purposes.' },
      { label: 'Declaration', value: 'Review the signed customs declaration and carrier-specific instructions before tender.' }
    ],
    'us/usps-international-customs-invoice': [
      { label: 'Postal shipment', value: 'Match sender, recipient, destination and postal customs form details.' },
      { label: 'Contents', value: 'Describe each item accurately; list quantity, value, HS tariff code and origin.' },
      { label: 'Export purpose', value: 'Select the correct shipment purpose and package details for the postal declaration.' },
      { label: 'Customs declaration', value: 'Check current destination-country and USPS restrictions before mailing.' }
    ]
  };
  if (routeSpecific[slug]) return routeSpecific[slug];
  if (mode === 'upi-qr') return [
    { label: 'Payment address', value: 'Use a valid UPI ID (VPA) in payee@handle format.' },
    { label: 'Amount', value: 'A locked UPI amount is encoded to two decimal places in the payment URI.' },
    { label: 'Currency', value: 'UPI payment requests generated here use INR.' },
    { label: 'Payee details', value: `Set the payee name and payment note for the ${primary.toLowerCase()}.` }
  ];
  if (mode === 'gst-invoice') return [
    { label: 'Document identity', value: `Show the number, date and parties for the ${primary.toLowerCase()}.` },
    { label: 'Tax classification', value: 'Use the applicable HSN/SAC and GST rate for each line item.' },
    { label: 'Place of supply', value: 'Compare seller and recipient GSTIN state codes to select CGST+SGST or IGST.' },
    { label: 'Invoice totals', value: 'Show taxable value, tax amounts and final payable amount.' }
  ];
  if (mode === 'hra-rent') return [
    { label: 'Receipt period', value: 'Identify each covered month and year.' },
    { label: 'Rent evidence', value: 'Include tenant, landlord, premises and payment details.' },
    { label: 'Annual threshold', value: 'For HRA claims, landlord PAN is required when annual rent exceeds ₹1,00,000.' },
    { label: 'Receipt signature', value: 'Provide a landlord signature area and stamp area where applicable.' }
  ];
  if (mode === 'us-customs-b2b' && slug === 'us/packing-list-generator') return [
    { label: 'Package count', value: 'List the cartons or packages and the quantity of each item in the shipment.' },
    { label: 'Product matching', value: 'Keep each description, HS tariff code and country of origin aligned with the commercial invoice.' },
    { label: 'Shipment weights', value: 'State net and gross weight per item or package, with units shown consistently.' },
    { label: 'Dimensions', value: 'Add package dimensions and verify the totals against the carrier booking.' }
  ];
  if (mode === 'us-customs-b2b' && slug === 'us/commercial-invoice-generator') return [
    { label: 'Parties', value: 'Identify the exporter and consignee using the names and addresses on the shipment.' },
    { label: 'Classification and origin', value: 'Provide an HS tariff code and country of origin for each item.' },
    { label: 'Customs value', value: 'Show quantity, unit value, currency and line total for the goods.' },
    { label: 'Trade terms', value: 'State the agreed Incoterm and review the exporter declaration before signing.' }
  ];
  if (mode === 'us-customs-b2b' && slug === 'us/commercial-invoice-and-packing-list') return [
    { label: 'Shared line items', value: 'Use identical item descriptions, HS tariff codes, origins and quantities in both documents.' },
    { label: 'Invoice values', value: 'Include unit prices, currency and declared commercial value on the invoice page.' },
    { label: 'Package details', value: 'Include package count, dimensions, net weight and gross weight on the packing page.' },
    { label: 'Shipment terms', value: 'Keep exporter, consignee, carrier and Incoterm consistent across both pages.' }
  ];
  if (mode === 'us-customs-b2b') return [
    { label: 'Document purpose', value: `Prepare a ${primary.toLowerCase()} with exporter, consignee and carrier details.` },
    { label: 'Classification', value: 'Provide an HS tariff code and country of origin for every item.' },
    { label: 'Shipment terms', value: 'Select the agreed Incoterm and keep quantities and weights consistent.' },
    { label: 'Declaration', value: 'Review customs values and sign the declaration before shipment.' }
  ];
  if (mode === 'late-fee') return [
    { label: 'Balance', value: 'Start from the unpaid invoice principal and stated due date.' },
    { label: 'Rate', value: 'Use the rate and method permitted by the contract and applicable law.' },
    { label: 'Time overdue', value: 'Calculate the elapsed overdue period from the invoice due date.' },
    { label: 'Notice', value: `Review the amount and terms before sending the ${primary.toLowerCase()}.` }
  ];
  if (mode === 'payment-qr') return [
    { label: 'Payment destination', value: 'Use a supported HTTPS payment link, such as Stripe or PayPal.' },
    { label: 'Amount', value: 'Confirm the displayed invoice amount matches the payment destination.' },
    { label: 'Reference', value: 'Include an invoice or order reference for reconciliation.' },
    { label: 'Fees', value: 'Payment provider fees and settlement rules are set by the provider.' }
  ];
  if (slug.includes('salary') || slug.includes('payslip')) return [
    { label: 'Pay period', value: 'State the pay period and employee or contractor identity.' },
    { label: 'Earnings', value: 'List gross earnings by pay component.' },
    { label: 'Deductions', value: 'List applicable deductions and withholding separately.' },
    { label: 'Net amount', value: 'Reconcile gross earnings less deductions to the net amount.' }
  ];
  return [
    { label: 'Document', value: `Prepare a ${primary.toLowerCase()} for the named parties.` },
    { label: 'Reference', value: 'Add a unique document number and date.' },
    { label: 'Supporting details', value: 'Include the dates, item descriptions and values that support the record.' },
    { label: 'Review', value: 'Confirm the details with the recipient and applicable local requirements before issue.' }
  ];
};

const faqFor = (primary: string, mode: WorkMode) => [
  { question: `How do I use this ${primary.toLowerCase()}?`, answer: 'Enter the requested details, load the sample if you want to see an example, review the preview and export the PDF in your browser.' },
  { question: `Can I edit the ${primary.toLowerCase()} before downloading?`, answer: 'Yes. Update the form fields and the on-page preview reflects the information used for the download.' },
  { question: `Where are my ${mode === 'upi-qr' ? 'payment details' : 'document details'} processed?`, answer: 'The generator runs in your browser. Form values and uploaded images are not sent to a BillQRNow server.' },
  { question: `Is this ${primary.toLowerCase()} ready to issue as-is?`, answer: 'Review names, dates, calculations and any local compliance rules before signing, sending or filing the document.' }
];

const make = (rows: string[][], prefix = ''): RoutePage[] => rows.map(([slug,title,mode,category]) => {
  const fullSlug = prefix + slug.toLowerCase();
  const workMode = mode as WorkMode;
  const headline = title.replace(/ \([^)]*\)/g, '');
  const benefit = titleBenefit(fullSlug, workMode);
  const titleTag = `${headline} — ${benefit} (Free, No Login) | BillQRNow`;
  return {
    slug: fullSlug,
    title: titleTag,
    description: `${headline}. ${benefit}. Free, private browser tool with a downloadable PDF and no login.`,
    mode: workMode,
    category: category || (prefix ? 'US & global' : 'India tools'),
    headline,
    intro: 'Enter details, preview the result and download a print-ready document. Processing stays in your browser.',
    complianceRows: complianceFor(fullSlug, headline, workMode),
    faqs: faqFor(headline, workMode)
  };
});
export const routes = [...make(india), ...make(hr), ...make(us, 'us/')];
export const relatedFor = (page: RoutePage) => {
  const regional = new Set(['us/uk-vat-invoice-generator','us/canada-gst-hst-invoice-generator','us/australia-tax-invoice-abn-generator','us/eu-reverse-charge-b2b-invoice']);
  const related = routes.filter(route => {
    if (route.slug === page.slug) return false;
    if (page.mode === 'upi-qr' || page.mode === 'payment-qr') return route.mode === 'upi-qr' || route.mode === 'payment-qr';
    if (regional.has(page.slug)) return regional.has(route.slug);
    if (page.mode === 'us-customs-b2b') return route.mode === 'us-customs-b2b';
    if (page.category === 'GST billing') return route.category === 'GST billing';
    if (page.category === 'People & HR') return route.category === 'People & HR';
    if (page.slug.startsWith('us/')) return route.slug.startsWith('us/') && route.mode !== 'us-customs-b2b' && !regional.has(route.slug) && route.category === page.category;
    return route.category === page.category && route.mode === page.mode;
  });
  return related.slice(0, 6);
};
export const corePages = [
{slug:'about',title:'About BillQRNow — Private Browser-Based Billing Tools (Free, No Login) | BillQRNow',description:'Learn about BillQRNow’s private, browser-based billing tools.'},
{slug:'contact',title:'Contact BillQRNow — Billing Tool Help (Free, No Login) | BillQRNow',description:'Contact the BillQRNow team with questions or feedback.'},
{slug:'privacy',title:'BillQRNow Privacy Policy — Data Stays in Your Browser (Free, No Login) | BillQRNow',description:'How BillQRNow protects your information with local processing.'},
{slug:'terms',title:'BillQRNow Terms of Use — Free Browser-Based Documents (Free, No Login) | BillQRNow',description:'Terms for using BillQRNow document generators.'},
{slug:'all-tools',title:'Free Invoice, QR & Receipt Tools — Browse All 60 Tools (Free, No Login) | BillQRNow',description:'Browse every free BillQRNow invoice, UPI QR and receipt tool.'}
];
export const getRoute = (slug: string) => routes.find(r => r.slug === slug);

