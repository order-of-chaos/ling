export { I18nProvider } from "./I18nProvider";
export type { I18nProviderProps } from "./I18nProvider";

export { useI18nContext } from "./I18nContext";
export type { I18nContextValue } from "./I18nContext";

export { initI18nModule } from "./initI18nModule";
export type { I18nModule, UseI18nResult, NounFunction } from "./initI18nModule";

// Re-export core types for convenience
export {
  Lang,
  LangMap,
  LangNames,
  createLocalStorage,
  createMemoryStorage,
  noun,
  createNoun,
} from "@orderofchaos/ling-core";

export type {
  DefaultLang,
  I18nStorage,
  Translations,
  TranslateFunction,
  PluralForms,
  PluralCategory,
} from "@orderofchaos/ling-core";
