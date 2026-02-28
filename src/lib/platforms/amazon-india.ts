// ============================================================
// Amazon India platform module.
// Identical flow to amazon-us, but uses the amazon.in endpoint
// and eu-west-1 region (as required by Amazon PA-API for India).
// Falls back to mock data when credentials are not configured.
// ============================================================

import { ProductResult } from '../types';
import { searchAmazon, AmazonSearchConfig } from './amazon-paapi';
import { MOCK_AMAZON_INDIA } from '../mockData';

/** True when all required Amazon India credentials are present */
function hasCredentials(): boolean {
  return Boolean(
    process.env.AMAZON_INDIA_ACCESS_KEY &&
    process.env.AMAZON_INDIA_SECRET_KEY &&
    process.env.AMAZON_INDIA_ASSOCIATE_TAG
  );
}

const AMAZON_INDIA_CONFIG: Omit<AmazonSearchConfig, 'accessKey' | 'secretKey' | 'associateTag'> = {
  host: 'webservices.amazon.in',
  region: 'eu-west-1', // Amazon India uses eu-west-1 per PA-API docs
  marketplace: 'www.amazon.in',
  platform: 'amazon-india',
  platformName: 'Amazon India',
  currency: 'INR',
};

/**
 * Search Amazon India for the given query.
 * Returns real results when credentials are present, mock data otherwise.
 */
export async function searchAmazonIndia(query: string): Promise<ProductResult[]> {
  if (!hasCredentials()) {
    console.warn('[amazon-india] No credentials configured — returning mock data.');
    return MOCK_AMAZON_INDIA;
  }

  return searchAmazon(query, {
    ...AMAZON_INDIA_CONFIG,
    accessKey: process.env.AMAZON_INDIA_ACCESS_KEY!,
    secretKey: process.env.AMAZON_INDIA_SECRET_KEY!,
    associateTag: process.env.AMAZON_INDIA_ASSOCIATE_TAG!,
  });
}
