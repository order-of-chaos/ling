import { createContext, useContext } from "react";

import type { I18nStorage, Translations } from "@orderofchaos/ling-core";

export interface I18nContextValue<L extends string = string> {
  language: L;
  translations: Record<L, Translations>;
  storage: I18nStorage<L>;
  changeLanguage: (lang: L) => void;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18nContext<L extends string = string>(): I18nContextValue<L> {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18nContext must be used within I18nProvider");
  }
  return context as unknown as I18nContextValue<L>;
}
