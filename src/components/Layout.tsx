import { useHead } from '@unhead/react';
import { ReactNode, useEffect, useMemo } from 'react';
import { useTranslation } from '@i18n';
import { Link, useLocation } from 'react-router-dom';
import { getLanguageUtils } from '@utils';
import { config } from '@config/env';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { InstallPrompt } from './InstallPrompt';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const langUtils = useMemo(
    () => getLanguageUtils(i18n.language),
    [i18n.language]
  );

  // Build current URL
  const currentUrl = `${config.siteUrl}${location.pathname}`;

  // Build alternate URL (for hreflang)
  const alternateUrl = currentUrl; // Same URL, different language

  // Check if we're on a post page
  const isPostPage = location.pathname.startsWith('/posts/');

  // Set HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = langUtils.htmlLang;
  }, [langUtils.htmlLang]);

  // Generate structured data
  const structuredData = useMemo(() => {
    const baseStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'React Native Land',
      url: config.siteUrl,
      logo: `${config.siteUrl}/logo.jpg`,
      sameAs: ['https://github.com/reactnativeland'],
      description: t('site.description'),
    };

    const websiteStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: t('site.title'),
      url: config.siteUrl,
      description: t('site.description'),
      publisher: {
        '@type': 'Organization',
        name: 'React Native Land',
        logo: {
          '@type': 'ImageObject',
          url: `${config.siteUrl}/logo.jpg`,
        },
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${config.siteUrl}/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };

    return [baseStructuredData, websiteStructuredData];
  }, [t]);

  useHead(
    useMemo(() => {
      if (isPostPage) {
        return { title: null };
      }

      const metaTags = [
        { name: 'description', content: t('site.description') },
        {
          name: 'robots',
          content:
            'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: currentUrl },
        { property: 'og:title', content: t('site.title') },
        { property: 'og:description', content: t('site.description') },
        { property: 'og:image', content: `${config.siteUrl}/logo.jpg` },
        { property: 'og:site_name', content: t('site.title') },
        { property: 'og:locale', content: langUtils.ogLocale },
        {
          property: 'og:locale:alternate',
          content: langUtils.alternateOgLocale,
        },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: currentUrl },
        { name: 'twitter:title', content: t('site.title') },
        { name: 'twitter:description', content: t('site.description') },
        { name: 'twitter:image', content: `${config.siteUrl}/logo.jpg` },
      ];

      const linkTags = [
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: 'RSS Feed',
          href: '/rss.xml',
        },
        {
          rel: 'canonical',
          href: currentUrl,
        },
        {
          rel: 'alternate',
          hreflang: langUtils.htmlLang,
          href: currentUrl,
        },
        {
          rel: 'alternate',
          hreflang: langUtils.alternateHtmlLang,
          href: alternateUrl,
        },
        {
          rel: 'alternate',
          hreflang: 'x-default',
          href: `${config.siteUrl}${location.pathname}`,
        },
      ];

      return {
        title: t('site.title'),
        meta: metaTags,
        link: linkTags,
        script: structuredData.map((data, index) => ({
          type: 'application/ld+json',
          children: JSON.stringify(data),
          key: `structured-data-${index}`,
        })),
      };
    }, [
      t,
      currentUrl,
      langUtils,
      alternateUrl,
      structuredData,
      location.pathname,
      isPostPage,
    ])
  );

  return (
    <div className="min-h-screen min-w-[240px] bg-white dark:bg-gray-900 flex flex-col transition-colors">
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:dark:bg-gray-900/70 py-4 w-full">
        <div className="max-w-4xl mx-auto px-6 w-full flex items-center justify-between">
          <Link
            to="/"
            className="text-4xl font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 mr-6"
          >
            {t('header.title')}
          </Link>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="order-1 sm:order-2">
              <LanguageSwitcher />
            </div>
            <div className="order-2 sm:order-1">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-6 w-full flex-grow flex flex-col">
        <main className="py-12 flex-grow flex flex-col min-h-[60vh]">
          {children}
        </main>
      </div>
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8 text-sm text-gray-500 dark:text-gray-400 w-full">
        <div className="max-w-4xl mx-auto px-6 w-full">
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-center">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-6 justify-center">
              <a
                href={config.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {t('footer.github')}
              </a>
              <a
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {t('footer.rss')}
              </a>
            </div>
            <div className="flex flex-col min-[321px]:flex-row items-center justify-center gap-1 text-center">
              <span>{t('footer.email')}</span>
              <a
                href={`mailto:${config.siteEmail}`}
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-medium"
              >
                {config.siteEmail}
              </a>
            </div>
            <p className="text-xs text-center">
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </footer>
      <InstallPrompt />
    </div>
  );
}

export default Layout;
