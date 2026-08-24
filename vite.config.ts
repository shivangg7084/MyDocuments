import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Base path is injected at build time by the GitHub Actions workflow so the
// app resolves assets correctly under https://USERNAME.github.io/REPOSITORY/.
// Locally it defaults to "/".
const basePath = process.env.VITE_BASE_PATH ?? "/";

export default defineConfig({
  base: '/MyDocuments/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    // Keep media files out of the JS bundling pipeline; they're served as-is.
    assetsInlineLimit: 0,
  },
});
