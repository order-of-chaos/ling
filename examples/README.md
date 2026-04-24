# Examples

Public usage examples for Ling.

These directories are meant to answer different adoption questions quickly:

| Example | What it shows |
| --- | --- |
| [`basic`](./basic) | Minimal React app using `@orderofchaos/ling-react` |
| [`core-only`](./core-only) | Vanilla translator, memory storage, and pluralization without React |
| [`umbrella`](./umbrella) | Single-package setup with `@orderofchaos/ling` |
| [`custom-storage`](./custom-storage) | A custom storage adapter with `subscribe()` support |
| [`cli-setup`](./cli-setup) | `ling.config.json`, generated translations, and scan/lint workflow |
| [`eslint-flat-config`](./eslint-flat-config) | ESLint 9 flat config for `require-literal-keys` |

Most users should start with `basic` or `umbrella`, then look at `cli-setup` and `eslint-flat-config` when wiring the tooling into CI.
