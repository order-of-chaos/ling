import {
  forEachChild,
  isCallExpression,
  isIdentifier,
  isStringLiteralLike,
  type CallExpression,
  type Node,
  type NodeArray,
  type Statement,
} from "typescript";

import type { ScanOptions } from "./types";
import { defaultOptions } from "./types";

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
  const result: NodeScanResult = {};

  const visit = (node: Node) => {
    if (isSearchedFunction(node, translatorFunction)) {
      if (isArgumentValid(node)) {
        const text = extractTranslatedText(node).replace(
          /\\([\s\S])|("'")/g,
          "\\$1$2",
        );
        result[text] = text;
      } else {
        console.warn(
          `${path}: Translator function first argument should be a string literal, found: ${extractFirstArgument(node, content)}`,
        );
      }
    }

    forEachChild(node, visit);
  };

  nodes.forEach(visit);

  return result;
}

function isSearchedFunction(
  node: Node,
  functionName: string,
): node is CallExpression {
  return (
    isCallExpression(node) &&
    isIdentifier(node.expression) &&
    node.expression.text === functionName
  );
}

function isArgumentValid(node: CallExpression): boolean {
  const argument = node.arguments[0];

  return !!argument && isStringLiteralLike(argument);
}

function extractTranslatedText(node: CallExpression): string {
  const argument = node.arguments[0];

  return argument && isStringLiteralLike(argument) ? argument.text : "";
}

function extractFirstArgument(node: CallExpression, content: string): string {
  const argument = node.arguments[0];

  if (!argument) {
    return "No arguments given";
  }

  return content.substring(argument.pos, argument.end);
}
