import { useHead } from '@unhead/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import postsEn from '../locales/posts/en.json';
import postsPtBr from '../locales/posts/pt-br.json';
import { formatDateShort } from '../utils/formatDate';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

const postsData: Record<string, Post[]> = {
  en: postsEn,
  'pt-BR': postsPtBr,
};

const SITE_URL = 'https://reactnative.land';

function Home() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const posts = useMemo(
    () => postsData[i18n.language] || postsData.en,
    [i18n.language]
  );

  const htmlLang = i18n.language === 'pt-BR' ? 'pt-BR' : 'en';
  const alternateLang = i18n.language === 'pt-BR' ? 'en' : 'pt-BR';
  const alternateLangCode = alternateLang === 'pt-BR' ? 'pt-BR' : 'en';
  const currentUrl = `${SITE_URL}${location.pathname}`;

  // Enhanced description with keywords
  const metaDescription = t('site.description') + ' Learn React Native, mobile app development, cross-platform development, and best practices.';

  // Memoize head metadata
  useHead(
    useMemo(
      () => {
        const metaTags = [
          { name: 'description', content: metaDescription },
          { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
          // Open Graph
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: currentUrl },
          { property: 'og:title', content: t('home.title') },
          { property: 'og:description', content: metaDescription },
          { property: 'og:image', content: `${SITE_URL}/logo.jpg` },
          { property: 'og:site_name', content: t('site.title') },
          { property: 'og:locale', content: htmlLang === 'pt-BR' ? 'pt_BR' : 'en_US' },
          { property: 'og:locale:alternate', content: htmlLang === 'pt-BR' ? 'en_US' : 'pt_BR' },
          // Twitter Card
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:url', content: currentUrl },
          { name: 'twitter:title', content: t('home.title') },
          { name: 'twitter:description', content: metaDescription },
          { name: 'twitter:image', content: `${SITE_URL}/logo.jpg` },
        ];

        const linkTags = [
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
            href: currentUrl,
          },
          {
            rel: 'alternate',
            hreflang: 'x-default',
            href: currentUrl,
          },
        ];

        return {
          title: t('home.title'),
          meta: metaTags,
          link: linkTags,
        };
      },
      [t, metaDescription, currentUrl, htmlLang, alternateLangCode]
    )
  );

  return (
    <div>
      <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            itemScope
            itemType="https://schema.org/BlogPosting"
            className="border-b border-gray-200 dark:border-gray-700 pb-8"
          >
            <Link to={`/posts/${post.slug}`} className="block group">
              <h2 
                itemProp="headline"
                className="text-2xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 mb-2"
              >
                {post.title}
              </h2>
              <time 
                itemProp="datePublished"
                dateTime={new Date(post.date).toISOString()}
                className="text-sm text-gray-500 dark:text-gray-400 block mb-8"
              >
                {formatDateShort(post.date, i18n.language)}
              </time>
              <p 
                itemProp="description"
                className="text-gray-600 dark:text-gray-400"
              >
                {post.excerpt}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Home;
