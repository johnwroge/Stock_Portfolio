import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    silent: true, 
    // reporters: 'default',
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
