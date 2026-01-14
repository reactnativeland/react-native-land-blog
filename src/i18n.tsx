import { createContext, useContext, useState, ReactNode } from 'react';
import enTranslations from './locales/en.json';
import ptBrTranslations from './locales/pt-br.json';
import { DEFAULT_LANGUAGE, normalizeLanguage, type SupportedLanguage } from './utils/language';

type Translations = typeof enTranslations;

const translations: Record<SupportedLanguage, Translations> = {
  en: enTranslations,
  'pt-BR': ptBrTranslations,
};

// Detect language from browser
function detectLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const browserLang = navigator.language || (navigator as any).userLanguage;
  return normalizeLanguage(browserLang);
}

// Get nested value from object by dot notation path
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => current?.[key], obj) ?? path;
}

// Simple interpolation: replace {{key}} with values
function interpolate(str: string, vars: Record<string, string | number>): string {
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? ''));
}

interface I18nContextValue {
  language: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguage] = useState<SupportedLanguage>(detectLanguage);

  const changeLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
  };

  const t = (key: string, vars?: Record<string, string | number>): string => {
    const translation = getNestedValue(translations[language], key);
    return vars ? interpolate(translation, vars) : translation;
  };

  return (
    <I18nContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return { t: context.t, i18n: { language: context.language, changeLanguage: context.changeLanguage } };
}

// Export default for compatibility
const i18n = {
  language: detectLanguage(),
  changeLanguage: () => { },
  t: (key: string, vars?: Record<string, string | number>) => {
    const lang = detectLanguage();
    const translation = getNestedValue(translations[lang], key);
    return vars ? interpolate(translation, vars) : translation;
  },
};

export default i18n;
