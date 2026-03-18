import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import vi from './locales/vi.json';
import zh from './locales/zh.json';

export const languages = [
    { code: 'en', label: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'vi', label: 'VI', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'zh', label: '中文', name: '简体中文', flag: '🇨🇳' },
] as const;

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            vi: { translation: vi },
            zh: { translation: zh },
        },
        fallbackLng: 'en',
        supportedLngs: ['en', 'vi', 'zh'],
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
            lookupLocalStorage: 'dapp-lang',
        },
    });

export default i18n;
