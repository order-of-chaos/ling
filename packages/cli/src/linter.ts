import type { Lang, Translations } from '@orderofchaos/ling-core';

export interface LintResult {
  missing: Array<{
    language: string;
    namespace: string;
    key: string;
  }>;
  total: number;
}

export function findMissingTranslations(
  translations: Record<Lang, Translations>,
  defaultLanguage: Lang
): LintResult {
  const defaultTranslations = translations[defaultLanguage];
  const missing: LintResult['missing'] = [];

  for (const lang of Object.keys(translations) as Lang[]) {
    if (lang === defaultLanguage) continue;

    const currentTranslations = translations[lang];

    for (const namespace of Object.keys(defaultTranslations)) {
      const defaultKeys = Object.keys(defaultTranslations[namespace]);

      for (const key of defaultKeys) {
        const translation = currentTranslations[namespace]?.[key];

        if (!translation || translation === key) {
          missing.push({
            language: lang,
            namespace,
            key,
          });
        }
      }
    }
  }

  return {
    missing,
    total: missing.length,
  };
}
