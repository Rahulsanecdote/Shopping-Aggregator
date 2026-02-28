// ============================================================
// GET /api/search?q=<query>
//
// Aggregated search API route.
// Calls all three platform modules in parallel using Promise.allSettled()
// so that a failure in one platform never blocks results from the others.
//
// Response shape: SearchResponse (see src/lib/types.ts)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { searchAmazonUS } from '@/lib/platforms/amazon-us';
import { searchAmazonIndia } from '@/lib/platforms/amazon-india';
import { searchFlipkart } from '@/lib/platforms/flipkart';
import { sortResults } from '@/lib/utils';
import { ProductResult, PlatformError, Platform } from '@/lib/types';

// Map each platform to its human-readable name for error messages
const PLATFORM_NAMES: Record<Platform, string> = {
  'amazon-us': 'Amazon US',
  'amazon-india': 'Amazon India',
  flipkart: 'Flipkart',
};

export async function GET(request: NextRequest) {
  // --- Validate query parameter ---
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query) {
    return NextResponse.json(
      { message: 'Query parameter "q" is required.' },
      { status: 400 }
    );
  }

  if (query.length > 200) {
    return NextResponse.json(
      { message: 'Query is too long. Maximum 200 characters.' },
      { status: 400 }
    );
  }

  // --- Call all platforms in parallel ---
  // Promise.allSettled ensures one platform failure doesn't block others.
  const [usResult, indiaResult, flipkartResult] = await Promise.allSettled([
    searchAmazonUS(query),
    searchAmazonIndia(query),
    searchFlipkart(query),
  ]);

  const allResults: ProductResult[] = [];
  const errors: PlatformError[] = [];

  // Helper to extract results or record the error for each platform
  function processResult(
    result: PromiseSettledResult<ProductResult[]>,
    platform: Platform
  ) {
    if (result.status === 'fulfilled') {
      allResults.push(...result.value);
    } else {
      // Log server-side for debugging; surface a user-friendly message
      console.error(`[api/search] ${platform} failed:`, result.reason);
      errors.push({
        platform,
        platformName: PLATFORM_NAMES[platform],
        message:
          result.reason instanceof Error
            ? result.reason.message
            : 'Unknown error',
      });
    }
  }

  processResult(usResult, 'amazon-us');
  processResult(indiaResult, 'amazon-india');
  processResult(flipkartResult, 'flipkart');

  // Sort results: USD (low→high) then INR (low→high)
  const sortedResults = sortResults(allResults);

  return NextResponse.json(
    { results: sortedResults, errors },
    {
      status: 200,
      headers: {
        // Cache search results for 5 minutes on the CDN edge
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    }
  );
}
