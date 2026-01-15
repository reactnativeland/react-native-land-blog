import { useHead } from '@unhead/react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@i18n';
import { Link, useLocation } from 'react-router-dom';
import { formatDateShort, DEFAULT_LANGUAGE, getLanguageUtils } from '@utils';
import { config } from '@config/env';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

// Lazy load post metadata - only load the current language
const loadPostsData = async (lang: string): Promise<Post[]> => {
  const normalizedLang = lang === 'pt-BR' ? 'pt-BR' : 'en';
  if (normalizedLang === 'pt-BR') {
    const { postsPtBr } = await import('@locales/posts');
    return postsPtBr;
  }
  const { postsEn } = await import('@locales/posts');
  return postsEn;
};

function Home() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadPostsData(i18n.language || DEFAULT_LANGUAGE).then((loadedPosts) => {
      if (!cancelled) {
        setPosts(loadedPosts);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [i18n.language]);

  const langUtils = useMemo(
    () => getLanguageUtils(i18n.language),
    [i18n.language]
  );
  const currentUrl = `${config.siteUrl}${location.pathname}`;

  // Enhanced description with keywords
  const metaDescription =
    t('site.description') +
    ' Learn React Native, mobile app development, cross-platform development, and best practices.';

  // Memoize head metadata
  useHead(
    useMemo(() => {
      const metaTags = [
        { name: 'description', content: metaDescription },
        {
          name: 'robots',
          content:
            'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: currentUrl },
        { property: 'og:title', content: t('home.title') },
        { property: 'og:description', content: metaDescription },
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
        { name: 'twitter:title', content: t('home.title') },
        { name: 'twitter:description', content: metaDescription },
        { name: 'twitter:image', content: `${config.siteUrl}/logo.jpg` },
      ];

      const linkTags = [
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
    }, [t, metaDescription, currentUrl, langUtils])
  );

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-[50vh]">
      <div className="space-y-8">
        {posts.map((post, index) => (
          <article
            key={post.slug}
            itemScope
            itemType="https://schema.org/BlogPosting"
            className={`pb-8 ${
              posts.length > 1 && index < posts.length - 1
                ? 'border-b border-gray-200 dark:border-gray-700'
                : ''
            }`}
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
