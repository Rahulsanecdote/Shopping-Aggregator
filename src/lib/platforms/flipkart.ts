// ============================================================
// Flipkart Affiliate API platform module.
//
// ⚠️  IMPORTANT: Flipkart's Affiliate API is only accessible to
//     approved affiliate partners. Apply at https://affiliate.flipkart.com/
//     This module falls back to mock data when credentials are absent.
//
// API docs: https://affiliate.flipkart.com/introduction
// ============================================================

import axios, { AxiosError } from 'axios';
import { ProductResult } from '../types';
import { formatPrice } from '../utils';
import { MOCK_FLIPKART } from '../mockData';

const FLIPKART_API_BASE = 'https://affiliate-api.flipkart.io';

/** True when Flipkart Affiliate credentials are configured */
function hasCredentials(): boolean {
  return Boolean(
    process.env.FLIPKART_AFFILIATE_ID &&
    process.env.FLIPKART_AFFILIATE_TOKEN
  );
}

// --- Types for the raw Flipkart Affiliate API response ---------

interface FlipkartPrice {
  amount: number;
  currency: string;
}

interface FlipkartProductBaseInfo {
  productId: string;
  title: string;
  productUrl: string;
  imageUrls?: Record<string, string>;
  maximumRetailPrice?: FlipkartPrice;
  flipkartSellingPrice?: FlipkartPrice;
  outOfStock?: boolean;
}

interface FlipkartProduct {
  productBaseInfoV1: FlipkartProductBaseInfo;
}

interface FlipkartSearchResponse {
  products?: FlipkartProduct[];
  // The API also wraps results under `apiGroups` in some response versions
  apiGroups?: {
    affiliateStoreGroup?: {
      affiliateGroups?: Array<{
        affiliateProducts?: FlipkartProduct[];
      }>;
    };
  };
}

/**
 * Search Flipkart via the Affiliate API and return normalized ProductResult[].
 * Falls back to mock data when credentials are not configured.
 */
export async function searchFlipkart(query: string): Promise<ProductResult[]> {
  if (!hasCredentials()) {
    console.warn('[flipkart] No credentials configured — returning mock data.');
    return MOCK_FLIPKART;
  }

  const response = await axios.get<FlipkartSearchResponse>(
    `${FLIPKART_API_BASE}/affiliate/1.0/search`,
    {
      params: {
        query,
        resultCount: 10,
      },
      headers: {
        'Fk-Affiliate-Id': process.env.FLIPKART_AFFILIATE_ID!,
        'Fk-Affiliate-Token': process.env.FLIPKART_AFFILIATE_TOKEN!,
      },
      timeout: 10000,
    }
  );

  // The Flipkart API can structure products under different keys depending on version
  const products: FlipkartProduct[] =
    response.data.products ??
    response.data.apiGroups?.affiliateStoreGroup?.affiliateGroups?.flatMap(
      (g) => g.affiliateProducts ?? []
    ) ??
    [];

  return products.map((product): ProductResult => {
    const info = product.productBaseInfoV1;
    // Prefer the selling price over MRP
    const priceData = info.flipkartSellingPrice ?? info.maximumRetailPrice;
    const rawPrice = priceData?.amount ?? 0;

    // Pick the best available image URL (prefer 200x200, fallback to first)
    const imageUrls = info.imageUrls ?? {};
    const image =
      imageUrls['200x200'] ??
      Object.values(imageUrls)[0] ??
      '';

    return {
      id: info.productId,
      platform: 'flipkart',
      platformName: 'Flipkart',
      name: info.title,
      image,
      price: rawPrice,
      currency: 'INR',
      displayPrice: formatPrice(rawPrice, 'INR'),
      availability: info.outOfStock ? 'Out of Stock' : 'In Stock',
      purchaseUrl: info.productUrl,
    };
  });
}
