import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {t('notFound.title')}
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        {t('notFound.message')}
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        {t('notFound.backButton')}
      </Link>
    </div>
  );
}

export default NotFound;
