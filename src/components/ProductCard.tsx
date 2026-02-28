'use client';

// ============================================================
// ProductCard component
// Displays a single product result from any platform.
// Shows: image, platform badge, name, price, availability, and
// a "View Deal" button that opens the purchase URL in a new tab.
// ============================================================

import Image from 'next/image';
import { ProductResult } from '@/lib/types';
import { PLATFORM_META, truncate } from '@/lib/utils';

interface ProductCardProps {
  product: ProductResult;
}

// Star rating display (up to 5 filled/empty stars)
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.round(rating);
  return (
    <div className="flex items-center gap-1 text-sm" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < fullStars ? 'text-yellow-400' : 'text-gray-300'}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
      <span className="text-gray-500">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const meta = PLATFORM_META[product.platform] ?? {
    name: product.platformName,
    colorClass: 'text-gray-600',
    bgClass: 'bg-gray-100',
  };

  const isAvailable = !product.availability.toLowerCase().includes('out of stock');

  return (
    <article className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Product image */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-gray-50">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4"
            unoptimized // Allow any CDN without per-domain config changes
          />
        ) : (
          // Fallback placeholder when no image is available
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-16 w-16 text-gray-300"
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Platform badge */}
        <span
          className={`inline-block self-start rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.bgClass} ${meta.colorClass}`}
        >
          {meta.name}
        </span>

        {/* Product name — truncated to 2 lines worth of characters */}
        <h3 className="text-sm font-medium leading-snug text-gray-800" title={product.name}>
          {truncate(product.name, 90)}
        </h3>

        {/* Price */}
        <p className="text-xl font-bold text-gray-900">{product.displayPrice}</p>

        {/* Availability */}
        <p
          className={`text-xs font-medium ${
            isAvailable ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {product.availability}
        </p>

        {/* Seller rating (if provided) */}
        {product.sellerRating !== undefined && (
          <StarRating rating={product.sellerRating} />
        )}

        {/* Estimated delivery (if provided) */}
        {product.estimatedDelivery && (
          <p className="text-xs text-gray-500">{product.estimatedDelivery}</p>
        )}

        {/* Spacer to push the button to the bottom of the card */}
        <div className="flex-1" />

        {/* View Deal button — opens the platform's product page */}
        <a
          href={product.purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-auto block w-full rounded-xl bg-blue-600 px-4 py-2.5
            text-center text-sm font-semibold text-white
            transition hover:bg-blue-700
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
          "
          aria-label={`View deal on ${meta.name} for ${product.name}`}
        >
          View Deal →
        </a>
      </div>
    </article>
  );
}
