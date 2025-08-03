import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      src: "/src",
    },


  },
  server: {
    port: 3000,
    // Allow all ngrok-free.app subdomains (recommended for flexibility)
    host: true, // Ensures Vite listens on all network interfaces
    strictPort: true, // Exit if port 3000 is occupied
    allowedHosts: [
      '.ngrok-free.app', // Allows ANY ngrok URL (wildcard)
      // OR for a specific URL (less flexible):
      // 'ad79-23-124-111-47.ngrok-free.app',
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your backend server
        changeOrigin: true,
        secure: false, // Disable SSL verification for local proxies
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});