import { defineConfig } from "vite";
import postcssImport from "postcss-import";

export default defineConfig({
  css: {
    postcss: {
      plugins: [postcssImport()],
    },
  },
});
