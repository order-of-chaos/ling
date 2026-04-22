import {
  SyntaxKind,
  type NodeArray,
  type Statement,
  type StringLiteral,
  type Identifier,
} from "typescript";

import type { ScanOptions } from "./types";
import { defaultOptions } from "./types";

const meaningfulKinds: { [key in SyntaxKind]?: string | string[] } = {
  [SyntaxKind.PropertyDeclaration]: "initializer",
  [SyntaxKind.MethodDeclaration]: "body",
  [SyntaxKind.Constructor]: "body",
  [SyntaxKind.GetAccessor]: "body",
  [SyntaxKind.SetAccessor]: "body",
  [SyntaxKind.ArrayLiteralExpression]: "elements",
  [SyntaxKind.ObjectLiteralExpression]: "properties",
  [SyntaxKind.PropertyAccessExpression]: "expression",
  [SyntaxKind.CallExpression]: ["expression", "arguments"],
  [SyntaxKind.ExpressionStatement]: ["expression", "arguments"],
  [SyntaxKind.BinaryExpression]: ["right", "left"],
  [SyntaxKind.ParenthesizedExpression]: "expression",
  [SyntaxKind.ArrowFunction]: "body",
  [SyntaxKind.ConditionalExpression]: ["condition", "whenTrue", "whenFalse"],
  [SyntaxKind.TemplateExpression]: "templateSpans",
  [SyntaxKind.YieldExpression]: "expression",
  [SyntaxKind.Block]: "statements",
  [SyntaxKind.VariableStatement]: "declarationList",
  [SyntaxKind.IfStatement]: ["thenStatement", "elseStatement"],
  [SyntaxKind.TemplateSpan]: "expression",
  [SyntaxKind.DoStatement]: "expression",
  [SyntaxKind.WhileStatement]: "expression",
  [SyntaxKind.ForStatement]: "statement",
  [SyntaxKind.ForInStatement]: ["statement", "expression"],
  [SyntaxKind.ForOfStatement]: ["statement", "expression"],
  [SyntaxKind.ReturnStatement]: "expression",
  [SyntaxKind.SwitchStatement]: ["expression", "caseBlock"],
  [SyntaxKind.ThrowStatement]: ["expression"],
  [SyntaxKind.TryStatement]: ["tryBlock", "catchClause", "finallyBlock"],
  [SyntaxKind.VariableDeclaration]: ["name", "initializer"],
  [SyntaxKind.VariableDeclarationList]: "declarations",
  [SyntaxKind.FunctionDeclaration]: "body",
  [SyntaxKind.ClassDeclaration]: ["members"],
  [SyntaxKind.CaseBlock]: ["clauses"],
  [SyntaxKind.JsxElement]: ["openingElement", "closingElement", "children"],
  [SyntaxKind.JsxSelfClosingElement]: ["attributes"],
  [SyntaxKind.JsxOpeningElement]: "attributes",
  [SyntaxKind.JsxFragment]: ["children"],
  [SyntaxKind.JsxAttribute]: "initializer",
  [SyntaxKind.JsxAttributes]: "properties",
  [SyntaxKind.JsxExpression]: "expression",
  [SyntaxKind.CaseClause]: ["block", "statements"],
  [SyntaxKind.DefaultClause]: ["statements"],
  [SyntaxKind.CatchClause]: ["block"],
  [SyntaxKind.PropertyAssignment]: "initializer",
  [SyntaxKind.BindingElement]: "initializer",
  [SyntaxKind.ObjectBindingPattern]: "elements",
  [SyntaxKind.AsExpression]: "expression",
  [SyntaxKind.ElementAccessExpression]: "expression",
  [SyntaxKind.NewExpression]: ["expression", "arguments"],
};

interface NodeScanResult {
  [key: string]: string;
}

export function scanNodes(
  nodes: NodeArray<Statement>,
  path: string,
  content: string,
  options: ScanOptions = {},
): NodeScanResult {
  const { translatorFunction } = { ...defaultOptions, ...options };

  return nodes
    .filter((node): node is Statement => !!node)
    .reduce((prev: NodeScanResult, node: Statement) => {
      if (meaningfulKinds[node.kind]) {
        if (isSearchedFunction(node, translatorFunction)) {
          if (isArgumentValid(node)) {
            const text = extractTranslatedText(node).replace(
              /\\([\s\S])|("'")/g,
              "\\$1$2",
            );
            prev[text] = text;
            return prev;
          } else {
            console.warn(
              `${path}: Translator function first argument should be a string literal, found: ${extractFirstArgument(node, content)}`,
            );
          }
        } else if (meaningfulKinds[node.kind]) {
          const attributesToScan = Array.isArray(meaningfulKinds[node.kind])
            ? (meaningfulKinds[node.kind] as string[])
            : [meaningfulKinds[node.kind] as string];

          return attributesToScan.reduce((acc, attributeName) => {
            const attribute = (node as unknown as Record<string, unknown>)[
              attributeName
            ];
            if (Array.isArray(attribute)) {
              return {
                ...acc,
                ...scanNodes(
                  attribute as unknown as NodeArray<Statement>,
                  path,
                  content,
                  options,
                ),
              };
            } else if (attribute) {
              return {
                ...acc,
                ...scanNodes(
                  [attribute] as unknown as NodeArray<Statement>,
                  path,
                  content,
                  options,
                ),
              };
            }
            return acc;
          }, prev);
        }
      }
      return prev;
    }, {});
}

function isSearchedFunction(node: unknown, functionName: string): boolean {
  const n = node as {
    kind: SyntaxKind;
    expression?: { kind: SyntaxKind; escapedText?: string };
  };

  return (
    n.kind === SyntaxKind.CallExpression &&
    n.expression?.kind === SyntaxKind.Identifier &&
    (n.expression as Identifier).escapedText === functionName
  );
}

function isArgumentValid(node: unknown): boolean {
  const n = node as { arguments?: Array<{ kind: SyntaxKind }> };

  return (
    (n.arguments?.[0]?.kind === SyntaxKind.StringLiteral ||
      n.arguments?.[0]?.kind === SyntaxKind.NoSubstitutionTemplateLiteral) ??
    false
  );
}

function extractTranslatedText(node: unknown): string {
  const n = node as { arguments?: Array<{ text?: string }> };
  return (n.arguments?.[0] as StringLiteral)?.text ?? "";
}

function extractFirstArgument(node: unknown, content: string): string {
  const n = node as { arguments?: Array<{ pos: number; end: number }> };
  const argument = n.arguments?.[0];

  if (!argument) {
    return "No arguments given";
  }

  return content.substring(argument.pos, argument.end);
}
