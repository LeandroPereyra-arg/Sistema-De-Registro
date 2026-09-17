import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // --> Redirige /api al Server Express (evita problemas de CORS)
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
