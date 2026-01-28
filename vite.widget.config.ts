import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist/widget',
    lib: {
      entry: path.resolve(__dirname, 'widget/index.tsx'),
      name: 'ClutchLeaseCalculator',
      fileName: 'clutch-lease-calculator',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        assetFileNames: 'clutch-lease-calculator.[ext]',
      },
    },
    cssCodeSplit: false,
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
})
