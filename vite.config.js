import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: 'https://human-interaction-lab.github.io/PROCSForm/',
  build: {
    outDir: 'docs'
  },
  plugins: [react()],
})
