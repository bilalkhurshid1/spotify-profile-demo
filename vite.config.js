import { defineConfig } from 'vite';

export default defineConfig(
  {
    build: {
      rollupOptions: {
        input: {
          main: 'index.html',
          dashboard: 'dashboard.html',
        }
      }
    },
    esbuild: {
      supported: {
        'top-level-await': true //browsers can handle top-level-await features
      },
    }
  })