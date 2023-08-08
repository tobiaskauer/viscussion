import { fileURLToPath, URL } from "node:url";
import { loadEnv } from "vite";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import inject from "@rollup/plugin-inject";

const env = loadEnv("", process.cwd(), "");

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: env.OUTDIR || "../dist",
  },
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    inject({
      // => that should be first under plugins array
      $: "jquery",
      jQuery: "jquery",
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
