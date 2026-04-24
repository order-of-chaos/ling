import { initI18nModule } from "@orderofchaos/ling";

const { useI18n } = initI18nModule("Header");

export function Header() {
  const { t } = useI18n();

  return (
    <header>
      <h1>{t("Welcome to our app")}</h1>
      <p>{t("Navigate using the menu below")}</p>
    </header>
  );
}
