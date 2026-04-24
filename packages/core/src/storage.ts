import type { I18nStorage } from "./types";
import { LocalStorageLangKey } from "./types";

export interface LocalStorageOptions {
  /**
   * Storage key name
   * @default 'orderofchaos:ling/language'
   */
  key?: string;
}

/**
 * Creates a localStorage-based storage adapter.
 * Works in browser environment only.
 *
 * @typeParam L - Language type
 */
export function createLocalStorage<L extends string = string>(
  options: LocalStorageOptions = {},
): I18nStorage<L> {
  const key = options.key ?? LocalStorageLangKey;

  return {
    getLanguage(): L | null {
      if (typeof window === "undefined" || !window.localStorage) {
        return null;
      }

      const stored = localStorage.getItem(key);
      return stored as L | null;
    },

    setLanguage(lang: L): void {
      if (typeof window === "undefined" || !window.localStorage) {
        return;
      }

      localStorage.setItem(key, lang);
    },
  };
}

/**
 * Creates an in-memory storage adapter.
 * Useful for SSR or testing.
 *
 * @typeParam L - Language type
 */
export function createMemoryStorage<L extends string = string>(
  initialLang: L | null = null,
): I18nStorage<L> {
  let currentLang: L | null = initialLang;
  const listeners = new Set<(lang: L | null) => void>();

  return {
    getLanguage(): L | null {
      return currentLang;
    },

    setLanguage(lang: L): void {
      currentLang = lang;
      listeners.forEach((cb) => cb(lang));
    },

    subscribe(callback: (lang: L | null) => void): () => void {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
  };
}
