# API Reference

## @orderofchaos/ling-react

### `<I18nProvider>`

The context provider that enables i18n in your React app.

```tsx
<I18nProvider
  translations={translations}
  defaultLanguage={Lang.en}
  storage={customStorage}
  supportedLanguages={[Lang.en, Lang.ru]}
>
  <App />
</I18nProvider>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `translations` | `Record<Lang, Translations>` | **required** | All translations for all languages |
| `defaultLanguage` | `Lang` | `Lang.en` | Fallback language |
| `storage` | `I18nStorage` | localStorage adapter | Custom storage for language persistence |
| `supportedLanguages` | `Lang[]` | `[Lang.en, Lang.ru]` | Languages to check in browser detection |
| `children` | `ReactNode` | **required** | Child components |

---

### `initI18nModule(namespace)`

Creates a translation module for a component or feature.

```typescript
const { useI18n } = initI18nModule('MyComponent');
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `namespace` | `string` | The namespace key in translations object |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `useI18n` | `() => I18nModule` | Hook to access translations |

---

### `useI18n()`

Hook returned by `initI18nModule`. Provides translation function and language controls.

```typescript
const { t, language, changeLanguage } = useI18n();
```

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `t` | `(key: string, replace?: Record<string, string \| number>) => string` | Translation function |
| `language` | `Lang` | Current language |
| `changeLanguage` | `(lang: Lang) => void` | Change current language |

---

### `useI18nContext()`

Low-level hook to access the i18n context directly.

```typescript
const { language, translations, storage, changeLanguage } = useI18nContext();
```

---

## @orderofchaos/ling-core

### Types

```typescript
// Supported languages
enum Lang {
  ru = 'ru',
  en = 'en',
}

// Translation structure
interface Translations {
  [namespace: string]: {
    [key: string]: string;
  };
}

// Storage interface
interface I18nStorage {
  getLanguage(): Lang | null;
  setLanguage(lang: Lang): void;
  subscribe?(callback: (lang: Lang | null) => void): () => void;
}

// Language name mapping
interface ILang {
  ru: string;
  en: string;
}
```

---

### `createLocalStorage(options?)`

Creates a localStorage-based storage adapter.

```typescript
const storage = createLocalStorage({ key: 'my_lang_key' });
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `key` | `string` | `'MA_lang'` | localStorage key |

---

### `createMemoryStorage(defaultLang)`

Creates an in-memory storage adapter. Useful for SSR or testing.

```typescript
const storage = createMemoryStorage(Lang.en);
```

---

### `createTranslator(options)`

Creates a translator function for standalone use.

```typescript
const t = createTranslator({
  translations,
  namespace: 'MyComponent',
  getLanguage: () => currentLang,
});

t('Hello'); // => 'Привет'
t('Hello, {{name}}!', { name: 'World' }); // => 'Привет, World!'
```

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `translations` | `Record<Lang, Translations>` | All translations |
| `namespace` | `string` | Component namespace |
| `getLanguage` | `() => Lang` | Function to get current language |

---

## @orderofchaos/ling-cli

### `scanDirectory(path, options?)`

Scans a directory for translation calls.

```typescript
const result = scanDirectory('./src', {
  extensions: ['ts', 'tsx'],
  translatorFunction: 't',
  moduleInitFunction: 'initI18nModule',
});
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `extensions` | `string[]` | `['ts', 'tsx']` | File extensions to scan |
| `translatorFunction` | `string` | `'t'` | Name of the translation function |
| `moduleInitFunction` | `string` | `'initI18nModule'` | Name of the module init function |

---

### `scanFile(path, options?)`

Scans a single file for translation calls.

```typescript
const result = scanFile('./src/components/Header.tsx');
```

---

### `findMissingTranslations(translations, defaultLanguage)`

Checks for missing translations.

```typescript
const result = findMissingTranslations(translations, Lang.ru);

if (result.total > 0) {
  result.missing.forEach(({ language, namespace, key }) => {
    console.log(`Missing: [${language}] ${namespace}.${key}`);
  });
}
```

#### Returns

```typescript
interface LintResult {
  missing: Array<{
    language: string;
    namespace: string;
    key: string;
  }>;
  total: number;
}
```
