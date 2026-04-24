# Documentation

Canonical Ling documentation lives in this directory.

The GitHub Pages docs site is generated from these Markdown files, so the material here is the source of truth for:

- installation and setup
- runtime API
- custom storage adapters
- CLI usage
- ESLint integration

## Guides

- [Getting Started](./getting-started.md)
- [API Reference](./api-reference.md)
- [Custom Storage](./custom-storage.md)
- [CLI Usage](./cli.md)
- [ESLint Plugin](./eslint-plugin.md)

## Packages

- [`@orderofchaos/ling`](https://www.npmjs.com/package/@orderofchaos/ling) - umbrella package with React runtime, core utilities, CLI commands, and ESLint plugin access
- [`@orderofchaos/ling-core`](https://www.npmjs.com/package/@orderofchaos/ling-core) - vanilla translator, storage adapters, and pluralization helpers
- [`@orderofchaos/ling-react`](https://www.npmjs.com/package/@orderofchaos/ling-react) - React provider, context hook, and namespace modules
- [`@orderofchaos/ling-cli`](https://www.npmjs.com/package/@orderofchaos/ling-cli) - translation scanning and missing-translation linting
- [`@orderofchaos/eslint-plugin-ling`](https://www.npmjs.com/package/@orderofchaos/eslint-plugin-ling) - static analysis rule for literal translation keys

## Examples

- [Examples index](https://github.com/order-of-chaos/ling/tree/master/examples)
- [Basic React app](https://github.com/order-of-chaos/ling/tree/master/examples/basic)
- [Core-only runtime](https://github.com/order-of-chaos/ling/tree/master/examples/core-only)
- [Umbrella package setup](https://github.com/order-of-chaos/ling/tree/master/examples/umbrella)
- [Custom storage adapter](https://github.com/order-of-chaos/ling/tree/master/examples/custom-storage)
- [CLI setup](https://github.com/order-of-chaos/ling/tree/master/examples/cli-setup)
- [ESLint flat config](https://github.com/order-of-chaos/ling/tree/master/examples/eslint-flat-config)
