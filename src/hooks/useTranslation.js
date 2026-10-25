import { useAppData } from "../context/useAppData.js";
import { translations, t, getTranslation } from "../data/translations.js";

/**
 * Hook providing translation dictionary and helpers
 * bound to the active language in settings ('en' | 'hi').
 */
export function useTranslation() {
  const { appData } = useAppData();
  const lang = appData?.settings?.language === "hi" ? "hi" : "en";

  return {
    lang,
    t: (section, key) => t(lang, section, key),
    getTranslation: (dotPath, fallback) => getTranslation(lang, dotPath, fallback),
    dict: translations[lang] ?? translations.en,
  };
}
