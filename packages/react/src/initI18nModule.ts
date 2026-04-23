import { useCallback, useMemo } from "react";

import { createTranslator, createNoun } from "@orderofchaos/ling-core";
import type {
  DefaultLang,
  PluralForms,
  TranslateFunction,
} from "@orderofchaos/ling-core";

import { useI18nContext } from "./I18nContext";

export type NounFunction = <T>(count: number, forms: PluralForms<T>) => T;

export interface UseI18nResult<L extends string = DefaultLang> {
  t: TranslateFunction;
  noun: NounFunction;
  language: L;
  changeLanguage: (lang: L) => void;
}

export interface I18nModule<L extends string = DefaultLang> {
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
export function initI18nModule<L extends string = DefaultLang>(
  namespace: string,
): I18nModule<L> {
  const useI18n = (): UseI18nResult<L> => {
    const { language, translations, changeLanguage } = useI18nContext<L>();

    const t = useCallback(
      (key: string, replace?: Record<string, string | number>): string => {
        const translator = createTranslator({
          translations,
          namespace,
          getLanguage: () => language,
          onMissingKey: (ns, k) => {
            console.warn(`[i18n] Missing translation: ${ns}.${k}`);
          },
        });

        return translator(key, replace);
      },
      [language, translations],
    );

    const noun = useMemo(() => createNoun(language), [language]);

    return {
      t,
      noun,
      language,
      changeLanguage,
    };
  };

  return { useI18n };
}
