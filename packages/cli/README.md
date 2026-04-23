# @orderofchaos/ling-cli

CLI tools for extracting and validating translations.

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
pnpm add -D @orderofchaos/ling-cli
```

## Commands

### `ling-scan` / `ling`

Scans source code for `t()` calls and generates translation files.

```bash
# Scan src directory (default)
pnpm ling-scan

# Scan specific directory
pnpm ling-scan ./app
```

### `ling-lint`

Checks for missing translations.

```bash
# Check against Russian as default language
pnpm ling-lint ru

# Specify translations directory
pnpm ling-lint ru ./src/i18n/translations
```

## Configuration

Create `ling.config.json` in project root:

```json
{
  "outDir": "src/i18n/translations",
  "locales": ["ru", "en"],
  "originalLocale": "ru"
}
```

## How It Works

The scanner finds all calls to `t()` function in your code:

```tsx
// src/components/Header.tsx
const { useI18n } = initI18nModule("Header");

function Header() {
  const { t } = useI18n();
  return <h1>{t("Welcome to our app")}</h1>;
}
```

Running `ling-scan` generates:

```typescript
// src/i18n/translations/ru.ts
export const ru = {
  Header: {
    "Welcome to our app": "Welcome to our app",
  },
};

// src/i18n/translations/en.ts
export const en = {
  Header: {
    "Welcome to our app": "Welcome to our app",
  },
};
```

Then translate the values manually or with a tool.

## CI & Pre-commit Integration

### Pre-commit Hook (Husky + lint-staged)

Catch missing translations before commit:

```bash
# Install
pnpm add -D husky lint-staged
pnpm husky init
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "pnpm ling-scan src",
      "pnpm ling-lint en src/i18n/translations"
    ]
  }
}
```

Add hook `.husky/pre-commit`:

```bash
pnpm lint-staged
```

### GitHub Actions

Add translation check to CI:

```yaml
# .github/workflows/ci.yml
jobs:
  lint-translations:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm ling-lint en src/i18n/translations
```

### npm Scripts

Add convenience scripts to `package.json`:

```json
{
  "scripts": {
    "i18n:scan": "ling-scan src",
    "i18n:lint": "ling-lint en src/i18n/translations",
    "i18n:check": "pnpm i18n:scan && pnpm i18n:lint"
  }
}
```

## Programmatic API

```typescript
import { scanDirectory, findMissingTranslations } from "@orderofchaos/ling-cli";

// Scan directory
const result = scanDirectory("./src", {
  extensions: ["ts", "tsx"],
  translatorFunction: "t",
  moduleInitFunction: "initI18nModule",
});

// Check for missing translations
const lint = findMissingTranslations(translations, "ru");
console.log(lint.missing);
```

## License

MIT
