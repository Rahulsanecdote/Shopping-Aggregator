import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Platform brand colors for badges
      colors: {
        'amazon-us': '#FF9900',
        'amazon-india': '#232F3E',
        'flipkart': '#2874F0',
      },
    },
  },
  plugins: [],
};

export default config;
