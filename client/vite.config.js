import { fileURLToPath, URL } from 'node:url'
import { loadEnv } from 'vite'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify'

const env = loadEnv('',process.cwd(),'')


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: env.OUTDIR || '../dist'
  },
  plugins: [
		vue(),
		vuetify({ autoImport: true }),
	],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
