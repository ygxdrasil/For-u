import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

/**
 * Mounts Grace's API into the dev server so `npm run dev` is a single process
 * and the API key never reaches the browser. Production uses server/index.ts,
 * which mounts the very same router.
 */
function graceApi(): Plugin {
  return {
    name: 'grace-api',
    async configureServer(server) {
      const {createApi} = await server.ssrLoadModule('/server/api.ts');
      server.middlewares.use('/api', createApi());
    },
  };
}

/**
 * A stamp for this build, baked into the bundle and written beside it.
 *
 * The app compares the two and offers a reload when they differ. Without it
 * there is no way for anyone — the user or me — to tell a stale page from a
 * current one, and "nothing changed" is indistinguishable from "the change
 * didn't work". That cost two rounds of confusion before this existed.
 */
const BUILD = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);

function buildStamp(): Plugin {
  return {
    name: 'grace-build-stamp',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'build.json',
        source: JSON.stringify({build: BUILD}),
      });
    },
  };
}

export default defineConfig(() => {
  return {
    define: {__BUILD__: JSON.stringify(BUILD)},
    plugins: [react(), tailwindcss(), graceApi(), buildStamp()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
