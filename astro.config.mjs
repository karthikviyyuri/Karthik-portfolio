import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  site: "https://karthikviyyuri.dev",
  output: "server",
  adapter: vercel(),
  devToolbar: {
    enabled: false
  },
  integrations: [
    mdx(),
    react(),
    tailwind({
      applyBaseStyles: false
    })
  ],
  prefetch: true,
  vite: {
    build: {
      assetsInlineLimit: 2048
    }
  }
});
