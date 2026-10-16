import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react() , tailwindcss()],
  resolve: {
    alias: {
      // "@/..." means "src/...", e.g. import Button from "@/components/Button"
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
