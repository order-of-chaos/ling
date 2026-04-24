import { initI18nModule } from "@orderofchaos/ling";

import type { AppLang } from "./translations";

const { useI18n } = initI18nModule<AppLang>("App");

export function App() {
  const { t, language, changeLanguage } = useI18n();

  return (
    <main>
      <h1>{t("Welcome to Ling")}</h1>
      <p>{t("Current language: {{lang}}", { lang: language })}</p>

      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("ru")}>Russkii</button>
    </main>
  );
}
