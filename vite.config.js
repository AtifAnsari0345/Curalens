import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Optimize React refresh to prevent excessive refreshing
      fastRefresh: true,
    }),
    VitePWA({
      registerType: 'prompt', // Changed from 'autoUpdate' to 'prompt' to prevent automatic refreshing
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'robots.txt', 'Curalens app logo.jpg', 'screenshots/*.png'],
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: false, // Changed to false to prevent automatic activation
        clientsClaim: false, // Added to prevent claiming clients automatically
        disableDevLogs: true, // Disable dev logs to reduce noise
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/], // Don't use fallback for API requests
      },
      manifest: {
        name: 'CuraLens - Medicine Management',
        short_name: 'CuraLens',
        description: 'Medicine identification and drug interaction checker',
        theme_color: '#4a90e2',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/Curalens app logo.jpg',
            sizes: '192x192',
            type: 'image/jpg',
            purpose: 'any maskable'
          },
          {
            src: '/Curalens app logo.jpg',
            sizes: '512x512',
            type: 'image/jpg',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
      }
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    },
    port: 5174,
    strictPort: true, // Changed to true to ensure consistent port usage
    host: true,
    hmr: {
      host: 'localhost',
      port: 5174,
      protocol: 'ws', // Use 'wss' if serving over HTTPS
      clientPort: 5174, // Ensures the client connects to the correct port
      overlay: false, // Disable the error overlay that causes refreshes
      timeout: 5000 // Increase timeout for better stability
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
})