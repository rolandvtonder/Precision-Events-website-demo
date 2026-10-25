import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  /* relative, so the build runs from any sub-path (GitHub Pages) or a domain root */
  base: './',
  plugins: [react(), tailwindcss()],
})
