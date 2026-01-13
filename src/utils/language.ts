export type SupportedLanguage = 'en' | 'pt-BR';
export type LanguageCode = 'en' | 'pt-BR';

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'pt-BR'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

/**
 * Normalizes a language string to a supported language, defaulting to 'en'
 */
export function normalizeLanguage(lang: string | undefined | null): SupportedLanguage {
  if (!lang) return DEFAULT_LANGUAGE;
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)
    ? (lang as SupportedLanguage)
    : DEFAULT_LANGUAGE;
}

/**
 * Gets the alternate language (switches between en and pt-BR)
 */
export function getAlternateLanguage(lang: SupportedLanguage): SupportedLanguage {
  return lang === 'pt-BR' ? 'en' : 'pt-BR';
}

/**
 * Converts language to HTML lang attribute format
 * (pt-BR stays as pt-BR, en stays as en)
 */
export function toHtmlLang(lang: SupportedLanguage): LanguageCode {
  return lang;
}

/**
 * Converts language to Open Graph locale format
 * (pt-BR -> pt_BR, en -> en_US)
 */
export function toOgLocale(lang: SupportedLanguage): string {
  return lang === 'pt-BR' ? 'pt_BR' : 'en_US';
}

/**
 * Converts language to display label format
 * (pt-BR -> PT, en -> EN)
 */
export function toDisplayLabel(lang: SupportedLanguage): string {
  return lang === 'pt-BR' ? 'PT' : 'EN';
}

/**
 * Converts language to file suffix format
 * (pt-BR -> pt-br, en -> en)
 */
export function toFileSuffix(lang: SupportedLanguage): string {
  return lang === 'pt-BR' ? 'pt-br' : 'en';
}

/**
 * Gets language utilities for a given language string
 * Returns normalized language, alternate, and formatted codes
 */
export function getLanguageUtils(lang: string | undefined | null) {
  const current = normalizeLanguage(lang);
  const alternate = getAlternateLanguage(current);

  return {
    current,
    alternate,
    htmlLang: toHtmlLang(current),
    alternateHtmlLang: toHtmlLang(alternate),
    ogLocale: toOgLocale(current),
    alternateOgLocale: toOgLocale(alternate),
  };
}
