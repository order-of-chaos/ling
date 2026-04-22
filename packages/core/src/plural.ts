/**
 * Plural forms for different languages.
 * Based on CLDR plural rules: one, two, few, many, other
 */
export type PluralForms<T> = {
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
export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

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
export function noun<T>(
  count: number,
  forms: PluralForms<T>,
  locale: string = "en",
): T {
  const rules = new Intl.PluralRules(locale);
  const category = rules.select(count) as PluralCategory;

  // Try exact match first, then fallback to 'other', then first available
  const result = forms[category] ?? forms.other ?? Object.values(forms)[0];

  return result as T;
}

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
export function createNoun(locale: string) {
  return <T>(count: number, forms: PluralForms<T>): T => {
    return noun(count, forms, locale);
  };
}
