# ESLint Plugin

`@orderofchaos/eslint-plugin-ling` enforces translation patterns that the CLI can analyze statically.

If you installed `@orderofchaos/ling`, the plugin is also available at `@orderofchaos/ling/eslint-plugin`.

## Installation

```bash
pnpm add -D @orderofchaos/eslint-plugin-ling
```

Or use the umbrella package:

```bash
pnpm add @orderofchaos/ling
```

## Flat Config

```js
// eslint.config.mjs
import ling from "@orderofchaos/eslint-plugin-ling";

export default [
  {
    plugins: { ling },
    rules: {
      "ling/require-literal-keys": "error",
    },
  },
];
```

With the umbrella package:

```js
import ling from "@orderofchaos/ling/eslint-plugin";
```

## Legacy Config

```json
{
  "plugins": ["@orderofchaos/ling"],
  "rules": {
    "@orderofchaos/ling/require-literal-keys": "error"
  }
}
```

## Rule: `require-literal-keys`

The rule only allows plain string literals in translation calls.

That matters because `ling-scan` can only extract keys that are statically visible in source code.

### Valid

```tsx
t("Hello World");
t("Welcome, {{name}}!", { name: user.name });
```

### Invalid

```tsx
const key = "Hello World";
t(key);

t(`Welcome ${user.name}`);

t(getTranslationKey());
```

## Rule Options

By default the rule checks calls to `t(...)`.

If your project wraps Ling in another helper, configure additional translator names:

```js
import ling from "@orderofchaos/eslint-plugin-ling";

export default [
  {
    plugins: { ling },
    rules: {
      "ling/require-literal-keys": [
        "error",
        {
          translatorFunctions: ["t", "translate"],
        },
      ],
    },
  },
];
```

## Related Docs

- [Getting Started](./getting-started.md)
- [CLI Usage](./cli.md)
- [API Reference](./api-reference.md)
