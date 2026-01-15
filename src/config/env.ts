/**
 * Environment configuration
 * All URLs and site-specific values should be defined here
 */

export const config = {
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://reactnative.land',
  siteEmail: import.meta.env.VITE_SITE_EMAIL || 'rick@reactnative.land',
  githubUrl:
    import.meta.env.VITE_GITHUB_URL || 'https://github.com/reactnativeland',
  siteName: 'React Native Land',
} as const;
