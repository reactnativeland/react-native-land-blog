import { useTransition } from 'react';
import { useTranslation } from '@i18n';
import { useTheme } from '@context';
import { MoonIcon } from './icons/MoonIcon';
import { SunIcon } from './icons/SunIcon';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const toggleTheme = () => {
    startTransition(() => {
      setTheme(theme === 'light' ? 'dark' : 'light');
    });
  };

  const label = t(`theme.${theme}`);
  const Icon = theme === 'light' ? SunIcon : MoonIcon;

  return (
    <button
      onClick={toggleTheme}
      disabled={isPending}
      className="p-1.5 h-8 w-8 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={t('theme.ariaLabel', { theme: label })}
      title={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default ThemeToggle;
