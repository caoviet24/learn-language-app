import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import en from '../locales/en.json';
import vi from '../locales/vi.json';
import ja from '../locales/ja.json';

// Type for supported languages
type SupportedLanguage = 'en' | 'vi' | 'ja';

// Language resources
const resources = {
  en: { translation: en },
  vi: { translation: vi },
  ja: { translation: ja },
} as const;

// Get the device's preferred language
const getDeviceLanguage = (): SupportedLanguage => {
  try {
    const locales = getLocales();
    if (locales && locales.length > 0) {
      const deviceLocale = locales[0].languageCode; // e.g., 'en', 'vi', 'ja'
      
      // Check if the language is supported, otherwise default to 'vi'
      if (deviceLocale === 'en') return 'en';
      if (deviceLocale === 'ja') return 'ja';
    }
  } catch (error) {
    console.warn('Could not get device locale, using default');
  }
  return 'vi'; // Default to Vietnamese
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLanguage(), // Use device language as default
    fallbackLng: 'vi', // Fallback to Vietnamese if translation is missing
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
  });

export default i18n;
export { getDeviceLanguage, resources };
export type { SupportedLanguage };