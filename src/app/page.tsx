'use client';

// ============================================================
// Main page — the entire Phase 1 MVP UI lives here.
// Renders the header, search bar, and results grid.
// Manages search state and calls the /api/search route.
// ============================================================

import { useState, useCallback } from 'react';
import SearchBar from '@/components/SearchBar';
import ResultsGrid from '@/components/ResultsGrid';
import { ProductResult, PlatformError } from '@/lib/types';

export default function Home() {
  const [results, setResults] = useState<ProductResult[]>([]);
  const [errors, setErrors] = useState<PlatformError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState('');

  /**
   * Triggered by SearchBar on submit.
   * Calls /api/search and updates local state with the response.
   */
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setLastQuery(query);
    setResults([]);
    setErrors([]);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query.trim())}`
      );

      if (!response.ok) {
        // Surface top-level API errors
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message ?? `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results ?? []);
      setErrors(data.errors ?? []);
    } catch (err) {
      // Network-level or unexpected errors — show a generic error banner
      setErrors([
        {
          platform: 'amazon-us',
          platformName: 'Search',
          message:
            err instanceof Error
              ? err.message
              : 'An unexpected error occurred. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* ── Header ────────────────────────────────────────────── */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              🛒 ShopAgg
            </h1>
            <p className="text-sm text-gray-500">
              Compare prices across Amazon US, Amazon India &amp; Flipkart
            </p>
          </div>
        </div>
      </header>

      {/* ── Search bar ─────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Show the active query while results are loading or displayed */}
          {hasSearched && lastQuery && (
            <p className="mt-3 text-center text-sm text-gray-400">
              {isLoading ? 'Searching for ' : 'Results for '}
              <strong className="text-gray-600">&ldquo;{lastQuery}&rdquo;</strong>
            </p>
          )}
        </div>
      </section>

      {/* ── Results ────────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ResultsGrid
          results={results}
          errors={errors}
          isLoading={isLoading}
          hasSearched={hasSearched}
        />
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        <p>
          ShopAgg aggregates listings from Amazon and Flipkart via their official affiliate APIs.
          Prices may vary. Always verify on the retailer&apos;s site before purchase.
        </p>
        <p className="mt-1">Phase 1 MVP — Text search only</p>
      </footer>
    </div>
  );
}
