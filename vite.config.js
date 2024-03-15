import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: '@kitbag/events',
      fileName: 'kitbag-events',
    },
  },
  plugins: [
    dts({ 
      rollupTypes: true 
    })
  ]
})