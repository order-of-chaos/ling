import type { Translations } from "@orderofchaos/ling";

export type AppLang = "en" | "ru";

export const translations: Record<AppLang, Translations> = {
  en: {
    App: {
      "Welcome to Ling": "Welcome to Ling",
      "Current language: {{lang}}": "Current language: {{lang}}",
    },
  },
  ru: {
    App: {
      "Welcome to Ling": "Dobro pozhalovat v Ling",
      "Current language: {{lang}}": "Tekushchii iazyk: {{lang}}",
    },
  },
};
