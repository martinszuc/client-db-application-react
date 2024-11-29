// src/i18n/config.ts
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import sk from './locales/sk.json';

i18n
    .use(LanguageDetector) // Detect language from browser settings
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        resources: {
            en: { translation: en },
            sk: { translation: sk },
        },
        lng: 'sk', // Set Slovak as the default language
        fallbackLng: 'sk',
        debug: false, // Set to true for debugging

        interpolation: {
            escapeValue: false, // React already protects from XSS
        },
        detection: {
            order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage', 'cookie'],
        },
    });

export default i18n;
