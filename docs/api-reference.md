# API Reference

## Umbrella Package

`@orderofchaos/ling` re-exports the full public runtime surface from `@orderofchaos/ling-core` and `@orderofchaos/ling-react`.

It also exposes:

- CLI helpers from `@orderofchaos/ling/cli`
- ESLint plugin entrypoint from `@orderofchaos/ling/eslint-plugin`
- executable commands `ling`, `ling-scan`, and `ling-lint`

```tsx
import {
  I18nProvider,
  initI18nModule,
  createTranslator,
  createLocalStorage,
  createMemoryStorage,
  noun,
  createNoun,
} from "@orderofchaos/ling";
```

## React API

### `<I18nProvider>`

```tsx
<I18nProvider
  translations={translations}
  defaultLanguage="en"
  storage={customStorage}
  supportedLanguages={["en", "ru"]}
>
  <App />
</I18nProvider>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | required | Rendered subtree |
| `translations` | `Record<L, Translations>` | required | All translations keyed by language |
| `defaultLanguage` | `L` | `"en"` | Fallback language |
| `storage` | `I18nStorage<L>` | `createLocalStorage()` | Persistence adapter |
| `supportedLanguages` | `L[]` | `Object.keys(translations)` | Languages used for browser auto-detection |

### `initI18nModule(namespace)`

Creates a namespace-bound React hook:

```ts
const { useI18n } = initI18nModule<"en" | "ru">("Checkout");
```

`useI18n()` returns:

| Property | Type | Description |
| --- | --- | --- |
| `t` | `TranslateFunction` | Translate a key inside the module namespace |
| `noun` | `NounFunction` | Locale-aware plural form selector |
| `language` | `L` | Current language |
| `changeLanguage` | `(lang: L) => void` | Persist and switch language |

### `useI18nContext()`

Low-level hook for direct access to context values:

```ts
const { language, translations, storage, changeLanguage } =
  useI18nContext<"en" | "ru">();
```

## Core Runtime API

### `DefaultLang`

`DefaultLang` is a union of common ISO 639-1 language codes such as:

```ts
type DefaultLang =
  | "en"
  | "ru"
  | "pt"
  | "zh"
  | "ja"
  | "ko"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "...";
```

Use `DefaultLang` when the built-in set is enough. Otherwise define your own language union.

### `Translations`

```ts
interface Translations {
  [namespace: string]: {
    [key: string]: string;
  };
}
```

### `I18nStorage<L extends string = string>`

```ts
interface I18nStorage<L extends string = string> {
  getLanguage(): L | null;
  setLanguage(lang: L): void;
  subscribe?(callback: (lang: L | null) => void): () => void;
}
```

### `LocalStorageLangKey`

Default storage key used by `createLocalStorage()`:

```ts
const LocalStorageLangKey = "orderofchaos:ling/language";
```

### `createLocalStorage(options?)`

```ts
const storage = createLocalStorage<"en" | "ru">({
  key: "my-app-language",
});
```

| Option | Type | Default |
| --- | --- | --- |
| `key` | `string` | `"orderofchaos:ling/language"` |

### `createMemoryStorage(initialLang?)`

Useful for SSR, tests, and fully custom state flows:

```ts
const storage = createMemoryStorage<"en" | "ru">("en");
```

### `createTranslator(options)`

```ts
const t = createTranslator({
  translations,
  namespace: "Checkout",
  getLanguage: () => currentLanguage,
  onMissingKey: (namespace, key) => {
    console.warn("Missing translation", namespace, key);
  },
});

t("Pay now");
t("Total: {{count}}", { count: 3 });
```

| Option | Type | Description |
| --- | --- | --- |
| `translations` | `Record<string, Translations>` | All language dictionaries |
| `namespace` | `string` | Namespace used inside each language dictionary |
| `getLanguage` | `() => string` | Current language getter |
| `onMissingKey` | `(namespace: string, key: string) => void` | Optional missing-key callback |

### `noun(count, forms, locale?)`

Selects the correct plural form using `Intl.PluralRules`:

```ts
noun(1, { one: "item", other: "items" }, "en");
noun(5, { one: "tovar", few: "tovara", many: "tovarov" }, "ru");
```

### `createNoun(locale)`

Returns a locale-bound plural selector:

```ts
const nounRu = createNoun("ru");
const label = nounRu(3, {
  one: "tovar",
  few: "tovara",
  many: "tovarov",
});
```

## CLI API

### `scanDirectory(path, options?)`

```ts
const result = scanDirectory("./src", {
  extensions: ["ts", "tsx"],
  translatorFunction: "t",
  moduleInitFunction: "initI18nModule",
});
```

| Option | Type | Default |
| --- | --- | --- |
| `extensions` | `string[]` | `["ts", "tsx"]` |
| `translatorFunction` | `string` | `"t"` |
| `moduleInitFunction` | `string` | `"initI18nModule"` |

### `scanFile(path, options?)`

Scans a single file for namespaces and literal translation keys:

```ts
const result = scanFile("./src/components/Header.tsx");
```

### `findMissingTranslations(translations, defaultLanguage)`

```ts
const result = findMissingTranslations(translations, "en");

for (const item of result.missing) {
  console.log(`[${item.language}] ${item.namespace}.${item.key}`);
}
```

Return type:

```ts
interface LintResult {
  missing: Array<{
    language: string;
    namespace: string;
    key: string;
  }>;
  total: number;
}
```
