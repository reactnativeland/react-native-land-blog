/**
 * Formats a date string according to the specified locale
 * @param dateString - Date string in YYYY-MM-DD format
 * @param locale - Locale code ('en' or 'pt-BR')
 * @returns Formatted date string
 */
export function formatDate(dateString: string, locale: string): string {
  // Parse date string as local date to avoid timezone issues
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
