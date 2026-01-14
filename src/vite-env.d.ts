/// <reference types="vite/client" />

declare module '*.css';
declare module '*.mdx' {
  import { ComponentType } from 'react';
  const component: ComponentType;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_SITE_EMAIL?: string;
  readonly VITE_GITHUB_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
