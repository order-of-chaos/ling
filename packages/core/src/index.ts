export { Lang, LangMap, LangNames, LocalStorageLangKey } from "./types";
export type { DefaultLang, Translations, I18nStorage } from "./types";

export { createLocalStorage, createMemoryStorage } from "./storage";
export type { LocalStorageOptions } from "./storage";

export { createTranslator } from "./translator";
export type { TranslatorOptions, TranslateFunction } from "./translator";

export { noun, createNoun } from "./plural";
export type { PluralForms, PluralCategory } from "./plural";
