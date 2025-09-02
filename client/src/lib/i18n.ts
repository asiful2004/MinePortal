import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import JSON files using ES modules
import enTranslations from '../locales/en/common.json';
import bnTranslations from '../locales/bn/common.json';
import hiTranslations from '../locales/hi/common.json';
import esTranslations from '../locales/es/common.json';
import frTranslations from '../locales/fr/common.json';
import ruTranslations from '../locales/ru/common.json';
import trTranslations from '../locales/tr/common.json';

// Language resources
const resources = {
  en: {
    common: enTranslations
  },
  bn: {
    common: bnTranslations
  },
  hi: {
    common: hiTranslations
  },
  es: {
    common: esTranslations
  },
  fr: {
    common: frTranslations
  },
  ru: {
    common: ruTranslations
  },
  tr: {
    common: trTranslations
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: (typeof window !== 'undefined' && localStorage.getItem('language')) || 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
