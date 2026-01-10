import { useHead } from '@unhead/react';
import { ReactNode, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

const SITE_URL = 'https://reactnative.land';

function Layout({ children }: LayoutProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  // Get current language code for HTML lang attribute
  const htmlLang = i18n.language === 'pt-BR' ? 'pt-BR' : 'en';
  
  // Get alternate language code
  const alternateLang = i18n.language === 'pt-BR' ? 'en' : 'pt-BR';
  const alternateLangCode = alternateLang === 'pt-BR' ? 'pt-BR' : 'en';

  // Build current URL
  const currentUrl = `${SITE_URL}${location.pathname}`;
  
  // Build alternate URL (for hreflang)
  const alternateUrl = currentUrl; // Same URL, different language

  // Set HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = htmlLang;
  }, [htmlLang]);

  // Generate structured data
  const structuredData = useMemo(() => {
    const baseStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'React Native Land',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.jpg`,
      sameAs: ['https://github.com/reactnativeland'],
      description: t('site.description'),
    };

    const websiteStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: t('site.title'),
      url: SITE_URL,
      description: t('site.description'),
      publisher: {
        '@type': 'Organization',
        name: 'React Native Land',
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.jpg`,
        },
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };

    return [baseStructuredData, websiteStructuredData];
  }, [t]);

  useHead(
    useMemo(
      () => {
        const metaTags = [
          { name: 'description', content: t('site.description') },
          { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
          // Open Graph
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: currentUrl },
          { property: 'og:title', content: t('site.title') },
          { property: 'og:description', content: t('site.description') },
          { property: 'og:image', content: `${SITE_URL}/logo.jpg` },
          { property: 'og:site_name', content: t('site.title') },
          { property: 'og:locale', content: htmlLang === 'pt-BR' ? 'pt_BR' : 'en_US' },
          { property: 'og:locale:alternate', content: htmlLang === 'pt-BR' ? 'en_US' : 'pt_BR' },
          // Twitter Card
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:url', content: currentUrl },
          { name: 'twitter:title', content: t('site.title') },
          { name: 'twitter:description', content: t('site.description') },
          { name: 'twitter:image', content: `${SITE_URL}/logo.jpg` },
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
            hreflang: htmlLang,
            href: currentUrl,
          },
          {
            rel: 'alternate',
            hreflang: alternateLangCode,
            href: alternateUrl,
          },
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: `${SITE_URL}${location.pathname}`,
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
      },
      [t, currentUrl, htmlLang, alternateLangCode, alternateUrl, structuredData, location.pathname]
    )
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors">
      <div className="max-w-4xl mx-auto px-6 w-full flex-grow flex flex-col">
        <header className="border-b border-gray-200 dark:border-gray-700 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-4xl font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 mr-6"
          >
            {t('header.title')}
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </header>
        <main className="py-12 flex-grow flex flex-col">{children}</main>
        <footer className="border-t border-gray-200 dark:border-gray-700 py-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-6">
              <a
                href="https://github.com/reactnativeland"
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
            <p className="text-xs">
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Layout;
