# @orderofchaos/ling-core

Core types and utilities for the @orderofchaos/ling i18n library.

## Installation

```bash
pnpm add @orderofchaos/ling-core
```

> **Note**: Most users should install `@orderofchaos/ling-react` instead, which re-exports everything from core.

## API

### Types

```typescript
import type {
  Lang,
  ILang,
  Translations,
  I18nStorage,
} from "@orderofchaos/ling-core";
```

- `Lang` - Enum of supported languages (`ru`, `en`)
- `ILang` - Object with language string values
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
