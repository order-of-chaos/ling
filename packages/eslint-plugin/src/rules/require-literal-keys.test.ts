import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import rule from "./require-literal-keys";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
});

describe("require-literal-keys", () => {
  it("should pass valid cases and fail invalid cases", () => {
    ruleTester.run("require-literal-keys", rule, {
      valid: [
        // String literal
        `t('Hello')`,
        `t('Hello, {{name}}!')`,
        // Template literal without expressions
        "t(`Hello`)",
        // Method call with string literal
        `i18n.t('Hello')`,
        // With second argument
        `t('Hello, {{name}}!', { name: 'World' })`,
        // Different function name (not t)
        `translate(variable)`,
        `other(key)`,
      ],

      invalid: [
        // Variable
        {
          code: `t(key)`,
          errors: [{ messageId: "requireLiteralKey" }],
        },
        // Property access
        {
          code: `t(feature.nameKey)`,
          errors: [{ messageId: "requireLiteralKey" }],
        },
        // Template literal with expression
        {
          code: "t(`Hello ${name}`)",
          errors: [{ messageId: "requireLiteralKeyTemplateLiteral" }],
        },
        // Function call
        {
          code: `t(getKey())`,
          errors: [{ messageId: "requireLiteralKey" }],
        },
        // Conditional expression
        {
          code: `t(isEnglish ? 'hello' : 'привет')`,
          errors: [{ messageId: "requireLiteralKey" }],
        },
        // Binary expression
        {
          code: `t('prefix' + key)`,
          errors: [{ messageId: "requireLiteralKey" }],
        },
        // Method call with variable
        {
          code: `i18n.t(key)`,
          errors: [{ messageId: "requireLiteralKey" }],
        },
      ],
    });
  });

  it("should support custom translator function names", () => {
    const customRuleTester = new RuleTester({
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    });

    customRuleTester.run("require-literal-keys", rule, {
      valid: [
        {
          code: `translate('Hello')`,
          options: [{ translatorFunctions: ["translate"] }],
        },
        {
          code: `t(variable)`,
          options: [{ translatorFunctions: ["translate"] }],
        },
      ],
      invalid: [
        {
          code: `translate(key)`,
          options: [{ translatorFunctions: ["translate"] }],
          errors: [{ messageId: "requireLiteralKey" }],
        },
      ],
    });
  });
});
