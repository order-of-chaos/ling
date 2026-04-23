# @orderofchaos/eslint-plugin-ling

ESLint plugin for enforcing best practices with @orderofchaos/ling.

[![npm version](https://img.shields.io/npm/v/@orderofchaos/eslint-plugin-ling.svg)](https://www.npmjs.com/package/@orderofchaos/eslint-plugin-ling)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Ecosystem

- Marketing site: https://order-of-chaos.github.io/ling/
- Documentation: https://order-of-chaos.github.io/ling/#documentation
- GitHub: https://github.com/order-of-chaos/ling

| Package | Purpose |
| --- | --- |
| [@orderofchaos/ling-core](https://www.npmjs.com/package/@orderofchaos/ling-core) | Core types, storage adapters, translators, and pluralization utilities. |
| [@orderofchaos/ling-react](https://www.npmjs.com/package/@orderofchaos/ling-react) | React provider, hooks, and module helpers for Ling apps. |
| [@orderofchaos/ling-cli](https://www.npmjs.com/package/@orderofchaos/ling-cli) | CLI tools for extracting and validating translation files. |
| [@orderofchaos/eslint-plugin-ling](https://www.npmjs.com/package/@orderofchaos/eslint-plugin-ling) | ESLint rules that keep translation keys statically analyzable. |

## Installation

```bash
pnpm add -D @orderofchaos/eslint-plugin-ling
```

## Usage

### Flat Config (ESLint 9+)

```javascript
// eslint.config.mjs
import ling from '@orderofchaos/eslint-plugin-ling';

export default [
  {
    plugins: { ling },
    rules: {
      'ling/require-literal-keys': 'error',
    },
  },
];
```

### Legacy Config (ESLint 8)

```json
{
  "plugins": ["@orderofchaos/ling"],
  "rules": {
    "@orderofchaos/ling/require-literal-keys": "error"
  }
}
```

## Rules

### `require-literal-keys`

Enforces that translation keys are string literals, not variables or expressions.

This enables static analysis tools like `ling-scan` to extract all translation keys.

#### ✅ Correct

```tsx
t('Hello World');
t('Welcome, {{name}}!', { name: 'User' });
```

#### ❌ Incorrect

```tsx
const key = 'Hello';
t(key); // Error: Translation key must be a string literal

t(`Dynamic ${value}`); // Error: Template literals not allowed

t(getKey()); // Error: Function calls not allowed
```

## License

MIT
