import { useHead } from '@unhead/react';
import { ComponentType, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface PostData {
  title: string;
  date: string;
  fileName: string;
}

const postsMetadata: Record<string, Record<string, PostData>> = {
  en: {
    'a-blog': {
      title: 'A blog',
      date: '2026-01-06',
      fileName: '01-a-blog',
    },
  },
  'pt-BR': {
    'a-blog': {
      title: 'Um blog',
      date: '2026-01-06',
      fileName: '01-a-blog',
    },
  },
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
    return <div>Post not found</div>;
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
      <time className="text-sm text-gray-500 block mb-8">{post.date}</time>
      <div className="prose max-w-none text-gray-600">
        <Suspense fallback={<div>Loading...</div>}>
          <PostContent />
        </Suspense>
      </div>
    </article>
  );
}

export default Post;
