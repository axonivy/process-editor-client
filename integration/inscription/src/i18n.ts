import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../../../packages/editor/src/translation/process-editor/en.json';
import enCommonTranslation from '../../../packages/editor/src/translation/common/en.json';
import deTranslation from '../../../packages/editor/src/translation/process-editor/de.json';
import deCommonTranslation from '../../../packages/editor/src/translation/common/de.json';
import LanguageDetector from 'i18next-browser-languagedetector';

export const initTranslation = () => {
  if (i18n.isInitializing || i18n.isInitialized) return;
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      debug: true,
      supportedLngs: ['en', 'de'],
      fallbackLng: 'en',
      ns: ['process-editor'],
      defaultNS: 'process-editor',
      resources: {
        en: { 'process-editor': enTranslation, common: enCommonTranslation },
        de: { 'process-editor': deTranslation, common: deCommonTranslation }
      },
      detection: {
        order: ['querystring']
      }
    });
};
