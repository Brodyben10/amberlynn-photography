// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'static',
  integrations: [mdx()],
  vite: {
    // Dev-only: lets a Cloudflare quick tunnel reach the dev server.
    server: { allowedHosts: ['.trycloudflare.com'] },
  },
});
