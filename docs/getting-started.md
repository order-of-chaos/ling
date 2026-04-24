# Getting Started

## Choose a Package

For most projects, install the umbrella package:

```bash
pnpm add @orderofchaos/ling
```

That gives you:

- React runtime APIs
- core utilities
- `ling-scan`
- `ling-lint`
- `@orderofchaos/ling/eslint-plugin`

If you want a smaller dependency surface, install the granular packages instead:

```bash
pnpm add @orderofchaos/ling-react
pnpm add -D @orderofchaos/ling-cli @orderofchaos/eslint-plugin-ling
```

## Create Translation Files

Create a directory such as `src/i18n/translations/`:

```typescript
// src/i18n/translations/en.ts
export const en = {
  App: {
    "Hello World": "Hello World",
    "Welcome, {{name}}!": "Welcome, {{name}}!",
  },
};

export default en;
```

```typescript
// src/i18n/translations/ru.ts
export const ru = {
  App: {
    "Hello World": "Privet mir",
    "Welcome, {{name}}!": "Dobro pozhalovat, {{name}}!",
  },
};

export default ru;
```

## Wrap the App with `I18nProvider`

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import {
  I18nProvider,
  type Translations,
} from "@orderofchaos/ling";

import App from "./App";
import { en } from "./i18n/translations/en";
import { ru } from "./i18n/translations/ru";

type AppLang = "en" | "ru";

const translations: Record<AppLang, Translations> = { en, ru };

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
```

## Create a Namespace Module

```tsx
// src/App.tsx
import { initI18nModule } from "@orderofchaos/ling";

const { useI18n } = initI18nModule<"en" | "ru">("App");

export function App() {
  const { t, language, changeLanguage } = useI18n();

  return (
    <div>
      <h1>{t("Hello World")}</h1>
      <p>{t("Welcome, {{name}}!", { name: "User" })}</p>
      <p>{t("Current language: {{lang}}", { lang: language })}</p>

      <button onClick={() => changeLanguage("ru")}>Russkii</button>
      <button onClick={() => changeLanguage("en")}>English</button>
    </div>
  );
}
```

## Extract New Keys

`ling-scan` creates or updates translation files by scanning `t("...")` calls.

```bash
pnpm ling-scan src
```

Then check for missing translations:

```bash
pnpm ling-lint en src/i18n/translations
```

## Add ESLint Guardrails

Use the ESLint plugin to enforce literal translation keys:

```javascript
// eslint.config.mjs
import ling from "@orderofchaos/ling/eslint-plugin";

export default [
  {
    plugins: { ling },
    rules: {
      "ling/require-literal-keys": "error",
    },
  },
];
```

## Next Steps

- [API Reference](./api-reference.md)
- [Custom Storage](./custom-storage.md)
- [CLI Usage](./cli.md)
- [ESLint Plugin](./eslint-plugin.md)
