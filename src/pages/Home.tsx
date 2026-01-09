import { useHead } from '@unhead/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import postsEn from '../locales/posts/en.json';
import postsPtBr from '../locales/posts/pt-br.json';

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

function Home() {
  const { t, i18n } = useTranslation();
  const posts = postsData[i18n.language] || postsData.en;

  useHead({
    title: t('home.title'),
  });

  return (
    <div>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="border-b border-gray-200 pb-8">
            <Link to={`/posts/${post.slug}`} className="block group">
              <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-gray-700 mb-2">
                {post.title}
              </h2>
              <time className="text-sm text-gray-500 block mb-8">
                {post.date}
              </time>
              <p className="text-gray-600">{post.excerpt}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Home;
