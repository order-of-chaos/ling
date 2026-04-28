import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';
import { DefaultLang, Translations, I18nStorage, TranslateFunction, PluralForms } from '@orderofchaos/ling-core';
export * from '@orderofchaos/ling-core';

interface I18nProviderProps<L extends string = DefaultLang> {
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
declare function I18nProvider<L extends string = DefaultLang>({ children, translations, defaultLanguage, storage: customStorage, supportedLanguages, }: I18nProviderProps<L>): react_jsx_runtime.JSX.Element;

interface I18nContextValue<L extends string = string> {
    language: L;
    translations: Record<L, Translations>;
    storage: I18nStorage<L>;
    changeLanguage: (lang: L) => void;
}
declare function useI18nContext<L extends string = string>(): I18nContextValue<L>;

type NounFunction = <T>(count: number, forms: PluralForms<T>) => T;
interface UseI18nResult<L extends string = DefaultLang> {
    t: TranslateFunction;
    noun: NounFunction;
    language: L;
    changeLanguage: (lang: L) => void;
}
interface I18nModule<L extends string = DefaultLang> {
    /**
     * Hook for use in React components
     */
    useI18n: () => UseI18nResult<L>;
}
/**
 * Creates an i18n module for a specific component/namespace.
 *
 * @param namespace - Component name used as namespace in translations
 * @returns I18n module with useI18n hook
 *
 * @example
 * ```tsx
 * const { useI18n } = initI18nModule('MyComponent');
 *
 * function MyComponent() {
 *   const { t, language, changeLanguage } = useI18n();
 *   return <h1>{t('hello')}</h1>;
 * }
 * ```
 */
declare function initI18nModule<L extends string = DefaultLang>(namespace: string): I18nModule<L>;

export { type I18nContextValue, type I18nModule, I18nProvider, type I18nProviderProps, type NounFunction, type UseI18nResult, initI18nModule, useI18nContext };
