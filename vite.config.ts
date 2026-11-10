import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

function nowPlayingPlugin(): Plugin {
  return {
    name: 'now-playing-api',
    configureServer(server) {
      server.middlewares.use('/api/now-playing', async (_req, res) => {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 4000);
          const response = await fetch('https://stm8.painelvox.com:6822/stats?sid=1&json=1', {
            signal: controller.signal,
            headers: {
              'User-Agent': 'RadioPatriaQuerencia/1.0',
            },
          });
          clearTimeout(timeout);
          if (!response.ok) {
            throw new Error(`Shoutcast returned HTTP ${response.status}`);
          }
          const data = (await response.json()) as any;
          const raw = (data.songtitle || '').trim();
          let artist = 'Rádio de Pátria e Querência';
          let title = 'O melhor da música da Pátria Gaúcha';
          if (raw) {
            const sep = raw.includes(' - ') ? ' - ' : (raw.includes(' – ') ? ' – ' : null);
            if (sep) {
              const parts = raw.split(sep);
              artist = parts[0].trim();
              title = parts.slice(1).join(' - ').trim();
            } else {
              title = raw;
            }
          }
          const payload = JSON.stringify({
            artist,
            title,
            raw,
            listeners: data.currentlisteners ?? 0,
            bitrate: data.bitrate || '96',
            updatedAt: Date.now(),
          });
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.end(payload);
        } catch (err: any) {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 502;
          res.end(JSON.stringify({ error: err?.message || 'Failed to fetch stream stats' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      nowPlayingPlugin(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.ico',
          'favicon.png',
          'apple-touch-icon.png',
          'icon.svg',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
        ],
        manifest: {
          id: '/',
          name: 'Rádio de Pátria e Querência',
          short_name: 'Querência',
          description: 'Player oficial da Rádio de Pátria e Querência - Música Gaúcha e Nativista 24h no ar.',
          theme_color: '#090E11',
          background_color: '#090E11',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,jpg}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
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
