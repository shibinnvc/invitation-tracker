import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'firebase/app',
      'firebase/firestore',
      'react',
      'react-dom',
      'react-router-dom',
      'recharts',
    ],
  },
})
