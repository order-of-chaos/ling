# CLI Usage

The `@orderofchaos/ling-cli` package provides tools for extracting and validating translations in your codebase.

## Installation

```bash
pnpm add -D @orderofchaos/ling-cli
```

## Commands

### ling-scan

Scans your source code for `t()` function calls and generates translation files.

```bash
# Scan the default 'src' directory
pnpm ling-scan

# Scan a specific directory
pnpm ling-scan ./app

# Add to package.json scripts
{
  "scripts": {
    "i18n:scan": "ling-scan src"
  }
}
```

#### How it works

The scanner looks for:

1. `initI18nModule('ComponentName')` calls to determine the namespace
2. `t('Translation key')` calls to extract translation keys

Example component:

```tsx
// src/components/Header.tsx
import { initI18nModule } from '@orderofchaos/ling-react';

const { useI18n } = initI18nModule('Header');

function Header() {
  const { t } = useI18n();
  
  return (
    <header>
      <h1>{t('Welcome to our app')}</h1>
      <p>{t('Navigate using the menu below')}</p>
    </header>
  );
}
```

Running `pnpm ling-scan` generates:

```typescript
// src/i18n/translations/ru.ts
export const ru = {
  Header: {
    'Welcome to our app': 'Welcome to our app',
    'Navigate using the menu below': 'Navigate using the menu below',
  },
};
```

### ling-lint

Checks for missing translations in your language files.

```bash
# Check all languages against Russian as the default
pnpm ling-lint ru

# Specify a custom translations directory
pnpm ling-lint ru ./src/i18n/translations

# Add to package.json scripts
{
  "scripts": {
    "i18n:lint": "ling-lint ru"
  }
}
```

#### Output example

```
ling-lint: Found 3 missing translations:

  [en] Header.Welcome to our app
  [en] Header.Navigate using the menu below
  [en] Footer.Contact us
```

## Configuration

Create a `ling.config.json` file in your project root:

```json
{
  "outDir": "src/i18n/translations",
  "locales": ["ru", "en"],
  "originalLocale": "ru"
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `outDir` | `src/i18n/translations` | Output directory for translation files |
| `locales` | `["ru", "en"]` | Languages to generate |
| `originalLocale` | `ru` | The default/source language |

## Programmatic API

You can also use the CLI tools programmatically:

```typescript
import { scanDirectory, findMissingTranslations } from '@orderofchaos/ling-cli';

// Scan a directory for translations
const result = scanDirectory('./src', {
  extensions: ['ts', 'tsx'],
  translatorFunction: 't',
  moduleInitFunction: 'initI18nModule',
});

console.log(result);
// {
//   Header: { 'Welcome': 'Welcome', ... },
//   Footer: { 'Contact': 'Contact', ... },
// }

// Check for missing translations
const lint = findMissingTranslations(translations, 'ru');
if (lint.total > 0) {
  console.error(`Missing ${lint.total} translations!`);
  lint.missing.forEach(item => {
    console.log(`  [${item.language}] ${item.namespace}.${item.key}`);
  });
}
```

## Best Practices

1. **Run scan after adding new translations** - Add `ling-scan` to your CI or pre-commit hooks
2. **Keep translations sorted** - The scan output is sorted alphabetically for easier diffing
3. **Use meaningful namespaces** - Name your `initI18nModule` calls after the component or feature
4. **Run lint in CI** - Fail builds if translations are missing
