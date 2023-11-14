import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'


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