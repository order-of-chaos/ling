# @orderofchaos/ling

[![CI](https://github.com/order-of-chaos/ling/actions/workflows/ci.yml/badge.svg)](https://github.com/order-of-chaos/ling/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@orderofchaos/ling.svg)](https://www.npmjs.com/package/@orderofchaos/ling)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@orderofchaos/ling-react)](https://bundlephobia.com/package/@orderofchaos/ling-react)

A modern, lightweight i18n library for React with automatic translation extraction.

Documentation and examples: https://order-of-chaos.github.io/ling/

## Features

- 🪶 **Lightweight** — ~3kb gzipped, zero runtime dependencies
- 🔒 **Type-safe** — Full TypeScript support with autocomplete
- 🔍 **Auto extraction** — CLI scans code and generates translation files
- 🔌 **Pluggable storage** — localStorage, memory, or custom adapters
- ⚡ **ESLint plugin** — Enforce best practices at build time
- 🌍 **Flexible languages** — 30+ built-in or define your own with generics

## Philosophy: Key = Text

Unlike traditional i18n libraries where you write abstract keys like `t('errors.validation.required')`, Ling uses **the actual text as the key**:

```tsx
// ❌ Traditional approach — what does this text say?
t("hero.title");
t("errors.validation.required");

// ✅ Ling approach — self-documenting code
t("The best i18n library for React");
t("This field is required");
```

**Why?**

- 📖 **Self-documenting** — You see the actual text right in the code
- 🔍 **Easy to find** — Search for any text and find it instantly
- 🚀 **No key management** — CLI extracts keys automatically
- ✅ **No forgotten translations** — Linter catches missing translations

The CLI (`ling-scan`) extracts all `t()` calls and generates translation files. The linter (`ling-lint`) ensures nothing is forgotten.

## Packages

| Package                                                      | Version                                                                                                                                     | Description                     |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| [@orderofchaos/ling](./packages/ling)                        | [![npm](https://img.shields.io/npm/v/@orderofchaos/ling.svg)](https://www.npmjs.com/package/@orderofchaos/ling)                             | Complete Ling toolkit           |
| [@orderofchaos/ling-core](./packages/core)                   | [![npm](https://img.shields.io/npm/v/@orderofchaos/ling-core.svg)](https://www.npmjs.com/package/@orderofchaos/ling-core)                   | Core types and utilities        |
| [@orderofchaos/ling-react](./packages/react)                 | [![npm](https://img.shields.io/npm/v/@orderofchaos/ling-react.svg)](https://www.npmjs.com/package/@orderofchaos/ling-react)                 | React Provider and hooks        |
| [@orderofchaos/ling-cli](./packages/cli)                     | [![npm](https://img.shields.io/npm/v/@orderofchaos/ling-cli.svg)](https://www.npmjs.com/package/@orderofchaos/ling-cli)                     | CLI for extracting translations |
| [@orderofchaos/eslint-plugin-ling](./packages/eslint-plugin) | [![npm](https://img.shields.io/npm/v/@orderofchaos/eslint-plugin-ling.svg)](https://www.npmjs.com/package/@orderofchaos/eslint-plugin-ling) | ESLint rules for Ling           |

## Quick Start

```bash
# Install the full toolkit
pnpm add @orderofchaos/ling
```

### Setup Provider

```tsx
import { I18nProvider } from "@orderofchaos/ling";
import { ru } from "./translations/ru";
import { en } from "./translations/en";

const translations = { ru, en };

function App() {
  return (
    <I18nProvider translations={translations} defaultLanguage="en">
      <YourApp />
    </I18nProvider>
  );
}
```

### Use in Components

```tsx
import { initI18nModule } from "@orderofchaos/ling";

const { useI18n } = initI18nModule("MyComponent");

function MyComponent() {
  const { t, language, changeLanguage } = useI18n();

  return (
    <div>
      <h1>{t("Hello World")}</h1>
      <p>{t("Welcome, {{name}}!", { name: "User" })}</p>
      <button onClick={() => changeLanguage("ru")}>Switch to Russian</button>
    </div>
  );
}
```

### Extract Translations

```bash
# Scan source code and generate translation files
pnpm ling-scan src

# Check for missing translations
pnpm ling-lint ru
```

## Custom Storage

By default, language preference is stored in `localStorage`. You can provide your own storage:

```tsx
import { I18nProvider, type I18nStorage } from '@orderofchaos/ling';

const myStorage: I18nStorage = {
  getLanguage: () => /* get from your storage */,
  setLanguage: (lang) => /* save to your storage */,
  subscribe: (callback) => /* optional: for reactive updates */,
};

<I18nProvider translations={translations} storage={myStorage}>
  <App />
</I18nProvider>
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run type checking
pnpm lint
```

## Release

Release flow is documented in [RELEASING.md](./RELEASING.md).
The local maintainer entrypoints are `pnpm release:login` and `pnpm release:ship`.

## License

MIT
