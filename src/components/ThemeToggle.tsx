import { Theme, useTheme } from '../context/ThemeContext';

const themeIcons: Record<Theme, { icon: string; label: string }> = {
  light: { icon: '', label: 'Light' },
  dark: { icon: '', label: 'Dark' },
  system: { icon: '', label: 'Auto' },
};

const themeOrder: Theme[] = ['system', 'light', 'dark'];

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const { label } = themeIcons[theme];

  return (
    <button
      onClick={cycleTheme}
      className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-1.5"
      aria-label={`Current theme: ${label}. Click to change.`}
      title={`Theme: ${label} (${resolvedTheme} active)`}
    >
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default ThemeToggle;
