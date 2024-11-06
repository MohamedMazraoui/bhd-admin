import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'


// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    mkcert()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  server: {
    https: true,
    host: "0.0.0.0",
    port: 3333,
    strictPort: true,
    hmr: {
      host: "localhost",
      port: 3333
    }
  }
})
