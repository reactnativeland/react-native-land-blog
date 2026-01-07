import { useHead } from '@unhead/react';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  useHead({
    title: 'React Native Land Blog',
    meta: [
      { name: 'description', content: 'A blog about React Native development' },
    ],
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="max-w-4xl mx-auto px-6 w-full flex-grow flex flex-col">
        <header className="border-b border-gray-200 py-4">
          <Link
            to="/"
            className="text-3xl font-semibold text-gray-900 hover:text-gray-700 flex items-center gap-3"
          >
            <img
              src="/logo.jpg"
              alt="React Native Land"
              className="w-12 h-12 rounded-full"
            />
            React Native Land Blog
          </Link>
        </header>
        <main className="py-12 flex-grow">{children}</main>
        <footer className="border-t border-gray-200 py-8 text-sm text-gray-500">
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-600">
              Building better mobile apps, one article at a time.
            </p>
            <div className="flex gap-6">
              <a
                href="https://github.com/reactnativeland"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors"
              >
                GitHub
              </a>
            </div>
            <p className="text-xs">
              © {new Date().getFullYear()} React Native Land. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Layout;
