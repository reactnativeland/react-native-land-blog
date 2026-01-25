# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Do not use emojis.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Generate RSS/sitemap + build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm format       # Format code with Prettier
pnpm format:check # Check formatting
pnpm analyze      # Build and open bundle analysis
```

## Architecture

React 19 blog with MDX content, Vite bundler, Tailwind CSS v4, and PWA support.

### Routing and Pages

- `src/App.tsx`: Main router with three routes: `/` (Home), `/posts/:slug` (Post), `*` (NotFound)
- Pages are lazy-loaded via React.lazy for code splitting

### Internationalization (i18n)

- Custom i18n implementation in `src/i18n.tsx` (no external library)
- Supported languages: `en` and `pt-BR`
- UI translations: `src/locales/en.json` and `src/locales/pt-br.json`
- Post metadata: `src/locales/posts/en.json` and `src/locales/posts/pt-br.json`
- Language utilities: `src/utils/language.ts` handles normalization and locale conversions

### Blog Posts

- MDX files in `src/posts/` with naming pattern: `{order}-{slug}.{lang}.mdx` (e.g., `01-a-blog.en.mdx`)
- Post metadata must be added to both `src/locales/posts/en.json` and `src/locales/posts/pt-br.json`
- Each post entry needs: `slug`, `title`, `date`, `excerpt`, `fileName`
- Posts are dynamically imported based on language: `import('../posts/${fileName}.${langSuffix}.mdx')`

### Path Aliases

Configured in both `vite.config.js` and `tsconfig.json`:

- `@/` -> `src/`
- `@utils` -> `src/utils`
- `@components` -> `src/components`
- `@context` -> `src/context`
- `@locales` -> `src/locales`
- `@i18n` -> `src/i18n`
- `@icons` -> `src/components/icons`
- `@config` -> `src/config`

### Build Scripts

- `scripts/generate-rss.js`: Generates RSS/Atom/JSON feeds during build
- `scripts/generate-sitemap.js`: Generates sitemap.xml during build

### Code Style

- Unused variables prefixed with `_` are allowed (ESLint config)
- Husky pre-commit hooks enabled
