import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // ✅ use './' to ensure relative paths
  plugins: [react()],
})
