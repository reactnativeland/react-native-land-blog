/**
 * Formats a date string in full format (e.g., "January 6, 2026" or "6 de janeiro de 2026")
 * @param dateString - Date string in YYYY-MM-DD format
 * @param locale - Locale code ('en' or 'pt-BR')
 * @returns Formatted date string
 */
export function formatDate(dateString: string, locale: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const localeMap: Record<string, string> = {
    en: 'en-US',
    'pt-BR': 'pt-BR',
  };

  const targetLocale = localeMap[locale] || 'en-US';

  return date.toLocaleDateString(targetLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a date string in short numeric format (e.g., "01/06/2026" for en-US or "06/01/2026" for pt-BR)
 * @param dateString - Date string in YYYY-MM-DD format
 * @param locale - Locale code ('en' or 'pt-BR')
 * @returns Formatted date string
 */
export function formatDateShort(dateString: string, locale: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const localeMap: Record<string, string> = {
    en: 'en-US',
    'pt-BR': 'pt-BR',
  };

  const targetLocale = localeMap[locale] || 'en-US';

  return date.toLocaleDateString(targetLocale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
