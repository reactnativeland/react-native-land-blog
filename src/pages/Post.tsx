import { useHead } from '@unhead/react';
import { ComponentType } from 'react';
import { useParams } from 'react-router-dom';
import ABlog from '../posts/01-a-blog.mdx';

interface PostData {
  title: string;
  date: string;
  component: ComponentType;
}

const posts: Record<string, PostData> = {
  'a-blog': {
    title: 'A blog',
    date: '2026-01-06',
    component: ABlog,
  },
};

function Post() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? posts[slug] : undefined;

  if (!post) {
    return <div>Post not found</div>;
  }

  const PostContent = post.component;

  useHead({
    title: `${post.title} - React Native Land Blog`,
    meta: [{ name: 'description', content: `Read about ${post.title}` }],
  });

  return (
    <article>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        {post.title}
      </h1>
      <time className="text-sm text-gray-500 block mb-8">{post.date}</time>
      <div className="prose max-w-none text-gray-600">
        <PostContent />
      </div>
    </article>
  );
}

export default Post;
