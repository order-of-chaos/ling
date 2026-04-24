import { I18nProvider, initI18nModule, type Translations } from "@orderofchaos/ling";

import { createUrlStorage, type AppLang } from "./urlStorage";

const { useI18n } = initI18nModule<AppLang>("Settings");

const translations: Record<AppLang, Translations> = {
  en: {
    Settings: {
      "Language from URL": "Language from URL",
    },
  },
  ru: {
    Settings: {
      "Language from URL": "Iazyk iz URL",
    },
  },
};

const storage = createUrlStorage();

function Settings() {
  const { t, language, changeLanguage } = useI18n();

  return (
    <section>
      <h1>{t("Language from URL")}</h1>
      <p>{language}</p>
      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("ru")}>Russkii</button>
    </section>
  );
}

export function App() {
  return (
    <I18nProvider<AppLang>
      translations={translations}
      storage={storage}
      defaultLanguage="en"
    >
      <Settings />
    </I18nProvider>
  );
}
