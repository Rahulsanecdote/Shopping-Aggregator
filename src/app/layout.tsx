// ============================================================
// Root layout — wraps every page in the app.
// Sets global metadata and applies the base Tailwind styles.
// ============================================================

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShopAgg — Compare Prices Across Amazon & Flipkart',
  description:
    'Search any product and instantly compare prices from Amazon US, Amazon India, and Flipkart — sorted from lowest to highest.',
  openGraph: {
    title: 'ShopAgg — Multi-Platform Price Comparison',
    description: 'Find the best deals across Amazon US, Amazon India, and Flipkart.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
