// ============================================================
// Core types shared across the application.
// Each platform's module normalizes its response into ProductResult.
// ============================================================

/** Supported shopping platforms in Phase 1 MVP */
export type Platform = 'amazon-us' | 'amazon-india' | 'flipkart';

/** Currency codes used by our supported platforms */
export type Currency = 'USD' | 'INR';

/** A single normalized product result from any platform */
export interface ProductResult {
  /** Unique ID — typically the platform's own product/ASIN ID */
  id: string;

  /** Which platform this result came from */
  platform: Platform;

  /** Human-readable platform name for display */
  platformName: string;

  /** Product display name */
  name: string;

  /** Product image URL */
  image: string;

  /** Raw price number — used for sorting within same currency group */
  price: number;

  /** ISO currency code */
  currency: Currency;

  /** Formatted price string for display, e.g. "$29.99" or "₹2,499" */
  displayPrice: string;

  /** Availability string, e.g. "In Stock", "Only 3 left", "Out of Stock" */
  availability: string;

  /** Seller / product rating out of 5, if available */
  sellerRating?: number;

  /** Estimated delivery timeframe string, if available */
  estimatedDelivery?: string;

  /** Direct URL to the product page on the platform */
  purchaseUrl: string;
}

/** The shape returned by our /api/search endpoint */
export interface SearchResponse {
  /** Combined, sorted results from all platforms */
  results: ProductResult[];

  /**
   * Any per-platform errors that occurred.
   * Results from successful platforms are still included even if some failed.
   */
  errors: PlatformError[];
}

/** A non-fatal error from a single platform */
export interface PlatformError {
  platform: Platform;
  platformName: string;
  message: string;
}
