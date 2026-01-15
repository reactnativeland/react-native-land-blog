import { loadEnv } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');
const SITE_URL = process.env.VITE_SITE_URL || env.VITE_SITE_URL;

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

const DEFAULT_LANGUAGE = 'en';

/**
 * Finds the default language URL from hreflang array
 * Returns the English URL if available, otherwise the first URL or fallback
 */
const findDefaultLanguageUrl = (hreflang, fallback) => {
  return hreflang.find((h) => h.lang === DEFAULT_LANGUAGE)?.href || fallback;
};

// Read post metadata
const postsEn = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/locales/posts/en.json'), 'utf-8')
);
const postsPtBr = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../src/locales/posts/pt-br.json'),
    'utf-8'
  )
);

// Generate sitemap entries
const urls = [];

// Homepage with hreflang
urls.push({
  loc: SITE_URL,
  changefreq: 'daily',
  priority: '1.0',
  lastmod: new Date().toISOString().split('T')[0],
  hreflang: [
    { lang: 'en', href: SITE_URL },
    { lang: 'pt-BR', href: SITE_URL },
  ],
});

// Create a map of all posts by slug
const allPosts = new Map();

// Add English posts
postsEn.forEach((post) => {
  allPosts.set(post.slug, {
    slug: post.slug,
    date: post.date,
    hasEn: true,
    hasPtBr: false,
  });
});

// Add Portuguese posts and mark existing ones
postsPtBr.forEach((post) => {
  if (allPosts.has(post.slug)) {
    allPosts.get(post.slug).hasPtBr = true;
  } else {
    allPosts.set(post.slug, {
      slug: post.slug,
      date: post.date,
      hasEn: false,
      hasPtBr: true,
    });
  }
});

// Generate URL entries for all posts
allPosts.forEach((post) => {
  const postUrl = `${SITE_URL}/posts/${post.slug}`;
  const hreflang = [];

  if (post.hasEn) {
    hreflang.push({ lang: 'en', href: postUrl });
  }
  if (post.hasPtBr) {
    hreflang.push({ lang: 'pt-BR', href: postUrl });
  }

  urls.push({
    loc: postUrl,
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: post.date || new Date().toISOString().split('T')[0],
    hreflang: hreflang.length > 0 ? hreflang : undefined,
  });
});

// Generate XML sitemap
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
    .map((url) => {
      let urlXml = `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>`;

      if (url.hreflang) {
        url.hreflang.forEach((hreflang) => {
          urlXml += `\n    <xhtml:link rel="alternate" hreflang="${hreflang.lang}" href="${hreflang.href}" />`;
        });
        // Add x-default
        urlXml += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${findDefaultLanguageUrl(url.hreflang, url.loc)}" />`;
      }

      urlXml += `\n  </url>`;
      return urlXml;
    })
    .join('\n')}
</urlset>`;

// Ensure public directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write sitemap
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('✅ Sitemap generated at public/sitemap.xml');
