import { CurrencyCode } from '../types';

export const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rateFromINR: number; label: string }> = {
  INR: { symbol: '₹', rateFromINR: 1, label: 'INR (₹)' },
  USD: { symbol: '$', rateFromINR: 0.012, label: 'USD ($)' },
  EUR: { symbol: '€', rateFromINR: 0.011, label: 'EUR (€)' },
  GBP: { symbol: '£', rateFromINR: 0.0095, label: 'GBP (£)' },
};

export function formatPrice(amountINR: number, currency: CurrencyCode = 'INR'): string {
  const config = CURRENCY_RATES[currency] || CURRENCY_RATES.INR;
  const converted = Math.round(amountINR * config.rateFromINR);

  if (currency === 'INR') {
    return `₹${amountINR.toLocaleString('en-IN')}`;
  }
  return `${config.symbol}${converted.toLocaleString('en-US')}`;
}
