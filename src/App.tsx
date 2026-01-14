import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ErrorBoundary, Layout } from '@components';
import { ThemeProvider } from '@context';
import { I18nProvider, useTranslation } from '@i18n';

const Home = lazy(() => import('./pages/Home'));
const Post = lazy(() => import('./pages/Post'));
const NotFound = lazy(() => import('./pages/NotFound'));

function AppContent() {
  const { t } = useTranslation();

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Layout>
          <Suspense
            fallback={<div className="animate-pulse">{t('loading')}</div>}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts/:slug" element={<Post />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

export default App;
