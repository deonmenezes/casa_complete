import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 👈 allows LAN access
    port: 5174       // optional, defaults to 5173
  }
})
