import mdx from '@mdx-js/rollup';
import rehypeShiki from '@shikijs/rehype';
import react from '@vitejs/plugin-react';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          i18n: [
            'i18next',
            'react-i18next',
            'i18next-browser-languagedetector',
          ],
          head: ['@unhead/react'],
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
            theme: 'github-light',
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
  ],
});
