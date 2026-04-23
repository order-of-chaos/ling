import { useState, useCallback, useEffect, useMemo } from "react";
import type { ReactNode } from "react";

import {
  createLocalStorage,
  type I18nStorage,
  type Translations,
  type DefaultLang,
} from "@orderofchaos/ling-core";

import { I18nContext, type I18nContextValue } from "./I18nContext";

export interface I18nProviderProps<L extends string = DefaultLang> {
  children: ReactNode;

  /**
   * All translations by language
   */
  translations: Record<L, Translations>;

  /**
   * Default/fallback language
   * @default 'en'
   */
  defaultLanguage?: L;

  /**
   * Custom storage adapter. Defaults to localStorage.
   * Pass your own implementation for SSR, React Native, or custom persistence.
   */
  storage?: I18nStorage<L>;

  /**
   * Supported languages for auto-detection
   */
  supportedLanguages?: L[];
}

function detectBrowserLanguage<L extends string>(
  supported: L[],
  fallback: L,
): L {
  if (typeof window === "undefined") {
    return fallback;
  }

  const browserLang = window.navigator?.language?.split("-")[0];

  if (browserLang && supported.includes(browserLang as L)) {
    return browserLang as L;
  }

  return fallback;
}

export function I18nProvider<L extends string = DefaultLang>({
  children,
  translations,
  defaultLanguage = "en" as L,
  storage: customStorage,
  supportedLanguages,
}: I18nProviderProps<L>) {
  const storage = useMemo(
    () => customStorage ?? createLocalStorage<L>(),
    [customStorage],
  );

  const supported = supportedLanguages ?? (Object.keys(translations) as L[]);

  const [language, setLanguage] = useState<L>(() => {
    const stored = storage.getLanguage();
    if (stored) {
      return stored;
    }

    return detectBrowserLanguage(supported, defaultLanguage);
  });

  // Subscribe to storage changes (for reactive storages)
  useEffect(() => {
    if (!storage.subscribe) {
      return;
    }

    const unsubscribe = storage.subscribe((lang) => {
      if (lang && lang !== language) {
        setLanguage(lang);
      }
    });

    return unsubscribe;
  }, [storage, language]);

  // Sync document lang attribute
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const changeLanguage = useCallback(
    (lang: L) => {
      storage.setLanguage(lang);
      setLanguage(lang);
    },
    [storage],
  );

  const contextValue = useMemo(
    () =>
      ({
        language,
        translations,
        storage,
        changeLanguage,
      }) satisfies I18nContextValue<L>,
    [language, translations, storage, changeLanguage],
  );

  return (
    <I18nContext.Provider value={contextValue as unknown as I18nContextValue}>
      {children}
    </I18nContext.Provider>
  );
}
