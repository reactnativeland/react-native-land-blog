import { useHead } from '@unhead/react';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();

  useHead(
    useMemo(
      () => ({
        title: t('site.title'),
        meta: [{ name: 'description', content: t('site.description') }],
        link: [
          {
            rel: 'alternate',
            type: 'application/rss+xml',
            title: 'RSS Feed',
            href: '/rss.xml',
          },
        ],
      }),
      [t]
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
