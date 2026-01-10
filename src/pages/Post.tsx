import { useHead } from '@unhead/react';
import { ComponentType, lazy, Suspense, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import postsEn from '../locales/posts/en.json';
import postsPtBr from '../locales/posts/pt-br.json';
import { formatDate } from '../utils/formatDate';

interface PostData {
  title: string;
  date: string;
  fileName: string;
  excerpt?: string;
}

const SITE_URL = 'https://reactnative.land';

const createPostsMap = (posts: typeof postsEn): Record<string, PostData> => {
  return posts.reduce((acc, post) => {
    acc[post.slug] = {
      title: post.title,
      date: post.date,
      fileName: post.fileName,
      excerpt: post.excerpt,
    };
    return acc;
  }, {} as Record<string, PostData>);
};

const postsMetadata: Record<string, Record<string, PostData>> = {
  en: createPostsMap(postsEn),
  'pt-BR': createPostsMap(postsPtBr),
};

const postComponentCache = new Map<string, ComponentType>();

const loadPost = (fileName: string, lang: string): ComponentType => {
  const langSuffix = lang === 'pt-BR' ? 'pt-br' : 'en';
  const cacheKey = `${fileName}.${langSuffix}`;

  if (!postComponentCache.has(cacheKey)) {
    postComponentCache.set(cacheKey, lazy(() => import(`../posts/${fileName}.${langSuffix}.mdx`)));
  }

  return postComponentCache.get(cacheKey)!;
};

function Post() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const currentLangPosts = useMemo(
    () => postsMetadata[i18n.language] || postsMetadata.en,
    [i18n.language]
  );

  const alternateLangPosts = useMemo(
    () => postsMetadata[i18n.language === 'pt-BR' ? 'en' : 'pt-BR'],
    [i18n.language]
  );

  const post = useMemo(
    () => (slug ? currentLangPosts[slug] : undefined),
    [slug, currentLangPosts]
  );

  const alternatePost = useMemo(
    () => (slug ? alternateLangPosts[slug] : undefined),
    [slug, alternateLangPosts]
  );

  if (!post || !slug) {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t('post.notFound.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
          {t('post.notFound.message')}
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
        >
          {t('post.notFound.backButton')}
        </Link>
      </div>
    );
  }

  const PostContent = useMemo(
    () => loadPost(post.fileName, i18n.language),
    [post.fileName, i18n.language]
  );

  // Build URLs
  const postUrl = `${SITE_URL}/posts/${slug}`;
  const htmlLang = i18n.language === 'pt-BR' ? 'pt-BR' : 'en';
  const alternateLang = i18n.language === 'pt-BR' ? 'en' : 'pt-BR';
  const alternateLangCode = alternateLang === 'pt-BR' ? 'pt-BR' : 'en';

  // Create rich description
  const metaDescription = post.excerpt 
    ? `${post.excerpt} | React Native development blog`
    : `Read about ${post.title} on React Native Land Blog. Learn React Native, mobile app development, and best practices.`;

  // Format date for structured data (ISO 8601)
  const publishedDate = new Date(post.date).toISOString();

  // Generate structured data for article
  const articleStructuredData = useMemo(() => {
    const baseArticle = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: metaDescription,
      image: `${SITE_URL}/logo.jpg`,
      datePublished: publishedDate,
      dateModified: publishedDate,
      author: {
        '@type': 'Organization',
        name: 'React Native Land',
        url: SITE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: 'React Native Land',
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.jpg`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': postUrl,
      },
      url: postUrl,
    };

    return baseArticle;
  }, [post.title, metaDescription, publishedDate, postUrl]);

  useHead(
    useMemo(
      () => {
        const metaTags = [
          { name: 'description', content: metaDescription },
          { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
          // Open Graph
          { property: 'og:type', content: 'article' },
          { property: 'og:url', content: postUrl },
          { property: 'og:title', content: `${post.title} - ${t('site.title')}` },
          { property: 'og:description', content: metaDescription },
          { property: 'og:image', content: `${SITE_URL}/logo.jpg` },
          { property: 'og:site_name', content: t('site.title') },
          { property: 'og:locale', content: htmlLang === 'pt-BR' ? 'pt_BR' : 'en_US' },
          { property: 'og:locale:alternate', content: htmlLang === 'pt-BR' ? 'en_US' : 'pt_BR' },
          // Article specific
          { property: 'article:published_time', content: publishedDate },
          { property: 'article:modified_time', content: publishedDate },
          { property: 'article:author', content: 'React Native Land' },
          { property: 'article:section', content: 'React Native' },
          // Twitter Card
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:url', content: postUrl },
          { name: 'twitter:title', content: `${post.title} - ${t('site.title')}` },
          { name: 'twitter:description', content: metaDescription },
          { name: 'twitter:image', content: `${SITE_URL}/logo.jpg` },
        ];

        const linkTags = [
          {
            rel: 'canonical',
            href: postUrl,
          },
          {
            rel: 'alternate',
            hreflang: htmlLang,
            href: postUrl,
          },
        ];

        // Add alternate language link if available
        if (alternatePost) {
          linkTags.push({
            rel: 'alternate',
            hreflang: alternateLangCode,
            href: postUrl, // Same URL, different language content
          });
        }

        linkTags.push({
          rel: 'alternate',
          hreflang: 'x-default',
          href: postUrl,
        });

        return {
          title: `${post.title} - ${t('site.title')}`,
          meta: metaTags,
          link: linkTags,
          script: [
            {
              type: 'application/ld+json',
              children: JSON.stringify(articleStructuredData),
            },
          ],
        };
      },
      [post.title, metaDescription, postUrl, htmlLang, alternateLangCode, publishedDate, t, articleStructuredData, alternatePost]
    )
  );

  return (
    <article itemScope itemType="https://schema.org/BlogPosting">
      <header>
        <h1 itemProp="headline" className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {post.title}
        </h1>
        <time 
          itemProp="datePublished" 
          dateTime={publishedDate}
          className="text-sm text-gray-500 dark:text-gray-400 block mb-8"
        >
          {formatDate(post.date, i18n.language)}
        </time>
      </header>
      <div 
        itemProp="articleBody" 
        className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
      >
        <Suspense fallback={<div>{t('loading')}</div>}>
          <PostContent />
        </Suspense>
      </div>
    </article>
  );
}

export default Post;
