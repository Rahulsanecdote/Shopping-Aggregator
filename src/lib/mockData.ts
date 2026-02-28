// ============================================================
// Mock product data used in development / when API keys are absent.
// Each platform returns 3 realistic sample results.
// ============================================================

import { ProductResult } from './types';

export const MOCK_AMAZON_US: ProductResult[] = [
  {
    id: 'B0CHX3TB4P',
    platform: 'amazon-us',
    platformName: 'Amazon US',
    name: 'Apple MacBook Air 13-inch (M3 chip) — 8GB RAM, 256GB SSD, Midnight',
    image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._AC_SX679_.jpg',
    price: 1099.0,
    currency: 'USD',
    displayPrice: '$1,099.00',
    availability: 'In Stock',
    sellerRating: 4.7,
    estimatedDelivery: 'Arrives in 2 days',
    purchaseUrl: 'https://www.amazon.com/dp/B0CHX3TB4P',
  },
  {
    id: 'B0BVPPH7DM',
    platform: 'amazon-us',
    platformName: 'Amazon US',
    name: 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones',
    image: 'https://m.media-amazon.com/images/I/61gVoMpMsoL._AC_SX679_.jpg',
    price: 279.99,
    currency: 'USD',
    displayPrice: '$279.99',
    availability: 'In Stock',
    sellerRating: 4.6,
    estimatedDelivery: 'Arrives tomorrow',
    purchaseUrl: 'https://www.amazon.com/dp/B09XS7JWHH',
  },
  {
    id: 'B08N5LNQCX',
    platform: 'amazon-us',
    platformName: 'Amazon US',
    name: 'Samsung 65-Inch Class QLED 4K Q60C Series Smart TV',
    image: 'https://m.media-amazon.com/images/I/81s2tBYpCuL._AC_SX679_.jpg',
    price: 797.99,
    currency: 'USD',
    displayPrice: '$797.99',
    availability: 'In Stock',
    sellerRating: 4.4,
    estimatedDelivery: 'Ships in 3–5 days',
    purchaseUrl: 'https://www.amazon.com/dp/B0BZQVRTJH',
  },
];

export const MOCK_AMAZON_INDIA: ProductResult[] = [
  {
    id: 'B0CHBWJ2SR',
    platform: 'amazon-india',
    platformName: 'Amazon India',
    name: 'Apple iPhone 15 (128 GB) — Black',
    image: 'https://m.media-amazon.com/images/I/61lsexTCOqL._SX679_.jpg',
    price: 69900,
    currency: 'INR',
    displayPrice: '₹69,900',
    availability: 'In Stock',
    sellerRating: 4.6,
    estimatedDelivery: 'Delivers in 2–3 days',
    purchaseUrl: 'https://www.amazon.in/dp/B0CHBWJ2SR',
  },
  {
    id: 'B0CS1TLFG4',
    platform: 'amazon-india',
    platformName: 'Amazon India',
    name: 'Samsung Galaxy S24 5G AI Smartphone (Onyx Black, 8GB, 128GB Storage)',
    image: 'https://m.media-amazon.com/images/I/71QgbwJXSLL._SX679_.jpg',
    price: 54999,
    currency: 'INR',
    displayPrice: '₹54,999',
    availability: 'In Stock',
    sellerRating: 4.4,
    estimatedDelivery: 'Delivers in 1–2 days',
    purchaseUrl: 'https://www.amazon.in/dp/B0CS1TLFG4',
  },
  {
    id: 'B09TJ27S4C',
    platform: 'amazon-india',
    platformName: 'Amazon India',
    name: 'Sony WH-1000XM5 Industry Leading Noise Canceling Headphones (India)',
    image: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._SX679_.jpg',
    price: 26990,
    currency: 'INR',
    displayPrice: '₹26,990',
    availability: 'In Stock',
    sellerRating: 4.5,
    estimatedDelivery: 'Delivers in 2 days',
    purchaseUrl: 'https://www.amazon.in/dp/B09X9JXSC4',
  },
];

export const MOCK_FLIPKART: ProductResult[] = [
  {
    id: 'ITMDZ3GKMZTBXQHZ',
    platform: 'flipkart',
    platformName: 'Flipkart',
    name: 'realme narzo 70 5G (Forge Grey, 128 GB) — 8 GB RAM',
    image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/mobile/g/z/d/-original-imaf6e37wgghzfyy.jpeg',
    price: 14999,
    currency: 'INR',
    displayPrice: '₹14,999',
    availability: 'In Stock',
    sellerRating: 4.2,
    estimatedDelivery: 'Delivers in 2–3 days',
    purchaseUrl: 'https://www.flipkart.com/realme-narzo-70-5g-forge-grey-128-gb/p/itmdz3gkmztbxqhz',
  },
  {
    id: 'ITMLCMRV4YDKEYNS',
    platform: 'flipkart',
    platformName: 'Flipkart',
    name: 'boAt Rockerz 550 Bluetooth Wireless On Ear Headphones — Luscious Black',
    image: 'https://rukminim2.flixcart.com/image/416/416/headphone/v/r/z/boat-rockerz-550-original-imaezqmff2rzmpyh.jpeg',
    price: 1299,
    currency: 'INR',
    displayPrice: '₹1,299',
    availability: 'In Stock',
    sellerRating: 4.1,
    estimatedDelivery: 'Delivers in 3–4 days',
    purchaseUrl: 'https://www.flipkart.com/boat-rockerz-550-bluetooth-wireless-on-ear-headphones/p/itmcq3zhhfqfhvzz',
  },
  {
    id: 'ITMLCMRV4WATCH01',
    platform: 'flipkart',
    platformName: 'Flipkart',
    name: 'Noise ColorFit Pro 5 Smart Watch — Jet Black, 1.85" AMOLED Display',
    image: 'https://rukminim2.flixcart.com/image/416/416/xif0q/smartwatch/d/p/j/44-noisecolfitpro5-noise-yes-original-imah6gbgxkfhzyge.jpeg',
    price: 2499,
    currency: 'INR',
    displayPrice: '₹2,499',
    availability: 'In Stock',
    sellerRating: 4.0,
    estimatedDelivery: 'Delivers in 2 days',
    purchaseUrl: 'https://www.flipkart.com/noise-colorfit-pro-5-smart-watch/p/itm123456',
  },
];

/** Returns all mock data combined */
export function getAllMockData(): ProductResult[] {
  return [...MOCK_AMAZON_US, ...MOCK_AMAZON_INDIA, ...MOCK_FLIPKART];
}
