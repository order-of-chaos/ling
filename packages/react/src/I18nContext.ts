import { createContext, useContext } from "react";

import type { Translations, I18nStorage } from "@orderofchaos/ling-core";

export interface I18nContextValue {
  language: string;
  translations: Record<string, Translations>;
  storage: I18nStorage;
  changeLanguage: (lang: string) => void;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18nContext(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18nContext must be used within I18nProvider");
  }
  return context;
}
