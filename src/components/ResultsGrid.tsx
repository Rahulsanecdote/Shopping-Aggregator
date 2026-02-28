'use client';

// ============================================================
// ResultsGrid component
// Renders the full results area: platform error banners,
// loading skeletons, empty state, or the product card grid.
// ============================================================

import { ProductResult, PlatformError } from '@/lib/types';
import ProductCard from './ProductCard';

interface ResultsGridProps {
  results: ProductResult[];
  errors: PlatformError[];
  isLoading: boolean;
  hasSearched: boolean;
}

// Skeleton card shown while results are loading
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 h-48 rounded-xl bg-gray-200" />
      <div className="mb-2 h-4 w-1/3 rounded bg-gray-200" />
      <div className="mb-2 h-4 w-full rounded bg-gray-200" />
      <div className="mb-2 h-4 w-4/5 rounded bg-gray-200" />
      <div className="mb-4 h-6 w-1/4 rounded bg-gray-200" />
      <div className="h-10 rounded-xl bg-gray-200" />
    </div>
  );
}

export default function ResultsGrid({
  results,
  errors,
  isLoading,
  hasSearched,
}: ResultsGridProps) {
  // --- Loading state ---
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Show 8 skeletons while loading */}
          {Array.from({ length: 8 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // --- Before any search ---
  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-gray-400">
        <svg
          className="h-16 w-16"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <p className="text-lg font-medium">Search for any product to compare prices</p>
        <p className="text-sm">
          We aggregate results from Amazon US, Amazon India &amp; Flipkart
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Platform error banners — shown when one platform fails, but others succeed */}
      {errors.length > 0 && (
        <div className="flex flex-col gap-2">
          {errors.map((err) => (
            <div
              key={err.platform}
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
            >
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>{err.platformName}</strong> couldn&apos;t be reached: {err.message}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Empty state — all platforms returned 0 results */}
      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
          <svg
            className="h-12 w-12"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm">Try a different search term or check back later.</p>
        </div>
      ) : (
        <>
          {/* Results count */}
          <p className="text-sm text-gray-500">
            Found <strong className="text-gray-800">{results.length}</strong> results — sorted by price (low to high)
          </p>

          {/* Product grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={`${product.platform}-${product.id}`} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
