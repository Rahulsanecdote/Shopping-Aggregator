'use client';

// ============================================================
// SearchBar component
// Controlled text input with submit button.
// Submits on Enter key or button click.
// Disabled while a search is in progress.
// ============================================================

import { useState, FormEvent, KeyboardEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [inputValue, setInputValue] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-2xl gap-2"
      aria-label="Product search form"
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder='Search for any product… e.g. "Sony WH-1000XM5"'
        disabled={isLoading}
        className="
          flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base
          shadow-sm outline-none transition
          placeholder:text-gray-400
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200
          disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400
        "
        aria-label="Search query"
        autoFocus
      />
      <button
        type="submit"
        disabled={isLoading || !inputValue.trim()}
        className="
          rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white
          shadow-sm transition
          hover:bg-blue-700
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:bg-blue-300
        "
        aria-label="Search"
      >
        {isLoading ? (
          // Spinner icon while loading
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Searching…
          </span>
        ) : (
          'Search'
        )}
      </button>
    </form>
  );
}
