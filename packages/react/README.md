# @orderofchaos/ling-react

React bindings for the @orderofchaos/ling i18n library.

## Ecosystem

- Marketing site: https://order-of-chaos.github.io/ling/
- Documentation: https://order-of-chaos.github.io/ling/#documentation
- GitHub: https://github.com/order-of-chaos/ling

| Package | Purpose |
| --- | --- |
| [@orderofchaos/ling](https://www.npmjs.com/package/@orderofchaos/ling) | Complete package that installs the full Ling toolkit and re-exports the React/core API. |
| [@orderofchaos/ling-core](https://www.npmjs.com/package/@orderofchaos/ling-core) | Core types, storage adapters, translators, and pluralization utilities. |
| [@orderofchaos/ling-react](https://www.npmjs.com/package/@orderofchaos/ling-react) | React provider, hooks, and module helpers for Ling apps. |
| [@orderofchaos/ling-cli](https://www.npmjs.com/package/@orderofchaos/ling-cli) | CLI tools for extracting and validating translation files. |
| [@orderofchaos/eslint-plugin-ling](https://www.npmjs.com/package/@orderofchaos/eslint-plugin-ling) | ESLint rules that keep translation keys statically analyzable. |

## Installation

```bash
pnpm add @orderofchaos/ling-react
```

## Usage

### 1. Setup Provider

```tsx
import { I18nProvider, Lang } from "@orderofchaos/ling-react";
import { ru } from "./translations/ru";
import { en } from "./translations/en";

const translations = { ru, en };

function App() {
  return (
    <I18nProvider translations={translations} defaultLanguage={Lang.en}>
      <YourApp />
    </I18nProvider>
  );
}
```

### 2. Use in Components

```tsx
import { initI18nModule, Lang } from "@orderofchaos/ling-react";

const { useI18n } = initI18nModule("MyComponent");

function MyComponent() {
  const { t, language, changeLanguage } = useI18n();

  return (
    <div>
      <h1>{t("Hello World")}</h1>
      <p>{t("Items: {{count}}", { count: 5 })}</p>
      <button onClick={() => changeLanguage(Lang.ru)}>Русский</button>
    </div>
  );
}
```

### 3. Custom Storage

```tsx
import { I18nProvider, type I18nStorage, Lang } from "@orderofchaos/ling-react";

// Example: AsyncStorage for React Native
const asyncStorage: I18nStorage = {
  getLanguage: () => {
    // Sync fallback - async load happens elsewhere
    return cachedLang;
  },
  setLanguage: async (lang) => {
    await AsyncStorage.setItem("lang", lang);
  },
};

// Example: Reactive MobX storage
const mobxStorage: I18nStorage = {
  getLanguage: () => store.language,
  setLanguage: (lang) => store.setLanguage(lang),
  subscribe: (callback) => {
    return reaction(
      () => store.language,
      (lang) => callback(lang),
    );
  },
};
```

## API

### `<I18nProvider>`

The provider is generic — use `DefaultLang` (30+ languages) or define your own:

```tsx
// Simple — DefaultLang includes en, ru, pt, zh, ja, ko, es, fr, de, it, etc.
<I18nProvider translations={translations} defaultLanguage="en">

// Custom languages
type MyLang = 'en' | 'ru' | 'klingon';
<I18nProvider<MyLang> translations={translations} defaultLanguage="klingon">
```

| Prop                 | Type                      | Default      | Description            |
| -------------------- | ------------------------- | ------------ | ---------------------- |
| `translations`       | `Record<L, Translations>` | required     | All translations       |
| `defaultLanguage`    | `L`                       | `'en'`       | Fallback language      |
| `storage`            | `I18nStorage<L>`          | localStorage | Custom storage adapter |
| `supportedLanguages` | `L[]`                     | auto         | For browser detection  |

### `initI18nModule(namespace)`

Creates a module for a component/feature:

```typescript
const { useI18n } = initI18nModule("FeatureName");
```

### `useI18n()`

Returns:

- `t(key, replace?)` - Translate function
- `noun(count, forms)` - Pluralization function (language-aware)
- `language` - Current language
- `changeLanguage(lang)` - Switch language

## Pluralization

```tsx
const { t, noun } = useI18n();

// Use noun() for pluralization - language is automatic!
{
  noun(count, {
    one: t("{{count}} item", { count }),
    few: t("{{count}} items", { count }),
    many: t("{{count}} items", { count }),
  });
}

// Russian example (1, 2-4, 5+)
{
  noun(itemCount, {
    one: t("{{count}} товар", { count: itemCount }),
    few: t("{{count}} товара", { count: itemCount }),
    many: t("{{count}} товаров", { count: itemCount }),
  });
}
```

Uses `Intl.PluralRules` under the hood for correct pluralization in all languages.

## License

MIT
