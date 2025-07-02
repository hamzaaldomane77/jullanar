import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow external connections (important for mobile testing)
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://backend.jullanar.shop',
        changeOrigin: true,
        secure: true,
        timeout: 30000, // 30 second timeout
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying request to:', req.url);
            // Add headers that might help with mobile requests
            proxyReq.setHeader('User-Agent', req.headers['user-agent'] || 'JullanarApp/1.0');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Proxy response:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
})
