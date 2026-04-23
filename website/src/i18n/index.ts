import {
  Lang,
  createLocalStorage,
  type Translations,
} from "@orderofchaos/ling-react";
import { en } from "./translations/en";
import { ru } from "./translations/ru";
import { pt } from "./translations/pt";

export const translations: Record<Lang, Translations> = {
  [Lang.en]: en,
  [Lang.ru]: ru,
  [Lang.pt]: pt,
};

export const storage = createLocalStorage<Lang>({
  key: "ling-website-lang",
});

export const defaultLanguage = Lang.en;
