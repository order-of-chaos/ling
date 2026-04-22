import { useCallback, useMemo } from "react";

import { createTranslator, createNoun } from "@orderofchaos/ling-core";
import type { TranslateFunction, PluralForms } from "@orderofchaos/ling-core";

import { useI18nContext } from "./I18nContext";

export type NounFunction = <T>(count: number, forms: PluralForms<T>) => T;

export interface UseI18nResult {
  t: TranslateFunction;
  noun: NounFunction;
  language: string;
  changeLanguage: (lang: string) => void;
}

export interface I18nModule {
  /**
   * Hook for use in React components
   */
  useI18n: () => UseI18nResult;
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
export function initI18nModule(namespace: string): I18nModule {
  const useI18n = (): UseI18nResult => {
    const { language, translations, changeLanguage } = useI18nContext();

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
