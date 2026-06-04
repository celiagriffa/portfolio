import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  base: '/portfolio/',
  plugins: [
    react(),
    sitemap({
      hostname: 'https://https://celiagriffa.github.io',
    })
  ]
})
