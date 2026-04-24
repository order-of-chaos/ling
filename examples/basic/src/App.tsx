import React from "react";
import { initI18nModule } from "@orderofchaos/ling-react";

const { useI18n } = initI18nModule("App");

function App() {
  const { t, language, changeLanguage } = useI18n();

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>{t("Welcome to Ling!")}</h1>
      <p>{t("This is a simple i18n example.")}</p>
      <p>{t("Current language: {{lang}}", { lang: language })}</p>

      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => changeLanguage("en")}
          style={{
            padding: "0.5rem 1rem",
            fontWeight: language === "en" ? "bold" : "normal",
            backgroundColor: language === "en" ? "#007bff" : "#f0f0f0",
            color: language === "en" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          English
        </button>
        <button
          onClick={() => changeLanguage("ru")}
          style={{
            padding: "0.5rem 1rem",
            fontWeight: language === "ru" ? "bold" : "normal",
            backgroundColor: language === "ru" ? "#007bff" : "#f0f0f0",
            color: language === "ru" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Русский
        </button>
      </div>

      <Counter />
    </div>
  );
}

const { useI18n: useCounterI18n } = initI18nModule("Counter");

function Counter() {
  const { t } = useCounterI18n();
  const [count, setCount] = React.useState(0);

  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1rem",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <h2>{t("Counter Component")}</h2>
      <p>{t("Count: {{count}}", { count })}</p>
      <button
        onClick={() => setCount((c) => c + 1)}
        style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
      >
        {t("Increment")}
      </button>
    </div>
  );
}

export default App;
