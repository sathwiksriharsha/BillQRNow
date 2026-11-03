export type RouteCurrency = 'INR' | 'USD' | 'GBP' | 'CAD' | 'AUD' | 'EUR';

export function currencyForRoute(slug: string): RouteCurrency {
  if (slug === 'us/uk-vat-invoice-generator') return 'GBP';
  if (slug === 'us/canada-gst-hst-invoice-generator') return 'CAD';
  if (slug === 'us/australia-tax-invoice-abn-generator') return 'AUD';
  if (slug === 'us/eu-reverse-charge-b2b-invoice') return 'EUR';
  return slug.startsWith('us/') ? 'USD' : 'INR';
}

export function formatRouteCurrency(amount: number, currency: RouteCurrency): string {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(amount);
}
