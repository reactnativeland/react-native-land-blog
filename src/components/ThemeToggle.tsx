import React, { useTransition } from 'react';
import { Theme, useTheme } from '../context/ThemeContext';
import { LaptopIcon } from './icons/LaptopIcon';
import { MoonIcon } from './icons/MoonIcon';
import { SunIcon } from './icons/SunIcon';

const themeIcons: Record<
  Theme,
  { Icon: React.FC<{ className?: string }>; label: string }
> = {
  light: { Icon: SunIcon, label: 'Light' },
  dark: { Icon: MoonIcon, label: 'Dark' },
  system: { Icon: LaptopIcon, label: 'Auto' },
};

const themeOrder: Theme[] = ['system', 'light', 'dark'];

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isPending, startTransition] = useTransition();

  const cycleTheme = () => {
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    startTransition(() => {
      setTheme(themeOrder[nextIndex]);
    });
  };

  const { Icon, label } = themeIcons[theme];

  return (
    <button
      onClick={cycleTheme}
      disabled={isPending}
      className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] sm:min-w-[100px]"
      aria-label={`Current theme: ${label}. Click to change.`}
      title={`Theme: ${label} (${resolvedTheme} active)`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default ThemeToggle;
