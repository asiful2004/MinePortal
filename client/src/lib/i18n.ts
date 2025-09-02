import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Language resources
const resources = {
  en: {
    common: require('../../public/locales/en/common.json')
  },
  bn: {
    common: require('../../public/locales/bn/common.json')
  },
  hi: {
    common: require('../../public/locales/hi/common.json')
  },
  es: {
    common: require('../../public/locales/es/common.json')
  },
  fr: {
    common: require('../../public/locales/fr/common.json')
  },
  ru: {
    common: require('../../public/locales/ru/common.json')
  },
  tr: {
    common: require('../../public/locales/tr/common.json')
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
