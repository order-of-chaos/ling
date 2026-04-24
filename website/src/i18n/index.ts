import {
  createLocalStorage,
  type Translations,
} from "@orderofchaos/ling-react";
import { en } from "./translations/en";
import { ru } from "./translations/ru";
import { pt } from "./translations/pt";

export type WebsiteLang = "en" | "ru" | "pt";

export const translations: Record<WebsiteLang, Translations> = {
  en,
  ru,
  pt,
};

export const storage = createLocalStorage<WebsiteLang>({
  key: "ling-website-lang",
});

export const defaultLanguage: WebsiteLang = "en";
