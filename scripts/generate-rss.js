import { loadEnv } from 'vite';
import { Feed } from 'feed';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');
const SITE_URL = process.env.VITE_SITE_URL || env.VITE_SITE_URL;
const SITE_EMAIL = process.env.VITE_SITE_EMAIL || env.VITE_SITE_EMAIL;

if (!SITE_URL) {
  console.error('VITE_SITE_URL environment variable is required');
  console.error(
    'Available env vars:',
    Object.keys(process.env)
      .filter((k) => k.includes('VITE') || k.includes('SITE'))
      .join(', ') || 'none'
  );
  console.error('process.env.VITE_SITE_URL:', process.env.VITE_SITE_URL);
  console.error('env.VITE_SITE_URL:', env.VITE_SITE_URL);
  process.exit(1);
}

if (!SITE_EMAIL) {
  console.error('VITE_SITE_EMAIL environment variable is required');
  console.error('process.env.VITE_SITE_EMAIL:', process.env.VITE_SITE_EMAIL);
  console.error('env.VITE_SITE_EMAIL:', env.VITE_SITE_EMAIL);
  process.exit(1);
}
const BLOG_TITLE = 'React Native Land';
const BLOG_DESCRIPTION = 'A blog about React Native development';
const AUTHOR = {
  name: 'React Native Land',
  email: SITE_EMAIL,
  link: SITE_URL,
};

// Initialize the feed
const feed = new Feed({
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  id: SITE_URL,
  link: SITE_URL,
  language: 'en',
  image: `${SITE_URL}/logo.jpg`,
  favicon: `${SITE_URL}/favicon.ico`,
  copyright: `© ${new Date().getFullYear()} React Native Land. All rights reserved.`,
  updated: new Date(),
  generator: 'Feed for Node.js',
  feedLinks: {
    rss2: `${SITE_URL}/rss.xml`,
    json: `${SITE_URL}/feed.json`,
    atom: `${SITE_URL}/atom.xml`,
  },
  author: AUTHOR,
});

// Read all MDX files from posts directory
const postsDirectory = path.join(__dirname, '../src/posts');
const postFiles = fs
  .readdirSync(postsDirectory)
  .filter((file) => file.endsWith('.mdx'));

// Parse frontmatter and add posts to feed
const posts = [];

postFiles.forEach((filename) => {
  const filePath = path.join(postsDirectory, filename);
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Extract frontmatter
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = fileContent.match(frontmatterRegex);

  if (match) {
    const frontmatter = {};
    const frontmatterContent = match[1];

    // Parse frontmatter fields
    frontmatterContent.split('\n').forEach((line) => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        frontmatter[key.trim()] = valueParts.join(':').trim();
      }
    });

    // Extract content after frontmatter
    const content = fileContent.replace(frontmatterRegex, '').trim();

    // Get slug from filename
    const slug = filename.replace(/^\d+-/, '').replace(/\.mdx$/, '');

    posts.push({
      title: frontmatter.title || 'Untitled',
      date: frontmatter.date ? new Date(frontmatter.date) : new Date(),
      excerpt:
        frontmatter.excerpt || content.substring(0, 200).replace(/\n/g, ' '),
      content: content,
      slug: slug,
    });
  }
});

// Sort posts by date (newest first)
posts.sort((a, b) => b.date - a.date);

// Add each post to the feed
posts.forEach((post) => {
  const postUrl = `${SITE_URL}/posts/${post.slug}`;

  feed.addItem({
    title: post.title,
    id: postUrl,
    link: postUrl,
    description: post.excerpt,
    content: post.content,
    author: [AUTHOR],
    date: post.date,
  });
});

// Ensure public directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate RSS 2.0 feed
fs.writeFileSync(path.join(publicDir, 'rss.xml'), feed.rss2());
console.log('✅ RSS feed generated at public/rss.xml');

// Generate Atom feed
fs.writeFileSync(path.join(publicDir, 'atom.xml'), feed.atom1());
console.log('✅ Atom feed generated at public/atom.xml');

// Generate JSON feed
fs.writeFileSync(path.join(publicDir, 'feed.json'), feed.json1());
console.log('✅ JSON feed generated at public/feed.json');
