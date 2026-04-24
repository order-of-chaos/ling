import {
  createMemoryStorage,
  createTranslator,
  createNoun,
  type Translations,
} from "@orderofchaos/ling-core";

type AppLang = "en" | "ru";

const translations: Record<AppLang, Translations> = {
  en: {
    Cart: {
      "Cart total: {{count}}": "Cart total: {{count}}",
    },
  },
  ru: {
    Cart: {
      "Cart total: {{count}}": "Tovarov v korzine: {{count}}",
    },
  },
};

const storage = createMemoryStorage<AppLang>("en");

const t = createTranslator({
  translations,
  namespace: "Cart",
  getLanguage: () => storage.getLanguage() ?? "en",
});

const noun = createNoun(storage.getLanguage() ?? "en");

const totalLabel = t("Cart total: {{count}}", { count: 3 });
const itemLabel = noun(3, {
  one: "item",
  other: "items",
});

export { storage, t, noun, totalLabel, itemLabel };
