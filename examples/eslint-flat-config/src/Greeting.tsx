import { initI18nModule } from "@orderofchaos/ling";

const { useI18n } = initI18nModule("Greeting");

export function Greeting({ userName }: { userName: string }) {
  const { t } = useI18n();

  return (
    <section>
      <h1>{t("Hello World")}</h1>
      <p>{t("Welcome, {{name}}!", { name: userName })}</p>
    </section>
  );
}
