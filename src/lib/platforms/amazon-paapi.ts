// ============================================================
// Shared Amazon PA-API 5.0 helper.
// Implements AWS Signature V4 (HMAC-SHA256) signing from scratch
// using Node.js built-in `crypto` — no external SDK required.
//
// Reference: https://webservices.amazon.com/paapi5/documentation/
// ============================================================

import crypto from 'crypto';
import axios, { AxiosError } from 'axios';
import { ProductResult, Currency } from '../types';
import { formatPrice } from '../utils';

// --- AWS Signing helpers ----------------------------------------

function hmacSHA256(key: string | Buffer, data: string): Buffer {
  return crypto.createHmac('sha256', key).update(data).digest();
}

function sha256Hex(data: string): string {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

/**
 * Derive the AWS V4 signing key from the secret and scope components.
 */
function getSigningKey(
  secretKey: string,
  dateStamp: string,
  region: string,
  service: string
): Buffer {
  const kDate = hmacSHA256('AWS4' + secretKey, dateStamp);
  const kRegion = hmacSHA256(kDate, region);
  const kService = hmacSHA256(kRegion, service);
  return hmacSHA256(kService, 'aws4_request');
}

const PAAPI_SERVICE = 'ProductAdvertisingAPI';
const PAAPI_PATH = '/paapi5/searchitems';
const PAAPI_TARGET = 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems';

/**
 * Build all request headers for an Amazon PA-API call, including
 * the AWS Signature V4 Authorization header.
 */
function buildSignedHeaders(
  host: string,
  region: string,
  accessKey: string,
  secretKey: string,
  body: string
): Record<string, string> {
  const now = new Date();
  // Format: YYYYMMDDTHHMMSSZ (no dashes, colons, or milliseconds)
  const amzDate = now.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const dateStamp = amzDate.slice(0, 8);

  // Canonical headers MUST be sorted alphabetically by header name.
  // Already in alphabetical order below; the sort is a safety net.
  const headerPairs = ([
    ['content-encoding', 'amz-1.0'],
    ['content-type', 'application/json; charset=utf-8'],
    ['host', host],
    ['x-amz-date', amzDate],
    ['x-amz-target', PAAPI_TARGET],
  ] as [string, string][]).sort((a, b) => a[0].localeCompare(b[0]));

  const signedHeaders = headerPairs.map(([k]) => k).join(';');
  // Each header line ends with a newline (\n)
  const canonicalHeaders = headerPairs.map(([k, v]) => `${k}:${v}\n`).join('');

  const payloadHash = sha256Hex(body);

  const canonicalRequest = [
    'POST',
    PAAPI_PATH,
    '', // canonical query string — empty for POST-with-body
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const credentialScope = `${dateStamp}/${region}/${PAAPI_SERVICE}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join('\n');

  const signingKey = getSigningKey(secretKey, dateStamp, region, PAAPI_SERVICE);
  const signature = crypto
    .createHmac('sha256', signingKey)
    .update(stringToSign)
    .digest('hex');

  const authorization =
    `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  // Return a plain object of all headers to send with the request
  return {
    ...Object.fromEntries(headerPairs),
    Authorization: authorization,
  };
}

// --- Types for raw PA-API 5.0 response -------------------------

interface PaapiItem {
  ASIN: string;
  DetailPageURL: string;
  Images?: {
    Primary?: {
      Medium?: { URL: string };
    };
  };
  ItemInfo?: {
    Title?: { DisplayValue: string };
  };
  Offers?: {
    Listings?: Array<{
      Price?: { DisplayAmount: string; Amount: number };
      Availability?: { Message: string };
      DeliveryInfo?: { IsAmazonFulfilled: boolean };
    }>;
  };
}

interface PaapiResponse {
  SearchResult?: {
    Items?: PaapiItem[];
  };
  Errors?: Array<{ Code: string; Message: string }>;
}

// --- Public search function ------------------------------------

export interface AmazonSearchConfig {
  host: string;
  region: string;
  marketplace: string;
  accessKey: string;
  secretKey: string;
  associateTag: string;
  platform: 'amazon-us' | 'amazon-india';
  platformName: string;
  currency: Currency;
}

/**
 * Search Amazon via PA-API 5.0 and return normalized ProductResult[].
 * Throws on network or API errors so the caller can catch and surface them.
 */
export async function searchAmazon(
  query: string,
  config: AmazonSearchConfig
): Promise<ProductResult[]> {
  const { host, region, marketplace, accessKey, secretKey, associateTag, platform, platformName, currency } = config;

  // Build the request body per PA-API 5.0 spec
  const requestBody = JSON.stringify({
    Keywords: query,
    PartnerTag: associateTag,
    PartnerType: 'Associates',
    Marketplace: marketplace,
    SearchIndex: 'All',
    ItemCount: 10,
    Resources: [
      'Images.Primary.Medium',
      'ItemInfo.Title',
      'Offers.Listings.Price',
      'Offers.Listings.Availability.Message',
      'Offers.Listings.DeliveryInfo.IsAmazonFulfilled',
    ],
  });

  const headers = buildSignedHeaders(host, region, accessKey, secretKey, requestBody);

  const response = await axios.post<PaapiResponse>(
    `https://${host}${PAAPI_PATH}`,
    requestBody,
    { headers, timeout: 10000 }
  );

  const data = response.data;

  // PA-API returns a 200 with Errors array on logical errors
  if (data.Errors && data.Errors.length > 0) {
    throw new Error(data.Errors.map((e) => e.Message).join('; '));
  }

  const items = data.SearchResult?.Items ?? [];

  // Normalize each item into our common ProductResult shape
  return items.map((item): ProductResult => {
    const listing = item.Offers?.Listings?.[0];
    const rawPrice = listing?.Price?.Amount ?? 0;
    const displayAmount = listing?.Price?.DisplayAmount ?? formatPrice(rawPrice, currency);
    const availability = listing?.Availability?.Message ?? 'Check site for availability';

    return {
      id: item.ASIN,
      platform,
      platformName,
      name: item.ItemInfo?.Title?.DisplayValue ?? 'Unknown Product',
      image: item.Images?.Primary?.Medium?.URL ?? '',
      price: rawPrice,
      currency,
      displayPrice: displayAmount,
      availability,
      purchaseUrl: item.DetailPageURL,
      // Rating is not available in the SearchItems resource list for PA-API 5.0
      sellerRating: undefined,
      estimatedDelivery: listing?.DeliveryInfo?.IsAmazonFulfilled
        ? 'Fulfilled by Amazon'
        : undefined,
    };
  });
}
