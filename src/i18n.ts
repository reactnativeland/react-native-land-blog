import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import ptBrTranslations from './locales/pt-br.json';
import { DEFAULT_LANGUAGE } from './utils/language';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      'pt-BR': {
        translation: ptBrTranslations,
      },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: ['en', 'pt-BR'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator'],
      caches: [],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
