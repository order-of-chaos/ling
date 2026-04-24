import React from "react";
import ReactDOM from "react-dom/client";
import { I18nProvider } from "@orderofchaos/ling";

import { App } from "./App";
import { translations, type AppLang } from "./translations";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nProvider<AppLang>
      translations={translations}
      defaultLanguage="en"
      supportedLanguages={["en", "ru"]}
    >
      <App />
    </I18nProvider>
  </React.StrictMode>,
);
