// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import { EnumChangefreq } from 'sitemap';

export default defineConfig({
  site: 'https://anvilprime.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/privacy') &&
        !page.includes('/terms'),
      serialize(item) {
        const url = item.url;

        if (url === 'https://anvilprime.com/')
          return { ...item, priority: 1.0, changefreq: EnumChangefreq.WEEKLY };

        if (url.includes('/services'))
          return { ...item, priority: 0.9, changefreq: EnumChangefreq.MONTHLY };

        if (url.includes('/contact'))
          return { ...item, priority: 0.85, changefreq: EnumChangefreq.MONTHLY };

        if (url.includes('/industries'))
          return { ...item, priority: 0.8, changefreq: EnumChangefreq.MONTHLY };

        if (url.includes('/case-studies'))
          return { ...item, priority: 0.8, changefreq: EnumChangefreq.WEEKLY };

        if (url.includes('/about'))
          return { ...item, priority: 0.75, changefreq: EnumChangefreq.MONTHLY };

        if (url.includes('/insights'))
          return { ...item, priority: 0.7, changefreq: EnumChangefreq.WEEKLY };

        if (url.includes('/careers'))
          return { ...item, priority: 0.6, changefreq: EnumChangefreq.MONTHLY };

        return { ...item, priority: 0.5, changefreq: EnumChangefreq.MONTHLY };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: [],
  },
});
