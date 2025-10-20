// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
// vite.config.ts
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080/bachhoa', // ✅ đúng context
        changeOrigin: true,
      },
    },
  },
  resolve: { alias: { '@': '/src' } },
})
