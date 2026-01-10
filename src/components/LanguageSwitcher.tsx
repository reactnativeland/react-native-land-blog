import { useTransition } from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'pt-BR' : 'en';
    startTransition(() => {
      i18n.changeLanguage(newLang);
    });
  };

  const currentLangLabel = i18n.language === 'en' ? 'EN' : 'PT';

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Switch language"
    >
      {isPending ? '...' : currentLangLabel}
    </button>
  );
}

export default LanguageSwitcher;
