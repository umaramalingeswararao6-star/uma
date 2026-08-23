import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'ac1b3ea9e4a24a.lhr.life',
      '.lhr.life',
      'localhost',
      '127.0.0.1'
    ]
  }
});
