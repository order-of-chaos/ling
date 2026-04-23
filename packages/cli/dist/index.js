// src/scanner/scanDirectory.ts
import * as fs2 from "fs";
import * as path from "path";

// src/scanner/types.ts
var defaultOptions = {
  extensions: ["ts", "tsx"],
  translatorFunction: "t",
  moduleInitFunction: "initI18nModule"
};

// src/scanner/scanFile.ts
import * as fs from "fs";
import * as ts from "typescript";
import { SyntaxKind as SyntaxKind2 } from "typescript";

// src/scanner/scanNodes.ts
import {
  SyntaxKind
} from "typescript";
var meaningfulKinds = {
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
  [SyntaxKind.NewExpression]: ["expression", "arguments"]
};
function scanNodes(nodes, path2, content, options = {}) {
  const { translatorFunction } = { ...defaultOptions, ...options };
  return nodes.filter((node) => !!node).reduce((prev, node) => {
    if (meaningfulKinds[node.kind]) {
      if (isSearchedFunction(node, translatorFunction)) {
        if (isArgumentValid(node)) {
          const text = extractTranslatedText(node).replace(
            /\\([\s\S])|("'")/g,
            "\\$1$2"
          );
          prev[text] = text;
          return prev;
        } else {
          console.warn(
            `${path2}: Translator function first argument should be a string literal, found: ${extractFirstArgument(node, content)}`
          );
        }
      } else if (meaningfulKinds[node.kind]) {
        const attributesToScan = Array.isArray(meaningfulKinds[node.kind]) ? meaningfulKinds[node.kind] : [meaningfulKinds[node.kind]];
        return attributesToScan.reduce((acc, attributeName) => {
          const attribute = node[attributeName];
          if (Array.isArray(attribute)) {
            return {
              ...acc,
              ...scanNodes(
                attribute,
                path2,
                content,
                options
              )
            };
          } else if (attribute) {
            return {
              ...acc,
              ...scanNodes(
                [attribute],
                path2,
                content,
                options
              )
            };
          }
          return acc;
        }, prev);
      }
    }
    return prev;
  }, {});
}
function isSearchedFunction(node, functionName) {
  const n = node;
  return n.kind === SyntaxKind.CallExpression && n.expression?.kind === SyntaxKind.Identifier && n.expression.escapedText === functionName;
}
function isArgumentValid(node) {
  const n = node;
  return (n.arguments?.[0]?.kind === SyntaxKind.StringLiteral || n.arguments?.[0]?.kind === SyntaxKind.NoSubstitutionTemplateLiteral) ?? false;
}
function extractTranslatedText(node) {
  const n = node;
  return n.arguments?.[0]?.text ?? "";
}
function extractFirstArgument(node, content) {
  const n = node;
  const argument = n.arguments?.[0];
  if (!argument) {
    return "No arguments given";
  }
  return content.substring(argument.pos, argument.end);
}

// src/scanner/scanFile.ts
function scanFile(path2, options = {}) {
  const opts = { ...defaultOptions, ...options };
  const content = fs.readFileSync(path2, "utf8");
  const tsFile = ts.createSourceFile(
    path2,
    content,
    ts.ScriptTarget.ES2020,
    false,
    ts.ScriptKind.TSX
  );
  const fileScanResult = scanNodes(tsFile.statements, path2, content, opts);
  if (Object.keys(fileScanResult).length > 0) {
    const namespace = extractNamespace(
      tsFile.statements,
      opts.moduleInitFunction
    );
    if (!namespace) {
      console.warn(
        `${path2}: Cannot find "${opts.moduleInitFunction}('ComponentName')"`
      );
    }
    return { [namespace || "unknown"]: fileScanResult };
  }
  return {};
}
function extractNamespace(nodes, moduleInitFunction) {
  const initCall = nodes.find((node) => {
    return node.kind === SyntaxKind2.VariableStatement && node.declarationList?.declarations?.[0]?.initializer?.kind === SyntaxKind2.CallExpression && node.declarationList.declarations[0].initializer.expression?.escapedText === moduleInitFunction;
  });
  if (initCall) {
    const initializer = initCall.declarationList.declarations[0].initializer;
    return initializer.arguments?.[0]?.text ?? "";
  }
  return "";
}

// src/scanner/scanDirectory.ts
function scanDirectory(dirPath, options = {}) {
  const opts = { ...defaultOptions, ...options };
  const result = {};
  const items = fs2.readdirSync(dirPath, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    let scanResult = {};
    if (item.isDirectory()) {
      scanResult = scanDirectory(fullPath, opts);
    } else {
      const ext = item.name.split(".").pop();
      if (ext && opts.extensions.includes(ext)) {
        scanResult = scanFile(fullPath, opts);
      }
    }
    for (const namespace of Object.keys(scanResult)) {
      if (!result[namespace]) {
        result[namespace] = {};
      }
      Object.assign(result[namespace], scanResult[namespace]);
    }
  }
  return result;
}

// src/linter.ts
function findMissingTranslations(translations, defaultLanguage) {
  const defaultTranslations = translations[defaultLanguage] ?? {};
  const missing = [];
  for (const lang of Object.keys(translations)) {
    if (lang === defaultLanguage) continue;
    const currentTranslations = translations[lang];
    for (const namespace of Object.keys(defaultTranslations)) {
      const defaultKeys = Object.keys(defaultTranslations[namespace]);
      for (const key of defaultKeys) {
        const translation = currentTranslations[namespace]?.[key];
        if (!translation || translation === key) {
          missing.push({
            language: lang,
            namespace,
            key
          });
        }
      }
    }
  }
  return {
    missing,
    total: missing.length
  };
}
export {
  findMissingTranslations,
  scanDirectory,
  scanFile,
  scanNodes
};
//# sourceMappingURL=index.js.map