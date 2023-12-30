import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import yaml from '@rollup/plugin-yaml';
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx()],
  vite: {
    plugins: [yaml()],
  }
});