import type { WorkMode } from '../data/routes';
export const samples: Record<WorkMode, Record<string,string>> = {
 'upi-qr':{business:'Hyderabad Paper Co.',vpa:'merchant@okicici',amount:'2499',reference:'INV-2026-402',note:'Payment for invoice INV-2026-402'},
 'payment-qr':{business:'Northstar Paper Goods',paymentUrl:'https://paypal.me/northstarpaper/2499',invoiceAmount:'2499',reference:'Invoice US-402',note:'Payment for order US-402'},
 'gst-invoice':{seller:'Deccan Office Supplies',sellerGstin:'36AABCU9603R1ZM',buyer:'Bengaluru Design Studio',buyerGstin:'29AABCU9603R1ZM',invoice:'INV-2026-402',documentType:'Tax Invoice',vpa:'merchant@okicici',items:'Printer paper|480256|10|450|18\nDesk organizer|392610|4|680|18\nShipping|996511|1|250|18'},
 'hra-rent':{tenant:'Ananya Rao',landlord:'Suresh Reddy',pan:'ABCDE1234F',rent:'18500',address:'Madhapur, Hyderabad, Telangana',start:'2026-04',end:'2027-03',payment:'Bank transfer'},
 'hr-docs':{employee:'Ananya Rao',company:'Deccan Paper Co.',period:'October 2026',basic:'42000',hra:'18000',allowance:'12000',deductions:'3200'},
 'late-fee':{customer:'Bristol Studio Supply Ltd',invoice:'INV-2026-114',principal:'4250',annualRate:'18',daysLate:'30'},
 'us-customs-b2b':{exporter:'Northstar Paper Goods LLC',consignee:'Bristol Studio Supply Ltd',carrier:'DHL Express',incoterm:'DDP',weightUnit:'kg',items:'Notebook set|482010|United States|24|18.50|0.42|0.48\nDesk tray|392610|United States|12|22.00|0.80|0.92\nPen pack|960810|United States|30|6.25|0.18|0.22'}
};
