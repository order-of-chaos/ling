# @orderofchaos/ling-core

Core types and utilities for the @orderofchaos/ling i18n library.

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
pnpm add @orderofchaos/ling-core
```

> **Note**: Most users should install `@orderofchaos/ling-react` instead, which re-exports everything from core.

## API

### Types

```typescript
import type {
  DefaultLang,
  Translations,
  I18nStorage,
} from "@orderofchaos/ling-core";
import { Lang, LangNames } from "@orderofchaos/ling-core";
```

- `DefaultLang` - Union of common ISO 639-1 language codes
- `Lang` - Backward-compatible enum for `ru`, `en`, and `pt`
- `LangNames` - Human-readable names for common languages
- `Translations` - Translation dictionary structure
- `I18nStorage` - Interface for custom storage adapters

### Storage Adapters

```typescript
import {
  createLocalStorage,
  createMemoryStorage,
} from "@orderofchaos/ling-core";

// Browser localStorage
const storage = createLocalStorage({ key: "my_lang" });

// In-memory (for SSR/testing)
const memoryStorage = createMemoryStorage(Lang.en);
```

### Translator

```typescript
import { createTranslator } from "@orderofchaos/ling-core";

const t = createTranslator({
  translations,
  namespace: "MyComponent",
  getLanguage: () => currentLang,
});

t("Hello"); // => 'Привет' (if currentLang is 'ru')
```

### Pluralization

```typescript
import { noun, createNoun } from "@orderofchaos/ling-core";

// Direct usage with locale
noun(
  5,
  {
    one: "{{count}} item",
    other: "{{count}} items",
  },
  "en",
); // → "{{count}} items"

// Russian pluralization (one, few, many)
noun(
  21,
  {
    one: "товар",
    few: "товара",
    many: "товаров",
  },
  "ru",
); // → "товар" (21 ends with 1)

// Create locale-bound function
const nounRu = createNoun("ru");
nounRu(5, { one: "товар", few: "товара", many: "товаров" });
// → "товаров"
```

## License

MIT
