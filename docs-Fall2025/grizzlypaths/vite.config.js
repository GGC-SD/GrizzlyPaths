import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  test: {
    globals: true,              // so you can use describe/test/expect without imports
    environment: 'jsdom',       // gives you document/window
    setupFiles: './setupTests.js', // load extra setup (like jest-dom)
  },
})
