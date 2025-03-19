import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { enTranslation, enCommonTranslation } from '@axonivy/process-editor-inscription-view';
import LanguageDetector from 'i18next-browser-languagedetector';

export const initTranslation = () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      debug: true,
      supportedLngs: ['en'],
      fallbackLng: 'en',
      ns: ['inscription-view'],
      defaultNS: 'inscription-view',
      resources: {
        en: { 'inscription-view': enTranslation, common: enCommonTranslation }
      }
    });
};
