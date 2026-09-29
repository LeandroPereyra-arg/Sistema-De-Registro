import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vitest/config'

const client = fileURLToPath(new URL('./', import.meta.url))

// --> Los test estan fuera de Client (en Document/Frontend), asi que las librerias
//     que importan (react, vitest, testing-library...) se buscan en Client/node_modules
function dependenciasDeClient(): Plugin {
  return {
    name: 'dependencias-de-client',
    enforce: 'pre',
    resolveId(source, importer, options) {
      const esPaquete = !source.startsWith('.') && !source.startsWith('/') && !source.startsWith('\0')
      if (!esPaquete || !importer?.includes('/Document/')) return null
      return this.resolve(source, client + 'index.html', { ...options, skipSelf: true })
    },
  }
}

// --> Los test del Frontend se guardan en la carpeta Document/Frontend (raiz del repo)
export default defineConfig({
  plugins: [react(), dependenciasDeClient()],
  server: { fs: { allow: ['..'] } },
  test: {
    root: '..',
    include: ['Document/Frontend/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    setupFiles: ['Document/Frontend/setup.ts'],
  },
})
