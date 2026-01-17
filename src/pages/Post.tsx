/* eslint-disable react-hooks/static-components */
import { useHead } from '@unhead/react';
import {
  ComponentType,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from '@i18n';
import { Link, useParams } from 'react-router-dom';
import {
  formatDate,
  DEFAULT_LANGUAGE,
  getLanguageUtils,
  normalizeLanguage,
  toFileSuffix,
} from '@utils';
import { config } from '@config/env';
import './Post.css';

interface PostData {
  title: string;
  date: string;
  fileName: string;
  excerpt?: string;
}

// Lazy load post metadata - only load the current language
const loadPostsMetadata = async (
  lang: string
): Promise<Record<string, PostData>> => {
  const normalizedLang = lang === 'pt-BR' ? 'pt-BR' : 'en';
  let posts;
  if (normalizedLang === 'pt-BR') {
    const { postsPtBr } = await import('@locales/posts');
    posts = postsPtBr;
  } else {
    const { postsEn } = await import('@locales/posts');
    posts = postsEn;
  }

  return posts.reduce(
    (acc, post) => {
      acc[post.slug] = {
        title: post.title,
        date: post.date,
        fileName: post.fileName,
        excerpt: post.excerpt,
      };
      return acc;
    },
    {} as Record<string, PostData>
  );
};

const postComponentCache = new Map<string, ComponentType>();

const loadPost = (fileName: string, lang: string): ComponentType => {
  const normalizedLang = normalizeLanguage(lang);
  const langSuffix = toFileSuffix(normalizedLang);
  const cacheKey = `${fileName}.${langSuffix}`;

  if (!postComponentCache.has(cacheKey)) {
    postComponentCache.set(
      cacheKey,
      lazy(() => import(`../posts/${fileName}.${langSuffix}.mdx`))
    );
  }

  return postComponentCache.get(cacheKey)!;
};

function Post() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const [currentLangPosts, setCurrentLangPosts] = useState<
    Record<string, PostData>
  >({});
  const [alternateLangPosts, setAlternateLangPosts] = useState<
    Record<string, PostData>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  const langUtils = useMemo(
    () => getLanguageUtils(i18n.language),
    [i18n.language]
  );

  useEffect(() => {
    let cancelled = false;
    const currentLang = i18n.language || DEFAULT_LANGUAGE;
    const alternateLang = langUtils.alternate;

    Promise.all([
      loadPostsMetadata(currentLang),
      loadPostsMetadata(alternateLang),
    ]).then(([current, alternate]) => {
      if (!cancelled) {
        setCurrentLangPosts(current);
        setAlternateLangPosts(alternate);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [i18n.language, langUtils.alternate]);

  const post = useMemo(
    () => (slug ? currentLangPosts[slug] : undefined),
    [slug, currentLangPosts]
  );

  const alternatePost = useMemo(
    () => (slug ? alternateLangPosts[slug] : undefined),
    [slug, alternateLangPosts]
  );

  // Build URLs (safe even if post is undefined)
  const postUrl = slug ? `${config.siteUrl}/posts/${slug}` : '';

  // Create rich description (safe even if post is undefined)
  const metaDescription = useMemo(
    () =>
      post?.excerpt
        ? `${post.excerpt} | React Native development blog`
        : post
          ? `Read about ${post.title} on React Native Land. Learn React Native, mobile app development, and best practices.`
          : '',
    [post]
  );

  // Format date for structured data (ISO 8601)
  const publishedDate = useMemo(
    () => (post?.date ? new Date(post.date).toISOString() : ''),
    [post]
  );

  // Generate structured data for article (safe even if post is undefined)
  const articleStructuredData = useMemo(() => {
    if (!post) return null;
    const baseArticle = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: metaDescription,
      image: `${config.siteUrl}/logo.jpg`,
      datePublished: publishedDate,
      dateModified: publishedDate,
      author: {
        '@type': 'Organization',
        name: 'React Native Land',
        url: config.siteUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'React Native Land',
        logo: {
          '@type': 'ImageObject',
          url: `${config.siteUrl}/logo.jpg`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': postUrl,
      },
      url: postUrl,
    };

    return baseArticle;
  }, [post, metaDescription, publishedDate, postUrl]);

  // useHead hook - must be called before any conditional returns
  useHead(
    useMemo(() => {
      if (!post) {
        return { title: t('site.title') };
      }

      const metaTags = [
        { name: 'description', content: metaDescription },
        {
          name: 'robots',
          content:
            'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        },
        // Open Graph
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: postUrl },
        { property: 'og:title', content: `${post.title} - ${config.siteName}` },
        { property: 'og:description', content: metaDescription },
        { property: 'og:image', content: `${config.siteUrl}/logo.jpg` },
        { property: 'og:site_name', content: config.siteName },
        { property: 'og:locale', content: langUtils.ogLocale },
        {
          property: 'og:locale:alternate',
          content: langUtils.alternateOgLocale,
        },
        // Article specific
        { property: 'article:published_time', content: publishedDate },
        { property: 'article:modified_time', content: publishedDate },
        { property: 'article:author', content: 'React Native Land' },
        { property: 'article:section', content: 'React Native' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: postUrl },
        {
          name: 'twitter:title',
          content: `${post.title} - ${config.siteName}`,
        },
        { name: 'twitter:description', content: metaDescription },
        { name: 'twitter:image', content: `${config.siteUrl}/logo.jpg` },
      ];

      const linkTags: Array<{
        rel: string;
        href: string;
        hreflang?: string;
      }> = [
        {
          rel: 'canonical',
          href: postUrl,
        },
        {
          rel: 'alternate',
          hreflang: langUtils.htmlLang,
          href: postUrl,
        },
      ];

      // Add alternate language link if available
      if (alternatePost) {
        linkTags.push({
          rel: 'alternate',
          hreflang: langUtils.alternateHtmlLang,
          href: postUrl, // Same URL, different language content
        });
      }

      linkTags.push({
        rel: 'alternate',
        hreflang: 'x-default',
        href: postUrl,
      });

      return {
        title: `${post.title} - ${config.siteName}`,
        meta: metaTags,
        link: linkTags,
        script: articleStructuredData
          ? [
              {
                type: 'application/ld+json',
                children: JSON.stringify(articleStructuredData),
              },
            ]
          : [],
      };
    }, [
      post,
      metaDescription,
      postUrl,
      langUtils,
      publishedDate,
      t,
      articleStructuredData,
      alternatePost,
    ])
  );

  // PostContent (safe even if post is undefined) - call loadPost directly since it's cached
  // loadPost uses internal caching, so this is safe despite the lint warning
  const PostContent = useMemo(
    () => (post?.fileName ? loadPost(post.fileName, i18n.language) : null),
    [post, i18n.language]
  );

  // Now we can do conditional returns after all hooks
  if (isLoading) {
    return null;
  }

  if (!post || !slug || !PostContent) {
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

  return (
    <article
      itemScope
      itemType="https://schema.org/BlogPosting"
      className="min-h-[50vh]"
    >
      <header>
        <h1
          itemProp="headline"
          className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
        >
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
