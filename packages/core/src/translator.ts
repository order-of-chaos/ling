import type { Translations } from "./types";

export interface TranslatorOptions {
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

export type TranslateFunction = (
  key: string,
  replace?: Record<string, string | number>,
) => string;

/**
 * Creates a translate function for a specific namespace.
 */
export function createTranslator(
  options: TranslatorOptions,
): TranslateFunction {
  const { translations, namespace, getLanguage, onMissingKey } = options;

  return (
    key: string,
    replace: Record<string, string | number> = {},
  ): string => {
    const lang = getLanguage();
    const langTranslations = translations[lang];

    if (!langTranslations?.[namespace]) {
      onMissingKey?.(namespace, key);
      return key;
    }

    const text = langTranslations[namespace][key];

    if (!text) {
      onMissingKey?.(namespace, key);
      return key;
    }

    // Replace &nbsp; with non-breaking space
    let result = text.split("&nbsp;").join("\u00A0");

    // Replace {{placeholders}}
    for (const [placeholder, value] of Object.entries(replace)) {
      result = result.replace(
        new RegExp(`{{${placeholder}}}`, "g"),
        String(value),
      );
    }

    return result;
  };
}
