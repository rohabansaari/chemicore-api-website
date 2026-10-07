// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://chemicoreapi.com',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
