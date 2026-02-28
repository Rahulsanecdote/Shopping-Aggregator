// ============================================================
// Shared utility functions: price formatting, sorting, etc.
// ============================================================

import { ProductResult, Currency } from './types';

/**
 * Format a raw price number into a locale-aware display string.
 * USD: "$1,099.99"   INR: "₹69,900"
 */
export function formatPrice(amount: number, currency: Currency): string {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  // INR — no fractional paise displayed
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Sort combined results from all platforms.
 * Strategy: USD results first (sorted by price asc),
 * followed by INR results (sorted by price asc).
 * This avoids the need for live FX conversion.
 */
export function sortResults(results: ProductResult[]): ProductResult[] {
  const usdResults = results
    .filter((r) => r.currency === 'USD')
    .sort((a, b) => a.price - b.price);

  const inrResults = results
    .filter((r) => r.currency === 'INR')
    .sort((a, b) => a.price - b.price);

  return [...usdResults, ...inrResults];
}

/**
 * Truncate a string to a max length, appending "…" if truncated.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Map a Platform ID to its display-friendly name and brand color class.
 */
export const PLATFORM_META: Record<
  string,
  { name: string; colorClass: string; bgClass: string }
> = {
  'amazon-us': {
    name: 'Amazon US',
    colorClass: 'text-orange-600',
    bgClass: 'bg-orange-100',
  },
  'amazon-india': {
    name: 'Amazon India',
    colorClass: 'text-yellow-700',
    bgClass: 'bg-yellow-100',
  },
  flipkart: {
    name: 'Flipkart',
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-100',
  },
};
