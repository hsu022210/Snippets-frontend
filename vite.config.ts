import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Convert URL to file path for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  // Plugins
  plugins: [react()],

  // CSS Configuration
  css: {
    preprocessorOptions: {
      scss: {
        // Global SCSS imports
        additionalData: `
          @use "@styles/variables" as *;
          @use "@styles/mixins" as *;
        `
      }
    },
    // CSS Modules Configuration
    modules: {
      localsConvention: 'camelCase'
    }
  },

  // Path Aliases
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@components': resolve(__dirname, 'src/components')
    }
  },

  // Development Server Configuration
  server: {
    port: 3000,
    open: true,
    host: true // Enable access from local network
  },

  // Build Configuration
  build: {
    // Enable source maps for debugging
    sourcemap: true,
    
    // Split CSS into separate files
    cssCodeSplit: true,
    
    // Minification and Chunking
    rollupOptions: {
      output: {
        // Separate vendor chunks for better caching
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-bootstrap': ['bootstrap', 'react-bootstrap']
        }
      }
    },

    // Target modern browsers for better performance
    target: 'esnext',
    
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1000
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.tsx',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
