import ling from "@orderofchaos/eslint-plugin-ling";

export default [
  {
    plugins: { ling },
    rules: {
      "ling/require-literal-keys": "error",
    },
  },
];
