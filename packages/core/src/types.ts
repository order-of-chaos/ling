export const LocalStorageLangKey = "MA_lang";

/**
 * Default supported languages (ISO 639-1 codes).
 * Use this type for most applications, or define your own.
 */
export type DefaultLang =
  | "en"
  | "ru"
  | "pt"
  | "zh"
  | "ja"
  | "ko"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "ar"
  | "hi"
  | "pl"
  | "uk"
  | "tr"
  | "nl"
  | "sv"
  | "cs"
  | "da"
  | "fi"
  | "no"
  | "el"
  | "he"
  | "th"
  | "vi"
  | "id"
  | "ms"
  | "ro"
  | "hu"
  | "bg";

/**
 * @deprecated Use DefaultLang or define your own language type.
 * Kept for backward compatibility.
 */
export enum Lang {
  ru = "ru",
  en = "en",
  pt = "pt",
}

/**
 * Human-readable language names.
 * Add more as needed for your application.
 */
export const LangNames: Record<string, string> = {
  en: "English",
  ru: "Русский",
  pt: "Português",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  ar: "العربية",
  hi: "हिन्दी",
  pl: "Polski",
  uk: "Українська",
  tr: "Türkçe",
  nl: "Nederlands",
  sv: "Svenska",
};

/**
 * @deprecated Use LangNames instead.
 */
export const LangMap = LangNames;

export interface Translations {
  [namespace: string]: {
    [key: string]: string;
  };
}

/**
 * Storage interface for persisting language preference.
 * Implement this interface to provide custom storage (e.g., AsyncStorage, cookies, server-side).
 *
 * @typeParam L - Language type (defaults to string for flexibility)
 */
export interface I18nStorage<L extends string = string> {
  /**
   * Get current language from storage
   * @returns Current language or null if not set
   */
  getLanguage(): L | null;

  /**
   * Save language to storage
   * @param lang - Language to save
   */
  setLanguage(lang: L): void;

  /**
   * Optional: Subscribe to language changes (for reactive storages like MobX)
   * @param callback - Called when language changes
   * @returns Unsubscribe function
   */
  subscribe?(callback: (lang: L | null) => void): () => void;
}
