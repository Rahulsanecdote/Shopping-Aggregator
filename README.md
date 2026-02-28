# ShopAgg — Multi-Platform Shopping Price Aggregator

Compare product prices across **Amazon US**, **Amazon India**, and **Flipkart** from a single search bar.

> **Phase 1 MVP** — Text search only. Image/voice input and additional platforms are planned for Phase 2+.

---

## Features (Phase 1)

- Text-based product search
- Aggregates results from Amazon US, Amazon India, and Flipkart in parallel
- Results sorted by price (USD first, then INR — each group low to high)
- Platform-branded result cards with image, price, availability, and direct purchase links
- Graceful degradation: if one platform's API fails, results from the other two still display
- **Dev mode**: works without real API keys using realistic mock data

---

## Tech Stack

| Layer       | Choice                           |
|-------------|----------------------------------|
| Framework   | Next.js 16 (App Router)          |
| UI          | React 19 + Tailwind CSS 3        |
| Language    | TypeScript 5                     |
| HTTP        | Axios (Flipkart), Node.js crypto (Amazon signing) |
| Hosting     | Vercel (recommended)             |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout + metadata
│   ├── page.tsx                # Main search page (client component)
│   ├── globals.css             # Tailwind base styles
│   └── api/search/route.ts    # GET /api/search?q=<query>
├── components/
│   ├── SearchBar.tsx           # Search input + submit button
│   ├── ResultsGrid.tsx         # Results container + error banners
│   └── ProductCard.tsx         # Individual product card
└── lib/
    ├── types.ts                # Shared TypeScript interfaces
    ├── mockData.ts             # Dev mock data (3 results per platform)
    ├── utils.ts                # Price formatting + sorting helpers
    └── platforms/
        ├── amazon-paapi.ts     # Shared AWS Sig V4 signing + PA-API caller
        ├── amazon-us.ts        # Amazon US module
        ├── amazon-india.ts     # Amazon India module
        └── flipkart.ts         # Flipkart Affiliate API module
```

---

## Local Setup

### 1. Prerequisites

- Node.js 18.17+ (required by Next.js 16)
- npm 9+

### 2. Clone and install

```bash
git clone <repo-url>
cd Shopping-Aggregator
npm install
```

### 3. Configure environment variables

Copy the example env file and fill in your API credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Amazon US (PA-API 5.0)
# Sign up: https://affiliate-program.amazon.com/
AMAZON_US_ACCESS_KEY=your_access_key
AMAZON_US_SECRET_KEY=your_secret_key
AMAZON_US_ASSOCIATE_TAG=your-tag-20

# Amazon India (PA-API 5.0 - separate affiliate account)
# Sign up: https://affiliate-program.amazon.in/
AMAZON_INDIA_ACCESS_KEY=your_access_key
AMAZON_INDIA_SECRET_KEY=your_secret_key
AMAZON_INDIA_ASSOCIATE_TAG=your-tag-21

# Flipkart Affiliate API
# Apply: https://affiliate.flipkart.com/
FLIPKART_AFFILIATE_ID=your_affiliate_id
FLIPKART_AFFILIATE_TOKEN=your_token
```

> **Dev mode**: If any credentials are missing, that platform returns mock data instead of calling the real API. You can run the app and test the UI without any credentials.

### 4. Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and search for any product.

### 5. Build for production

```bash
npm run build
npm start
```

---

## API Credentials Guide

### Amazon Product Advertising API (PA-API 5.0)

Used for both Amazon US and Amazon India results.

1. **Join the Associates program:**
   - US: [affiliate-program.amazon.com](https://affiliate-program.amazon.com/)
   - India: [affiliate-program.amazon.in](https://affiliate-program.amazon.in/)
2. After joining, go to **Tools → Product Advertising API** and request access.
3. Once approved, navigate to **Manage Your Credentials** to get your Access Key and Secret Key.
4. Your Associate Tag is visible in the Associates dashboard (format: `yourname-20`).

> Amazon US and India require **separate affiliate accounts** and associate tags, but may share the same Access Key/Secret if using the same AWS IAM user.

### Flipkart Affiliate API

> Flipkart's Affiliate API access is restricted. Apply early and note that approval is not guaranteed for all applicants.

1. Apply at [affiliate.flipkart.com](https://affiliate.flipkart.com/)
2. After approval, find your **Affiliate ID** and **Token** in the affiliate dashboard.

---

## Deploy to Vercel

1. Import this repository in [Vercel](https://vercel.com/)
2. Add all environment variables from `.env.example` in the Vercel dashboard under **Settings → Environment Variables**
3. Deploy — Vercel auto-detects Next.js and configures the build

---

## Development Notes

- **All API calls are server-side** — credentials never reach the browser
- **Mock data mode** — remove or leave blank any credential set to see mock results for that platform
- **Error isolation** — each platform runs in its own `Promise.allSettled` branch; one failure never blocks the others
- **Adding platforms** — create a new file in `src/lib/platforms/`, export a `search<Platform>(query)` function, and add it to `src/app/api/search/route.ts`

---

## Roadmap

| Phase | Status | Features |
|-------|--------|---------|
| 1 — MVP | Complete | Text search, Amazon US + India + Flipkart, price-sorted results |
| 2 — Expand | Planned | Image/barcode input, Walmart + eBay, currency conversion, filters |
| 3 — Full Product | Planned | Voice input, user accounts, saved searches, price alerts, PWA |
