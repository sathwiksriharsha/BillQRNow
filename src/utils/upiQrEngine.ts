export const bankHandles = ['@okaxis','@okicici','@okhdfcbank','@ybl','@paytm','@oksbi','@ibl','@upi'];
export function isValidVpa(vpa: string): boolean { return /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/.test(vpa.trim()); }
export function buildUpiUri(input: {vpa:string; payeeName:string; amount?:number; note?:string; openAmount?:boolean}): string {
  if (!isValidVpa(input.vpa)) throw new Error('Enter a valid UPI ID, such as merchant@okicici.');
  if (!input.openAmount && (!Number.isFinite(input.amount) || (input.amount ?? 0) <= 0)) throw new Error('Enter an amount greater than zero.');
  const query = new URLSearchParams({pa:input.vpa.trim(),pn:input.payeeName.trim() || 'Merchant'});
  if (!input.openAmount) query.set('am',(input.amount as number).toFixed(2));
  query.set('cu','INR'); if (input.note?.trim()) query.set('tn',input.note.trim());
  return `upi://pay?${query.toString()}`;
}
export function isValidPaymentLink(url: string): boolean { try { const u=new URL(url); return u.protocol==='https:' && /stripe|paypal|venmo|square|wise/i.test(u.hostname); } catch { return false; } }
