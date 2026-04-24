export const LocalStorageLangKey = "orderofchaos:ling/language";

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
