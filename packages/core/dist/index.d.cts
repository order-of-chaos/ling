declare const LocalStorageLangKey = "orderofchaos:ling/language";
/**
 * Default supported languages (ISO 639-1 codes).
 * Use this type for most applications, or define your own.
 */
type DefaultLang = "en" | "ru" | "pt" | "zh" | "ja" | "ko" | "es" | "fr" | "de" | "it" | "ar" | "hi" | "pl" | "uk" | "tr" | "nl" | "sv" | "cs" | "da" | "fi" | "no" | "el" | "he" | "th" | "vi" | "id" | "ms" | "ro" | "hu" | "bg";
interface Translations {
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
interface I18nStorage<L extends string = string> {
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

interface LocalStorageOptions {
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
declare function createLocalStorage<L extends string = string>(options?: LocalStorageOptions): I18nStorage<L>;
/**
 * Creates an in-memory storage adapter.
 * Useful for SSR or testing.
 *
 * @typeParam L - Language type
 */
declare function createMemoryStorage<L extends string = string>(initialLang?: L | null): I18nStorage<L>;

interface TranslatorOptions {
    /**
     * All translations organized by language
     */
    translations: Record<string, Translations>;
    /**
     * Namespace (component name) for this translator
     */
    namespace: string;
    /**
     * Function to get current language
     */
    getLanguage: () => string;
    /**
     * Called when translation key is not found
     */
    onMissingKey?: (namespace: string, key: string) => void;
}
type TranslateFunction = (key: string, replace?: Record<string, string | number>) => string;
/**
 * Creates a translate function for a specific namespace.
 */
declare function createTranslator(options: TranslatorOptions): TranslateFunction;

/**
 * Plural forms for different languages.
 * Based on CLDR plural rules: one, two, few, many, other
 */
type PluralForms<T> = {
    zero?: T;
    one?: T;
    two?: T;
    few?: T;
    many?: T;
    other?: T;
};
/**
 * Plural category returned by Intl.PluralRules
 */
type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";
/**
 * Select the correct plural form based on count and locale.
 * Uses Intl.PluralRules for language-aware pluralization.
 *
 * @example
 * ```tsx
 * // With useI18n (language is automatic)
 * const { t, noun } = useI18n();
 * {noun(count, {
 *   one: t("{{count}} item", { count }),
 *   few: t("{{count}} items", { count }),
 *   many: t("{{count}} items", { count }),
 * })}
 *
 * // Standalone usage
 * import { noun } from '@orderofchaos/ling-core';
 * noun(5, { one: "1 item", other: "5 items" }, "en")
 * ```
 */
declare function noun<T>(count: number, forms: PluralForms<T>, locale?: string): T;
/**
 * Create a noun function bound to a specific locale.
 * Useful for creating language-specific plural selectors.
 *
 * @example
 * ```ts
 * const nounRu = createNoun('ru');
 * nounRu(5, { one: "товар", few: "товара", many: "товаров" })
 * // → "товаров"
 * ```
 */
declare function createNoun(locale: string): <T>(count: number, forms: PluralForms<T>) => T;

export { type DefaultLang, type I18nStorage, LocalStorageLangKey, type LocalStorageOptions, type PluralCategory, type PluralForms, type TranslateFunction, type Translations, type TranslatorOptions, createLocalStorage, createMemoryStorage, createNoun, createTranslator, noun };
