import QRCode from 'qrcode';
import { buildUpiUri, isValidPaymentLink } from '../utils/upiQrEngine';
import { stateCodeFromGstin, determineGstMode, calculateGstLine } from '../utils/gstEngine';
import { samples } from '../utils/samplePresets';
import {
  calculateJewelleryTotals,
  generateFormalLetter,
  generateGstInvoice,
  generateJewelleryInvoice,
  generatePharmacyBill,
  generateRentReceipts,
  generateSalarySlip,
  generateBusinessDocument,
  generateRegionalTaxInvoice,
  generateTransportBilty,
  generateCustomsPdf,
  generateLateFeeNotice
} from '../utils/pdfDocumentEngine';
import { calculateLateFee } from '../utils/lateFeeEngine';
import { currencyForRoute, formatRouteCurrency } from '../utils/routeCurrency';

type FormControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type Branding = { logoPng?: Uint8Array; signaturePng?: Uint8Array };

const imageAsPng = async (file: File): Promise<Uint8Array> => {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser could not read the selected image.');
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Could not process this image.')), 'image/png'));
  return new Uint8Array(await blob.arrayBuffer());
};

const boot = () => document.querySelectorAll<HTMLElement>('[data-workbench]').forEach(root => {
  if (root.dataset.ready) return;
  root.dataset.ready = 'true';
  const mode = root.dataset.mode as keyof typeof samples;
  const slug = root.dataset.slug || '';
  const currency = currencyForRoute(slug);
  const isJewellery = slug === 'jewellery-gst-invoice-generator';
  const isPharmacy = slug === 'medical-pharmacy-bill-generator';
  const isTransport = slug === 'transport-bilty-lr-generator';
  const isFormalLetter = ['experience-certificate-format-generator','relieving-letter-generator','no-objection-certificate-noc-generator'].includes(slug);
  const isRegionalTaxInvoice = ['us/uk-vat-invoice-generator','us/canada-gst-hst-invoice-generator','us/australia-tax-invoice-abn-generator','us/eu-reverse-charge-b2b-invoice'].includes(slug);
  const payroll = slug === 'salary-slip-generator' || slug === 'us/1099-contractor-invoice-generator';
  const form = root.querySelector<HTMLFormElement>('[data-editor]')!;
  const message = root.querySelector<HTMLElement>('[data-message]')!;
  const branding: Branding = {};
  const get = (key: string) => form.querySelector<FormControl>(`[data-key="${key}"]`);
  const val = (key: string) => get(key)?.value || '';
  const checked = (key: string) => {
    const control = get(key);
    return control instanceof HTMLInputElement && control.checked;
  };
  const num = (key: string) => Number(val(key) || 0);
  const set = (key: string, value: string) => { const control = get(key); if (control) control.value = value; };
  const puts = (selector: string, value: string) => { const element = root.querySelector<HTMLElement>(selector); if (element) element.textContent = value; };
  const rows = (key: string) => val(key).split('\n').filter(Boolean).map(row => row.split('|').map(cell => cell.trim()));
  const routeDocumentType = () => {
    if (slug.includes('proforma')) return 'Proforma Invoice';
    if (slug.includes('bill-of-supply')) return 'Bill of Supply';
    if (slug.includes('quotation')) return 'Quotation';
    if (slug.includes('purchase-order')) return 'Purchase Order';
    if (slug.includes('delivery-challan')) return 'Delivery Challan';
    if (slug.includes('credit-note-debit-note')) return 'Credit / Debit Note';
    if (slug.includes('receipt') || slug.includes('voucher')) return 'Retail Bill';
    return 'Tax Invoice';
  };
  const qr = root.querySelector<HTMLCanvasElement>('[data-qr]');
  const drawQr = async (uri: string) => {
    if (qr) {
      qr.hidden = false;
      await QRCode.toCanvas(qr, uri, { width: 640, margin: 1, errorCorrectionLevel: 'H', color: { dark: '#102923', light: '#ffffff' } });
    }
  };
  const clearQr = () => { if (qr) qr.getContext('2d')?.clearRect(0, 0, qr.width, qr.height); };
  if (mode === 'gst-invoice' && !isJewellery && !isPharmacy && !isTransport) set('documentType', routeDocumentType());

  const update = async () => {
    message.textContent = '';
    try {
      if (mode === 'upi-qr') {
        const open = checked('openAmount');
        puts('[data-preview="business"]', val('business') || 'Your business');
        puts('[data-preview="vpa"]', val('vpa') || 'yourname@bank');
        puts('[data-preview="reference"]', val('reference') || 'Payment reference');
        puts('[data-preview-amount]', open ? 'Enter amount in your UPI app' : `₹${num('amount').toFixed(2)}`);
        if (val('vpa') && (num('amount') > 0 || open)) await drawQr(buildUpiUri({ vpa: val('vpa'), payeeName: val('business'), amount: num('amount'), note: val('note'), openAmount: open }));
        else clearQr();
        return;
      }
      if (mode === 'payment-qr') {
        puts('[data-preview="business"]', val('business') || 'Your business');
        puts('[data-preview="vpa"]', val('paymentUrl') || 'Payment link');
        puts('[data-preview="reference"]', val('reference') || 'Payment reference');
        puts('[data-preview-amount]', `$${num('invoiceAmount').toFixed(2)}`);
        const valid = isValidPaymentLink(val('paymentUrl'));
        const status = root.querySelector<HTMLElement>('[data-link-status]');
        if (status) status.textContent = valid ? 'Supported HTTPS payment link. A QR is ready to scan.' : 'Enter a Stripe, PayPal, Venmo, Square or Wise HTTPS payment link.';
        if (valid) await drawQr(val('paymentUrl')); else clearQr();
        return;
      }
      if (mode === 'gst-invoice') {
        if (isJewellery) {
          const totals = calculateJewelleryTotals({ netWeight: num('netWeight'), ratePerGram: num('ratePerGram'), makingCharges: num('makingCharges'), jobWorkCharges: num('jobWorkCharges') });
          puts('[data-total]', `₹${totals.total.toFixed(2)}`);
          puts('[data-summary]', `${val('metalPurity') || 'Gold'} · ${num('netWeight')} g net · 3% GST on retail value incl. making`);
          return;
        }
        if (isPharmacy) {
          const total = num('medicineQty') * num('mrp');
          puts('[data-total]', `₹${total.toFixed(2)}`);
          puts('[data-summary]', `${val('medicineName') || 'Medicine'} · Batch ${val('batchNumber') || '—'} · Expiry ${val('expiryDate') || '—'}`);
          return;
        }
        if (isTransport) {
          puts('[data-total]', val('freightStatus') || 'Freight status');
          puts('[data-summary]', `${val('lrNumber') || 'LR / Bilty'} · ${val('fromCity') || 'From'} → ${val('toCity') || 'To'} · 3-copy print`);
          return;
        }
        const sellerState = stateCodeFromGstin(val('sellerGstin'));
        const buyerState = stateCodeFromGstin(val('buyerGstin'));
        const taxMode = determineGstMode(val('sellerGstin'), val('buyerGstin'));
        const indicator = root.querySelector<HTMLElement>('[data-tax-mode]');
        if (indicator) indicator.textContent = taxMode ? `${taxMode === 'intra' ? 'Intra-state: CGST + SGST' : 'Inter-state: IGST'} · ${sellerState} → ${buyerState}` : 'Enter valid seller and buyer GSTINs to calculate tax.';
        let total = 0;
        if (taxMode) rows('items').forEach(row => { if (row.length >= 5) total += calculateGstLine(Number(row[2]), Number(row[3]), Number(row[4]), taxMode === 'intra').total; });
        puts('[data-total]', taxMode ? `₹${total.toFixed(2)}` : '—');
        puts('[data-summary]', `${val('seller') || 'Seller'} → ${val('buyer') || 'Buyer'} · ${rows('items').length} line items`);
        return;
      }
      if (mode === 'hra-rent') {
        const annual = num('rent') * 12;
        const warning = root.querySelector<HTMLElement>('[data-pan-warning]');
        if (warning) warning.textContent = annual > 100000 && !val('pan') ? 'Landlord PAN required: annual rent is above ₹1,00,000.' : `Annual rent: ₹${annual.toLocaleString('en-IN')}. Landlord PAN is required above ₹1,00,000.`;
        puts('[data-total]', `₹${num('rent').toFixed(2)} / month`);
        puts('[data-summary]', `${val('tenant') || 'Tenant'} → ${val('landlord') || 'Landlord'} · ${val('start') || 'Start month'} to ${val('end') || 'End month'}`);
        return;
      }
      if (mode === 'us-customs-b2b') {
        const customsRows = rows('items');
        const total = customsRows.reduce((sum, row) => sum + Number(row[3] || 0) * Number(row[4] || 0), 0);
        puts('[data-total]', `$${total.toFixed(2)}`);
        puts('[data-summary]', `${val('exporter') || 'Exporter'} → ${val('consignee') || 'Consignee'} · ${customsRows.length} items · ${val('incoterm') || 'Incoterm'}`);
        return;
      }
      if (mode === 'late-fee') {
        const result = calculateLateFee(num('principal'), num('annualRate'), num('daysLate'));
        puts('[data-total]', `$${result.total.toFixed(2)}`);
        puts('[data-summary]', `${val('invoice') || 'Invoice'} · ${num('daysLate')} days overdue · $${result.fee.toFixed(2)} fee`);
        return;
      }
      if (mode === 'hr-docs' && isFormalLetter) {
        puts('[data-total]', 'Letter');
        puts('[data-summary]', `${val('employeeName') || 'Employee'} · ${val('designation') || 'Designation'} · ${val('joinDate') || 'Join date'} to ${val('lastWorkingDate') || 'Last working date'}`);
        return;
      }
      if (mode === 'hr-docs' && payroll) {
        const total = num('basic') + num('hra') + num('allowance') - num('deductions');
        puts('[data-total]', `${slug.startsWith('us/') ? '$' : '₹'}${total.toFixed(2)}`);
        puts('[data-summary]', `${val('employee') || 'Employee'} · ${val('period') || 'Pay period'} · Net pay`);
        return;
      }
      if (mode === 'hr-docs' && isRegionalTaxInvoice) {
        const total = rows('items').reduce((sum, row) => {
          const net = Number(row[1] || 0) * Number(row[2] || 0);
          return sum + net + net * Number(row[3] || 0) / 100;
        }, 0);
        puts('[data-total]', formatRouteCurrency(total, currency));
        puts('[data-summary]', `${val('company') || 'Seller'} → ${val('employee') || 'Buyer'} · ${rows('items').length} taxable lines`);
        return;
      }
      puts('[data-total]', formatRouteCurrency(num('amount'), currency));
      puts('[data-summary]', `${val('employee') || 'Recipient'} · ${val('period') || 'Reference'} · ${val('allowance') || 'Document details'}`);
    } catch (error) {
      message.textContent = error instanceof Error ? error.message : 'Check the entered details.';
    }
  };

  root.querySelector('[data-sample]')?.addEventListener('click', () => {
    const preset = { ...(samples[mode] || {}) };
    if (slug === 'jewellery-gst-invoice-generator') Object.assign(preset, { seller: 'Deccan Gold House', customer: 'Ananya Rao', invoice: 'JG-2026-402', metalPurity: '22K', grossWeight: '12.5', netWeight: '10.2', ratePerGram: '6500', makingCharges: '4200', jobWorkCharges: '0', sellerGstin: '36AABCU9603R1ZM', buyerGstin: '36AABCU9603R1ZM', vpa: 'merchant@okicici' });
    if (slug === 'medical-pharmacy-bill-generator') Object.assign(preset, { seller: 'City Pharmacy', invoice: 'RX-2026-402', patientName: 'Ananya Rao', doctorName: 'Dr Mehta', drugLicense: 'DL-TS-402', medicineName: 'Paracetamol 500 mg', batchNumber: 'PCM2406B', expiryDate: '06/28', medicineHsn: '3004', medicineQty: '2', mrp: '45', gstRate: '5' });
    if (slug === 'transport-bilty-lr-generator') Object.assign(preset, { lrNumber: 'LR-2026-402', truckNo: 'TS09AB1234', ewayBillNo: '181000000001', fromCity: 'Hyderabad', toCity: 'Bengaluru', driverName: 'Ravi Kumar', driverMobile: '9876543210', freightStatus: 'To Pay', actualWeight: '250', chargedWeight: '300', riskClause: "At Owner's Risk", copySet: 'on' });
    if (isRegionalTaxInvoice) {
      const regionalTaxId = currency === 'GBP' ? 'GB123456789' : currency === 'CAD' ? '123456789RT0001' : currency === 'AUD' ? '51824753556' : 'DE123456789';
      Object.assign(preset, { company: currency === 'GBP' ? 'Northstar Studio Ltd' : currency === 'CAD' ? 'Maple Creative Inc.' : currency === 'AUD' ? 'Harbour Design Pty Ltd' : 'Rhein Design GmbH', invoice: 'INV-2026-402', sellerTaxId: regionalTaxId, employee: 'Sample Business Customer', buyerTaxId: '', period: '2026-11-04', items: `Consulting services | 1 | ${currency === 'GBP' ? '1250' : currency === 'CAD' ? '1800' : currency === 'AUD' ? '1600' : '950'} | ${currency === 'GBP' ? '20' : currency === 'CAD' ? '13' : currency === 'AUD' ? '10' : '0'}` });
    }
    if (isFormalLetter) Object.assign(preset, { company: 'Deccan Paper Co., Hyderabad', employeeName: 'Ananya Rao', designation: 'Product Designer', joinDate: '2022-04-01', lastWorkingDate: '2026-10-31', letterBody: 'This is to certify that Ananya Rao was employed as a Product Designer from 1 April 2022 to 31 October 2026. We thank her for her contributions and wish her success in her future endeavours.', signatoryName: 'M. Reddy', signatoryTitle: 'People Operations Director', period: 'HR-2026-402' });
    if (slug.includes('1099')) Object.assign(preset, { employee: 'Maya Patel · 1099 contractor', company: 'Northstar Creative LLC', period: 'October 2026', basic: '4250.50', hra: '0', allowance: '0', deductions: '0', paymentUrl: 'https://paypal.me/mayapatel/4250.50' });
    else if (mode === 'hr-docs' && !payroll && !isFormalLetter && !isRegionalTaxInvoice) Object.assign(preset, { company: 'Deccan Paper Co.', employee: 'Ravi Kumar', period: 'DOC-2026-402', amount: '18500', allowance: 'Monthly service and payment details' });
    if (mode === 'gst-invoice' && !isJewellery && !isPharmacy && !isTransport) preset.documentType = routeDocumentType();
    Object.entries(preset).forEach(([key, value]) => set(key, value));
    if (slug === 'number-to-words-rupees-converter') {
      const amount = document.querySelector<HTMLInputElement>('[data-words-amount]');
      if (amount) { amount.value = '145250'; amount.dispatchEvent(new Event('input', { bubbles: true })); }
    }
    void update();
    message.textContent = 'Sample details loaded. Your preview is ready.';
  });

  form.addEventListener('input', () => void update());
  form.addEventListener('change', event => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.files?.[0]) {
      const key = target.dataset.key === 'logoFile' ? 'logoPng' : target.dataset.key === 'signatureFile' ? 'signaturePng' : '';
      if (key) void imageAsPng(target.files[0]).then(image => { branding[key] = image; message.textContent = 'Image added locally and will be embedded in your PDF.'; }).catch(error => { message.textContent = error instanceof Error ? error.message : 'Could not read the selected image.'; });
    }
    void update();
  });
  root.querySelectorAll<HTMLButtonElement>('[data-handle]').forEach(button => button.addEventListener('click', () => {
    const prefix = val('vpa').split('@')[0] || 'merchant';
    set('vpa', `${prefix}${button.dataset.handle}`);
    void update();
  }));

  const buildPdf = async (variant?: 'invoice' | 'packing' | 'combined') => {
    const brand = { ...branding };
    if (mode === 'gst-invoice' && isJewellery) return generateJewelleryInvoice({ seller: val('seller'), customer: val('buyer'), invoice: val('invoice'), metalPurity: val('metalPurity'), grossWeight: num('grossWeight'), netWeight: num('netWeight'), ratePerGram: num('ratePerGram'), makingCharges: num('makingCharges'), jobWorkCharges: num('jobWorkCharges'), sellerGstin: val('sellerGstin'), buyerGstin: val('buyerGstin'), ...brand });
    if (mode === 'gst-invoice' && isPharmacy) return generatePharmacyBill({ pharmacy: val('seller'), patient: val('patientName'), doctor: val('doctorName'), drugLicense: val('drugLicense'), medicine: val('medicineName'), batch: val('batchNumber'), expiry: val('expiryDate'), hsn: val('medicineHsn'), quantity: num('medicineQty'), mrp: num('mrp'), gstRate: num('gstRate'), ...brand });
    if (mode === 'gst-invoice' && isTransport) return generateTransportBilty({ lrNumber: val('lrNumber'), truckNo: val('truckNo'), ewayBillNo: val('ewayBillNo'), fromCity: val('fromCity'), toCity: val('toCity'), driver: val('driverName'), driverMobile: val('driverMobile'), freightStatus: val('freightStatus'), actualWeight: num('actualWeight'), chargedWeight: num('chargedWeight'), riskClause: val('riskClause'), ...brand });
    if (mode === 'gst-invoice') {
      const taxMode = determineGstMode(val('sellerGstin'), val('buyerGstin'));
      if (!taxMode) throw new Error('Enter valid seller and buyer GSTINs before generating this invoice.');
      const items = rows('items').map(row => ({ description: row[0] || 'Item', hsn: row[1] || '', qty: Number(row[2] || 0), rate: Number(row[3] || 0), gstRate: Number(row[4] || 0) }));
      const amount = items.reduce((sum, item) => sum + calculateGstLine(item.qty, item.rate, item.gstRate, taxMode === 'intra').total, 0);
      let qrPng: Uint8Array | undefined;
      if (val('vpa') && amount > 0) { const uri = buildUpiUri({ vpa: val('vpa'), payeeName: val('seller'), amount, note: `Invoice ${val('invoice')}` }); qrPng = new Uint8Array(await (await fetch(await QRCode.toDataURL(uri, { width: 240, margin: 1 }))).arrayBuffer()); }
      return generateGstInvoice({ seller: val('seller'), sellerGstin: val('sellerGstin'), buyer: val('buyer'), buyerGstin: val('buyerGstin'), invoice: val('invoice'), documentType: val('documentType'), vpa: val('vpa'), items, qrPng, ...brand });
    }
    if (mode === 'hra-rent') return generateRentReceipts({ tenant: val('tenant'), landlord: val('landlord'), pan: val('pan'), rent: num('rent'), address: val('address'), start: val('start'), end: val('end'), payment: val('payment'), ...brand });
    if (mode === 'us-customs-b2b') {
      const factor = val('weightUnit') === 'lbs' ? 1 / 2.20462 : 1;
      const items = rows('items').map(row => ({ description: row[0] || '', hs: row[1] || '', origin: row[2] || '', qty: Number(row[3] || 0), unitPrice: Number(row[4] || 0), netKg: Number(row[5] || 0) * factor, grossKg: Number(row[6] || 0) * factor }));
      return generateCustomsPdf({ exporter: val('exporter'), consignee: val('consignee'), carrier: val('carrier'), incoterm: val('incoterm'), dimensions: val('dimensions'), items, ...brand }, variant);
    }
    if (mode === 'late-fee') return generateLateFeeNotice({ customer: val('customer'), invoice: val('invoice'), principal: num('principal'), annualRatePercent: num('annualRate'), daysLate: num('daysLate'), ...brand });
    if (mode === 'payment-qr') {
      if (!isValidPaymentLink(val('paymentUrl'))) throw new Error('Enter a supported Stripe, PayPal, Venmo, Square or Wise HTTPS payment link.');
      const qrPng = new Uint8Array(await (await fetch(await QRCode.toDataURL(val('paymentUrl')))).arrayBuffer());
      return generateSalarySlip({ employee: val('reference') || 'Customer', company: val('business') || 'Independent contractor', period: val('reference') || 'Invoice', basic: num('invoiceAmount'), hra: 0, allowance: 0, deductions: 0, contractor: true, qrPng, ...brand });
    }
    if (mode === 'hr-docs' && isRegionalTaxInvoice) {
      let qrPng: Uint8Array | undefined;
      if (val('paymentUrl')) { const url = val('paymentUrl'); if (!isValidPaymentLink(url)) throw new Error('Use a supported Stripe, PayPal, Venmo, Square or Wise HTTPS payment link.'); qrPng = new Uint8Array(await (await fetch(await QRCode.toDataURL(url))).arrayBuffer()); }
      const items = rows('items').map(row => ({ description: row[0] || '', qty: Number(row[1] || 0), unitPrice: Number(row[2] || 0), taxRate: Number(row[3] || 0) }));
      return generateRegionalTaxInvoice({ title: root.dataset.title || 'Tax invoice', currency, seller: val('company'), sellerTaxId: val('sellerTaxId'), buyer: val('employee'), buyerTaxId: val('buyerTaxId'), invoice: val('invoice'), date: val('period'), items, qrPng, ...brand });
    }
    if (mode === 'hr-docs' && isFormalLetter) return generateFormalLetter({ title: root.dataset.title || 'Employment Letter', issuer: val('company'), employee: val('employeeName'), designation: val('designation'), joinDate: val('joinDate'), lastWorkingDate: val('lastWorkingDate'), body: val('letterBody'), signatory: val('signatoryName'), signatoryTitle: val('signatoryTitle'), reference: val('period'), ...brand });
    let qrPng: Uint8Array | undefined;
    if (val('paymentUrl')) qrPng = new Uint8Array(await (await fetch(await QRCode.toDataURL(val('paymentUrl')))).arrayBuffer());
    if (mode === 'hr-docs' && !payroll) return generateBusinessDocument({ title: root.dataset.title || 'Business document', issuer: val('company'), recipient: val('employee'), reference: val('period'), description: val('allowance'), amount: num('amount'), currency, qrPng, ...brand });
    return generateSalarySlip({ employee: val('employee'), company: val('company'), period: val('period'), basic: num('basic'), hra: num('hra'), allowance: num('allowance'), deductions: num('deductions'), contractor: slug.includes('1099'), qrPng, ...brand });
  };

  const save = async (variant?: 'invoice' | 'packing' | 'combined') => {
    try {
      const bytes = await buildPdf(variant);
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${slug.replaceAll('/', '-') || 'billqrnow'}${variant ? `-${variant}` : ''}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
      message.textContent = 'Your PDF has been created and downloaded.';
    } catch (error) {
      message.textContent = error instanceof Error ? error.message : 'Add the required details before exporting.';
    }
  };
  root.querySelector('[data-export]')?.addEventListener('click', () => void save(mode === 'us-customs-b2b' ? 'invoice' : undefined));
  root.querySelector('[data-export="packing"]')?.addEventListener('click', () => void save('packing'));
  root.querySelector('[data-export="combined"]')?.addEventListener('click', () => void save('combined'));
  root.querySelector('[data-download-png]')?.addEventListener('click', async () => {
    if (!qr) return;
    const canvas = document.createElement('canvas'); canvas.width = 1000; canvas.height = 1400;
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#f6f8f4'; context.fillRect(0, 0, 1000, 1400);
    context.fillStyle = '#102923'; context.textAlign = 'center';
    if (branding.logoPng) { const logo = await createImageBitmap(new Blob([Uint8Array.from(branding.logoPng).buffer as ArrayBuffer], { type: 'image/png' })); context.drawImage(logo, 360, 50, 280, 95); logo.close(); }
    context.font = '700 48px Arial'; context.fillText(val('business') || 'Your business', 500, 175);
    context.font = '700 58px Arial'; context.fillText('Scan to pay', 500, 260); context.drawImage(qr, 300, 340, 400, 400);
    context.font = '700 64px Arial'; context.fillText(mode === 'payment-qr' ? `$${num('invoiceAmount').toFixed(2)}` : checked('openAmount') ? 'Any amount' : `₹${num('amount').toFixed(2)}`, 500, 850);
    context.font = '25px Arial'; context.fillText(val('vpa') || val('paymentUrl'), 500, 930); context.fillText(val('reference'), 500, 1000);
    context.fillText(mode === 'payment-qr' ? 'Stripe · PayPal · Venmo · Square · Wise' : 'GPay · PhonePe · Paytm', 500, 1220);
    if (branding.signaturePng) { const signature = await createImageBitmap(new Blob([Uint8Array.from(branding.signaturePng).buffer as ArrayBuffer], { type: 'image/png' })); context.drawImage(signature, 760, 1250, 150, 70); signature.close(); }
    const anchor = document.createElement('a'); anchor.href = canvas.toDataURL('image/png'); anchor.download = mode === 'payment-qr' ? 'payment-link-qr.png' : 'upi-payment-standee.png'; anchor.click();
  });
  root.querySelector('[data-copy-link]')?.addEventListener('click', async () => {
    try {
      if (mode === 'payment-qr') {
        if (!isValidPaymentLink(val('paymentUrl'))) throw new Error('Enter a supported HTTPS payment link first.');
        await navigator.clipboard.writeText(val('paymentUrl')); message.textContent = 'Payment link copied.'; return;
      }
      const openAmount = checked('openAmount');
      const uri = buildUpiUri({ vpa: val('vpa'), payeeName: val('business'), amount: num('amount'), note: val('note'), openAmount });
      const shareText = openAmount ? `Pay ${val('business')} using UPI: ${uri}` : `Pay ₹${num('amount').toFixed(2)} to ${val('business')} using UPI: ${uri}`;
      await navigator.clipboard.writeText(`https://wa.me/?text=${encodeURIComponent(shareText)}`);
      message.textContent = 'Payment link copied for WhatsApp.';
    } catch (error) { message.textContent = error instanceof Error ? error.message : 'Could not copy the payment link.'; }
  });
  void update();
});

boot();
