import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// TAURI_DEV_HOST is set by `tauri dev` on mobile; undefined for desktop/web.
const tauriDevHost = process.env.TAURI_DEV_HOST;

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5173,
        // strictPort ensures Tauri and Capacitor always find the right port.
        strictPort: true,
        host: tauriDevHost ?? 'localhost',
      },
      // Expose both VITE_ and TAURI_ env-var prefixes.
      envPrefix: ['VITE_', 'TAURI_'],
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
        }
      },
      build: {
        // Target a modern Chrome when bundling for Tauri (Windows WebView2).
        // For plain web / Capacitor builds, TAURI_ENV_PLATFORM is unset so
        // Vite uses its own sensible default.
        target: process.env.TAURI_ENV_PLATFORM === 'windows'
          ? 'chrome105'
          : undefined,
        minify: process.env.TAURI_ENV_DEBUG ? false : 'esbuild',
        sourcemap: !!process.env.TAURI_ENV_DEBUG,
      },
    };
});
