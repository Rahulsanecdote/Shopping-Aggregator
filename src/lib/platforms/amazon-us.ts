// ============================================================
// Amazon US platform module.
// Uses PA-API 5.0 via the shared amazon-paapi helper.
// Falls back to mock data when credentials are not configured.
// ============================================================

import { ProductResult } from '../types';
import { searchAmazon, AmazonSearchConfig } from './amazon-paapi';
import { MOCK_AMAZON_US } from '../mockData';

/** True when all required Amazon US credentials are present */
function hasCredentials(): boolean {
  return Boolean(
    process.env.AMAZON_US_ACCESS_KEY &&
    process.env.AMAZON_US_SECRET_KEY &&
    process.env.AMAZON_US_ASSOCIATE_TAG
  );
}

const AMAZON_US_CONFIG: Omit<AmazonSearchConfig, 'accessKey' | 'secretKey' | 'associateTag'> = {
  host: 'webservices.amazon.com',
  region: 'us-east-1',
  marketplace: 'www.amazon.com',
  platform: 'amazon-us',
  platformName: 'Amazon US',
  currency: 'USD',
};

/**
 * Search Amazon US for the given query.
 * Returns real results when credentials are present, mock data otherwise.
 */
export async function searchAmazonUS(query: string): Promise<ProductResult[]> {
  if (!hasCredentials()) {
    // Dev mode: return mock data with a flag so the UI can indicate this
    console.warn('[amazon-us] No credentials configured — returning mock data.');
    return MOCK_AMAZON_US;
  }

  return searchAmazon(query, {
    ...AMAZON_US_CONFIG,
    accessKey: process.env.AMAZON_US_ACCESS_KEY!,
    secretKey: process.env.AMAZON_US_SECRET_KEY!,
    associateTag: process.env.AMAZON_US_ASSOCIATE_TAG!,
  });
}
