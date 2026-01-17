import mdx from '@mdx-js/rollup';
import rehypeShiki from '@shikijs/rehype';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@components': fileURLToPath(
        new URL('./src/components', import.meta.url)
      ),
      '@context': fileURLToPath(new URL('./src/context', import.meta.url)),
      '@locales': fileURLToPath(new URL('./src/locales', import.meta.url)),
      '@i18n': fileURLToPath(new URL('./src/i18n', import.meta.url)),
      '@icons': fileURLToPath(
        new URL('./src/components/icons', import.meta.url)
      ),
      '@config': fileURLToPath(new URL('./src/config', import.meta.url)),
    },
  },
  build: {
    cssCodeSplit: true,
    minify: 'esbuild',
    chunkSizeWarningLimit: 500,
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React - loaded on every page
          'react-vendor': ['react', 'react-dom'],
          // Router - loaded on every page but separate chunk
          router: ['react-router-dom'],
          // Head management - loaded on every page
          head: ['@unhead/react'],
          // Syntax highlighting - only needed for post pages
          shiki: ['shiki', '@shikijs/rehype'],
        },
      },
    },
  },
  plugins: [
    react(),
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [
        [
          rehypeShiki,
          {
            themes: {
              light: 'github-light',
              dark: 'github-dark',
            },
            transformers: [
              {
                name: 'add-file-title',
                pre(node) {
                  const meta = this.options.meta?.__raw || '';
                  const titleMatch = meta.match(/title="([^"]+)"/);
                  if (titleMatch) {
                    node.properties['data-file'] = titleMatch[1];
                  }
                },
              },
            ],
          },
        ],
      ],
    }),
    VitePWA({
      registerType: 'prompt',
      includeAssets: [
        'favicon.svg',
        'favicon.png',
        'logo.png',
        'icon-192.png',
        'icon-512.png',
      ],
      manifest: {
        name: 'React Native Land',
        short_name: 'React Native Land',
        description: 'A blog about React Native development.',
        theme_color: '#121212',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/logo.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,json,xml}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.bunny\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/static\.cloudflareinsights\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'cloudflare-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
            },
          },
        ],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
      },
      devOptions: {
        enabled: true, // Enable PWA in dev mode for testing
        type: 'module',
      },
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
