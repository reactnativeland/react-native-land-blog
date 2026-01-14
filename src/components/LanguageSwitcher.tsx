import { useTransition } from 'react';
import { useTranslation } from '@i18n';
import { getAlternateLanguage, normalizeLanguage, toDisplayLabel } from '@utils';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const currentLang = normalizeLanguage(i18n.language);
    const newLang = getAlternateLanguage(currentLang);
    startTransition(() => {
      i18n.changeLanguage(newLang);
    });
  };

  const currentLang = normalizeLanguage(i18n.language);
  const currentLangLabel = toDisplayLabel(currentLang);

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      className="px-3 py-1.5 h-8 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed min-w-[60px]"
      aria-label="Switch language"
    >
      {isPending ? '...' : currentLangLabel}
    </button>
  );
}

export default LanguageSwitcher;
