import type { Rule } from "eslint";
import type { CallExpression } from "estree";

const DEFAULT_TRANSLATOR_FUNCTIONS = ["t"];

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require translation function to be called with a string literal as the first argument",
      recommended: true,
    },
    messages: {
      requireLiteralKey:
        "Translation key must be a string literal for static analysis. Found: {{type}}",
      requireLiteralKeyTemplateLiteral:
        "Translation key must be a plain string literal, not a template literal with expressions",
    },
    schema: [
      {
        type: "object",
        properties: {
          translatorFunctions: {
            type: "array",
            items: { type: "string" },
            default: DEFAULT_TRANSLATOR_FUNCTIONS,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const translatorFunctions: string[] =
      options.translatorFunctions || DEFAULT_TRANSLATOR_FUNCTIONS;

    return {
      CallExpression(node: CallExpression) {
        const callee = node.callee;

        let functionName: string | null = null;

        if (callee.type === "Identifier") {
          functionName = callee.name;
        } else if (
          callee.type === "MemberExpression" &&
          callee.property.type === "Identifier"
        ) {
          functionName = callee.property.name;
        }

        if (!functionName || !translatorFunctions.includes(functionName)) {
          return;
        }

        const firstArg = node.arguments[0];

        if (!firstArg) {
          return;
        }

        if (firstArg.type === "Literal" && typeof firstArg.value === "string") {
          return;
        }

        if (firstArg.type === "TemplateLiteral") {
          if (firstArg.expressions.length === 0) {
            return;
          }

          context.report({
            node: firstArg,
            messageId: "requireLiteralKeyTemplateLiteral",
          });
          return;
        }

        const typeDescription = getTypeDescription(firstArg);

        context.report({
          node: firstArg,
          messageId: "requireLiteralKey",
          data: {
            type: typeDescription,
          },
        });
      },
    };
  },
};

function getTypeDescription(node: { type: string; name?: string }): string {
  switch (node.type) {
    case "Identifier":
      return `variable "${node.name}"`;
    case "MemberExpression":
      return "property access";
    case "CallExpression":
      return "function call";
    case "ConditionalExpression":
      return "conditional expression";
    case "BinaryExpression":
      return "binary expression";
    case "LogicalExpression":
      return "logical expression";
    default:
      return node.type;
  }
}

export default rule;
