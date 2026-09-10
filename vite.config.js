/**
 * VITE CONFIGURATION
 * ==================
 * Vite is the tool that:
 *   - Runs your local development server (npm run dev)
 *   - Builds the final files for Cloudflare (npm run build)
 *
 * Think of it as the engine that powers the whole project.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // This tells Vite we are using React (enables JSX, fast refresh, etc.)
    react()
  ],

  build: {
    // Where the final built files go before you push to GitHub
    outDir: 'dist',

    // Makes the final files smaller for faster loading
    minify: 'esbuild',

    // Code splitting: break the app into smaller chunks that load
    // only when needed — keeps initial page load fast
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — downloaded once, cached by the browser
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Supabase client — separated so it doesn't block initial render
          'supabase':     ['@supabase/supabase-js'],
        },
      },
    },

    // Only warn on chunks above 800KB (our split chunks are well below this)
    chunkSizeWarningLimit: 800,
  },

  server: {
    // Local dev runs on http://localhost:5173
    port: 5173,
    open: true, // Automatically opens browser when you run `npm run dev`
  },
})
