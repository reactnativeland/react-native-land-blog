import { useHead } from '@unhead/react';
import { ComponentType, lazy, Suspense, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import postsEn from '../locales/posts/en.json';
import postsPtBr from '../locales/posts/pt-br.json';
import { formatDate } from '../utils/formatDate';

interface PostData {
  title: string;
  date: string;
  fileName: string;
}

const createPostsMap = (posts: typeof postsEn): Record<string, PostData> => {
  return posts.reduce((acc, post) => {
    acc[post.slug] = {
      title: post.title,
      date: post.date,
      fileName: post.fileName,
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

  const currentLangPosts = useMemo(
    () => postsMetadata[i18n.language] || postsMetadata.en,
    [i18n.language]
  );

  const post = useMemo(
    () => (slug ? currentLangPosts[slug] : undefined),
    [slug, currentLangPosts]
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

  useHead(
    useMemo(
      () => ({
        title: `${post.title} - ${t('site.title')}`,
        meta: [{ name: 'description', content: `Read about ${post.title}` }],
      }),
      [post.title, t]
    )
  );

  return (
    <article>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {post.title}
      </h1>
      <time className="text-sm text-gray-500 dark:text-gray-400 block mb-8">
        {formatDate(post.date, i18n.language)}
      </time>
      <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
        <Suspense fallback={<div>{t('loading')}</div>}>
          <PostContent />
        </Suspense>
      </div>
    </article>
  );
}

export default Post;
