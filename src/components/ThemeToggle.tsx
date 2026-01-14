import { ThemePreference, useTheme } from '@context';
import { useTranslation } from '@i18n';
import { LaptopIcon, MoonIcon, SunIcon } from '@icons';
import { useTransition } from 'react';

const themes: ThemePreference[] = ['light', 'dark', 'system'];

function ThemeToggle() {
  const { preference, setTheme } = useTheme();
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const cycleTheme = () => {
    startTransition(() => {
      const currentIndex = themes.indexOf(preference);
      const nextIndex = (currentIndex + 1) % themes.length;
      setTheme(themes[nextIndex]);
    });
  };

  const label = t(`theme.${preference}`);
  const Icon =
    preference === 'light'
      ? SunIcon
      : preference === 'dark'
        ? MoonIcon
        : LaptopIcon;

  return (
    <button
      onClick={cycleTheme}
      disabled={isPending}
      className="px-3 py-1.5 h-8 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed min-w-[60px]"
      aria-label={t('theme.ariaLabel', { theme: label })}
      title={label}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default ThemeToggle;
