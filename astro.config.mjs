// @ts-check
import { defineConfig } from 'astro/config';
import trustKit from './src/integrations/trust-kit.mjs';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://realsalary.co.uk',
  trailingSlash: 'always',
  integrations: [
    trustKit({ lang: 'en', siteUrl: 'https://realsalary.co.uk', siteName: 'RealSalary', founded: '2026-06-27', about: '/about/', method: '/methodology/' }), react(), sitemap()],
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport',
  },
  vite: {
    plugins: [tailwindcss()]
  }
});