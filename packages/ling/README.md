# @orderofchaos/ling

Complete Ling package with React bindings, core utilities, CLI tools, and ESLint rules.

## Ecosystem

- Marketing site: https://order-of-chaos.github.io/ling/
- Documentation index: https://order-of-chaos.github.io/ling/docs/
- Getting started: https://order-of-chaos.github.io/ling/docs/getting-started/
- API reference: https://order-of-chaos.github.io/ling/docs/api-reference/
- CLI usage: https://order-of-chaos.github.io/ling/docs/cli/
- Custom storage: https://order-of-chaos.github.io/ling/docs/custom-storage/
- ESLint plugin: https://order-of-chaos.github.io/ling/docs/eslint-plugin/
- Examples: https://github.com/order-of-chaos/ling/tree/master/examples
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
pnpm add @orderofchaos/ling
```

## Runtime API

The package re-exports both the React and vanilla core APIs:

```tsx
import { I18nProvider, initI18nModule } from "@orderofchaos/ling";
```

```ts
import {
  createTranslator,
  createLocalStorage,
  createMemoryStorage,
  type Translations,
} from "@orderofchaos/ling";
```

## CLI

Installing this package exposes the same commands as `@orderofchaos/ling-cli`:

```bash
pnpm ling-scan src
pnpm ling-lint en src/i18n/translations
```

## Programmatic CLI API

```typescript
import { scanDirectory, findMissingTranslations } from "@orderofchaos/ling/cli";
```

## ESLint Plugin

For ESLint flat config:

```javascript
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

## License

MIT
