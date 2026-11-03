import { describe,it,expect } from 'vitest';
import { buildUpiUri,isValidVpa,isValidPaymentLink } from '../utils/upiQrEngine';
import { stateCodeFromGstin,calculateGstLine,amountToIndianWords,amountToUSDWords,stateCodes,determineGstMode } from '../utils/gstEngine';
import { samples } from '../utils/samplePresets';
import { PDFArray,PDFDocument,PDFRawStream,decodePDFRawStream } from 'pdf-lib';
import QRCode from 'qrcode';
import { calculateLateFee } from '../utils/lateFeeEngine';
import { calculateJewelleryTotals,generateFormalLetter,generateGstInvoice,generateJewelleryInvoice,generatePharmacyBill,generateRegionalTaxInvoice,generateRentReceipts,generateSalarySlip,generateTransportBilty,generateCustomsPdf } from '../utils/pdfDocumentEngine';
function decodedPdfText(pdf:PDFDocument):string{return pdf.getPages().map(page=>{const contents=page.node.Contents();const streams=contents instanceof PDFArray?contents.asArray():contents?[contents]:[];return streams.map(content=>new TextDecoder().decode(decodePDFRawStream(pdf.context.lookup(content,PDFRawStream)).decode())).join(' ');}).join(' ');}
describe('billing engines',()=>{
 it('builds an encoded amount locked UPI URI and validates VPA',()=>{const u=new URL(buildUpiUri({vpa:'merchant@okicici',payeeName:'Paper & Co',amount:4350,note:'Invoice 42'}));expect(u.protocol).toBe('upi:');expect(u.searchParams.get('am')).toBe('4350.00');expect(u.searchParams.get('pn')).toBe('Paper & Co');expect(u.searchParams.get('tn')).toBe('Invoice 42');expect(isValidVpa('merchant@okicici')).toBe(true);expect(isValidVpa('bad-vpa')).toBe(false);});
 it('detects GST state code and splits intra-state tax',()=>{expect(stateCodeFromGstin('36AABCU9603R1ZM')).toBe('36');expect(stateCodeFromGstin('29AABCU9603R1ZM')).toBe('29');expect(stateCodeFromGstin('xxbad')).toBeNull();expect(calculateGstLine(2,100,18,true)).toEqual({taxable:200,cgst:18,sgst:18,igst:0,total:236});});
 it('includes the complete state and territory GST code map',()=>{for(const code of Array.from({length:38},(_,i)=>String(i+1).padStart(2,'0')))expect(stateCodes[code],code).toBeTruthy();expect(stateCodes['97']).toBe('Other Territory');});
 it('requires complete valid GSTINs before selecting a tax mode',()=>{expect(determineGstMode('36AABCU9603R1ZM','36AABCU9603R1ZM')).toBe('intra');expect(determineGstMode('36AABCU9603R1ZM','29AABCU9603R1ZM')).toBe('inter');expect(determineGstMode('','29AABCU9603R1ZM')).toBeNull();expect(determineGstMode('00AABCU9603R1ZM','29AABCU9603R1ZM')).toBeNull();expect(determineGstMode('36','36')).toBeNull();expect(determineGstMode('36ABCU9603R1ZM','36AABCU9603R1ZM')).toBeNull();});
 it('applies full inter-state IGST',()=>expect(calculateGstLine(1,1000,18,false)).toEqual({taxable:1000,cgst:0,sgst:0,igst:180,total:1180}));
 it('converts Indian amounts across units and paise',()=>{expect(amountToIndianWords(145250)).toBe('Rupees One Lakh Forty-Five Thousand Two Hundred Fifty Only');expect(amountToIndianWords(12345678.5)).toBe('Rupees One Crore Twenty-Three Lakh Forty-Five Thousand Six Hundred Seventy-Eight and Fifty Paise Only');expect(amountToIndianWords(0)).toBe('Rupees Zero Only');});
 it('converts USD including cents',()=>expect(amountToUSDWords(4250.5)).toBe('Four Thousand Two Hundred Fifty Dollars and Fifty Cents Only'));
 it('validates supported US and global HTTPS payment links without accepting lookalike domains',()=>{expect(isValidPaymentLink('https://paypal.me/sample/20')).toBe(true);expect(isValidPaymentLink('https://checkout.stripe.com/pay/cs_test')).toBe(true);expect(isValidPaymentLink('http://paypal.me/sample')).toBe(false);expect(isValidPaymentLink('https://example.com/pay')).toBe(false);expect(isValidPaymentLink('https://paypal.evil.com/pay')).toBe(false);expect(isValidPaymentLink('https://notpaypal.com/pay')).toBe(false);});
 it('provides a usable preset for each workbench mode',()=>expect(Object.keys(samples)).toHaveLength(7));
 it('generates valid GST and HR PDFs with rent batching at three receipts per A4 page',async()=>{const gst=await generateGstInvoice({seller:'Seller',sellerGstin:'36AABCU9603R1ZM',buyer:'Buyer',buyerGstin:'29AABCU9603R1ZM',invoice:'INV-1',items:[{description:'Paper',hsn:'4802',qty:1,rate:100,gstRate:18}]});expect(new TextDecoder().decode(gst.slice(0,5))).toBe('%PDF-');expect((await PDFDocument.load(gst)).getPageCount()).toBe(1);const rent=await generateRentReceipts({tenant:'Tenant',landlord:'Landlord',pan:'ABCDE1234F',rent:18500,address:'Hyderabad',start:'2026-04',end:'2027-03',payment:'UPI'});expect((await PDFDocument.load(rent)).getPageCount()).toBe(4);const slip=await generateSalarySlip({employee:'A Rao',company:'Co',period:'Oct',basic:42000,hra:18000,allowance:12000,deductions:3200});expect((await PDFDocument.load(slip)).getPageCount()).toBe(1);});
 it('embeds a generated payment QR image inside a GST invoice PDF',async()=>{const qr=await QRCode.toBuffer('upi://pay?pa=merchant%40okicici&am=118.00&cu=INR');const bytes=await generateGstInvoice({seller:'Seller',sellerGstin:'36AABCU9603R1ZM',buyer:'Buyer',buyerGstin:'29AABCU9603R1ZM',invoice:'INV-QR',items:[{description:'Paper',hsn:'4802',qty:1,rate:100,gstRate:18}],qrPng:qr});expect(new TextDecoder().decode(bytes)).toContain('/Subtype /Image');});
 it('generates commercial invoice, packing list and a two-page combined PDF',async()=>{const input={exporter:'Seller',consignee:'Buyer',carrier:'DHL',incoterm:'DDP',items:[{description:'Book',hs:'482010',origin:'US',qty:4,unitPrice:10,netKg:.4,grossKg:.5}]};for(const kind of ['invoice','packing','combined'] as const){const bytes=await generateCustomsPdf(input,kind);expect(new TextDecoder().decode(bytes.slice(0,5))).toBe('%PDF-');expect((await PDFDocument.load(bytes)).getPageCount()).toBe(kind==='combined'?2:1);}});
 it('paginates regional invoice item lines instead of dropping lines from the PDF',async()=>{
  const bytes=await generateRegionalTaxInvoice({title:'UK VAT invoice',currency:'GBP',seller:'Northstar Ltd',sellerTaxId:'GB123456789',buyer:'Buyer Ltd',buyerTaxId:'',invoice:'UK-402',date:'2026-11-04',items:Array.from({length:20},(_,i)=>({description:`Consulting line ${i+1}`,qty:1,unitPrice:100,taxRate:20}))});
  const pdf=await PDFDocument.load(bytes);
  expect(new TextDecoder().decode(bytes.slice(0,5))).toBe('%PDF-');
  expect(pdf.getPageCount()).toBe(2);
 });
 it('rejects regional invoices with no taxable line items',async()=>{
  await expect(generateRegionalTaxInvoice({title:'UK VAT invoice',currency:'GBP',seller:'Northstar Ltd',sellerTaxId:'GB123456789',buyer:'Buyer Ltd',buyerTaxId:'',invoice:'UK-402',date:'2026-11-04',items:[]})).rejects.toThrow('Add at least one line item');
 });
 it('gives long regional invoice descriptions enough row height to prevent overlap',async()=>{
  const description=`Design and implementation services ${'for a cross-border business account '.repeat(5)}`;
  const bytes=await generateRegionalTaxInvoice({title:'UK VAT invoice',currency:'GBP',seller:'Northstar Ltd',sellerTaxId:'GB123456789',buyer:'Buyer Ltd',buyerTaxId:'',invoice:'UK-403',date:'2026-11-04',items:Array.from({length:14},()=>({description,qty:1,unitPrice:100,taxRate:20}))});
  expect((await PDFDocument.load(bytes)).getPageCount()).toBe(2);
 });
 it('retains regional invoice descriptions beyond 130 characters in the exported PDF',async()=>{
  const description=`Consulting services ${'for international product delivery '.repeat(8)}FULL-DESCRIPTION-END-MARKER`;
  const bytes=await generateRegionalTaxInvoice({title:'UK VAT invoice',currency:'GBP',seller:'Northstar Ltd',sellerTaxId:'GB123456789',buyer:'Buyer Ltd',buyerTaxId:'',invoice:'UK-404',date:'2026-11-04',items:[{description,qty:1,unitPrice:100,taxRate:20}]});
  const markerHex=Array.from('FULL-DESCRIPTION-END-MARKER',char=>char.charCodeAt(0).toString(16).padStart(2,'0')).join('').toUpperCase();
  expect(decodedPdfText(await PDFDocument.load(bytes))).toContain(markerHex);
 });
 it('shows a useful error when one regional invoice description exceeds a page',async()=>{
  const description=`Extended item details ${'cross-border design and delivery specifications '.repeat(180)}`;
  await expect(generateRegionalTaxInvoice({title:'UK VAT invoice',currency:'GBP',seller:'Northstar Ltd',sellerTaxId:'GB123456789',buyer:'Buyer Ltd',buyerTaxId:'',invoice:'UK-405',date:'2026-11-04',items:[{description,qty:1,unitPrice:100,taxRate:20}]})).rejects.toThrow('A single item description is too long');
 });
 it('retains long customs item lists across paginated output',async()=>{const items=Array.from({length:36},(_,i)=>({description:`Export item ${i+1}`,hs:'482010',origin:'US',qty:1,unitPrice:10,netKg:.4,grossKg:.5}));const bytes=await generateCustomsPdf({exporter:'Seller',consignee:'Buyer',carrier:'DHL',incoterm:'DDP',items},'invoice');const pdf=await PDFDocument.load(bytes);expect(pdf.getPageCount()).toBeGreaterThan(1);});
 it('calculates simple prorated late fees for overdue invoices',()=>expect(calculateLateFee(1000,18,30)).toEqual({fee:14.79,total:1014.79}));
 it('applies 3% GST to a retail jewellery sale including making and keeps 5% job-work tax separate',()=>{
  expect(calculateJewelleryTotals({netWeight:10,ratePerGram:1000,makingCharges:500})).toEqual({jewelleryValue:10000,saleValue:10500,saleGst:315,jobWorkCharges:0,jobWorkGst:0,total:10815});
  expect(calculateJewelleryTotals({netWeight:10,ratePerGram:1000,makingCharges:500,jobWorkCharges:100}).total).toBe(10920);
 });
 it('generates bespoke pharmacy, bilty and formal letter PDFs with embedded local images',async()=>{
  const brand=await QRCode.toBuffer('data:image');
  const pharmacy=await generatePharmacyBill({pharmacy:'City Pharmacy',patient:'Asha Rao',doctor:'Dr Mehta',drugLicense:'DL-123',medicine:'Paracetamol',batch:'B-402',expiry:'12/27',hsn:'3004',quantity:2,mrp:45,gstRate:5,logoPng:brand,signaturePng:brand});
  const transport=await generateTransportBilty({lrNumber:'LR-402',truckNo:'TS09AB1234',ewayBillNo:'181000000001',fromCity:'Hyderabad',toCity:'Bengaluru',driver:'Ravi',driverMobile:'9876543210',freightStatus:'To Pay',actualWeight:250,chargedWeight:300,riskClause:'At Owner\'s Risk',logoPng:brand,signaturePng:brand});
  const letter=await generateFormalLetter({title:'EXPERIENCE CERTIFICATE',issuer:'Deccan Paper Co.',employee:'Ananya Rao',designation:'Designer',joinDate:'2022-04-01',lastWorkingDate:'2026-10-31',body:'This certifies her employment.',signatory:'M Rao',signatoryTitle:'Director',logoPng:brand,signaturePng:brand});
  expect(new TextDecoder().decode(pharmacy.slice(0,5))).toBe('%PDF-');
  expect((await PDFDocument.load(transport)).getPageCount()).toBe(3);
  expect((await PDFDocument.load(letter)).getPageCount()).toBe(1);
  expect(new TextDecoder().decode(transport)).toContain('/Subtype /Image');
 });
 it('generates jewellery invoice PDF totals from metal purity, weight, rate, and making charges',async()=>{
  const bytes=await generateJewelleryInvoice({seller:'Deccan Gold',customer:'Asha Rao',invoice:'JG-402',metalPurity:'22K',grossWeight:11,netWeight:10,ratePerGram:1000,makingCharges:500});
  expect(new TextDecoder().decode(bytes.slice(0,5))).toBe('%PDF-');
  expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1);
 });
});
