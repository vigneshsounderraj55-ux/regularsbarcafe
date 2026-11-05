import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const missing = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']
    .filter((name) => !env[name]?.trim());

  if (missing.length > 0) {
    throw new Error(`Missing required build environment variables: ${missing.join(', ')}`);
  }

  return {
    base: './',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      chunkSizeWarningLimit: 1200,
      rolldownOptions: {
        input: {
          main: fileURLToPath(new URL('./index.html', import.meta.url)),
          admin: fileURLToPath(new URL('./admin.html', import.meta.url)),
        },
      },
    },
    server: {
      port: 5173,
      host: true,
    },
  };
});
