import { useHead } from '@unhead/react';
import { ComponentType, lazy, Suspense } from 'react';
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

const loadPost = (fileName: string, lang: string): ComponentType => {
  const langSuffix = lang === 'pt-BR' ? 'pt-br' : 'en';
  return lazy(() => import(`../posts/${fileName}.${langSuffix}.mdx`));
};

function Post() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const currentLangPosts = postsMetadata[i18n.language] || postsMetadata.en;
  const post = slug ? currentLangPosts[slug] : undefined;

  if (!post || !slug) {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('post.notFound.title')}
        </h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          {t('post.notFound.message')}
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          {t('post.notFound.backButton')}
        </Link>
      </div>
    );
  }

  const PostContent = loadPost(post.fileName, i18n.language);

  useHead({
    title: `${post.title} - ${t('site.title')}`,
    meta: [{ name: 'description', content: `Read about ${post.title}` }],
  });

  return (
    <article>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        {post.title}
      </h1>
      <time className="text-sm text-gray-500 block mb-8">
        {formatDate(post.date, i18n.language)}
      </time>
      <div className="prose max-w-none text-gray-600">
        <Suspense fallback={<div>Loading...</div>}>
          <PostContent />
        </Suspense>
      </div>
    </article>
  );
}

export default Post;
