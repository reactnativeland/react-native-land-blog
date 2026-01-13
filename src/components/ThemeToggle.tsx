import React, { useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme, useTheme } from '@context';
import { LaptopIcon } from './icons/LaptopIcon';
import { MoonIcon } from './icons/MoonIcon';
import { SunIcon } from './icons/SunIcon';

const themeIcons: Record<Theme, { Icon: React.FC<{ className?: string }> }> = {
  light: { Icon: SunIcon },
  dark: { Icon: MoonIcon },
  system: { Icon: LaptopIcon },
};

const themeOrder: Theme[] = ['system', 'light', 'dark'];

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const cycleTheme = () => {
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    startTransition(() => {
      setTheme(themeOrder[nextIndex]);
    });
  };

  const { Icon } = themeIcons[theme];
  const label = t(`theme.${theme}`);
  const resolvedThemeLabel = t(`theme.${resolvedTheme}`);

  return (
    <button
      onClick={cycleTheme}
      disabled={isPending}
      className="px-2 py-1.5 h-8 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed min-w-[60px] sm:min-w-[80px]"
      aria-label={t('theme.ariaLabel', { theme: label })}
      title={t('theme.title', { theme: label, resolvedTheme: resolvedThemeLabel })}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default ThemeToggle;
