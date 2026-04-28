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
import { SyntaxKind } from "typescript";

// src/scanner/scanNodes.ts
import {
  forEachChild,
  isCallExpression,
  isIdentifier,
  isStringLiteralLike
} from "typescript";
function scanNodes(nodes, path2, content, options = {}) {
  const { translatorFunction } = { ...defaultOptions, ...options };
  const result = {};
  const visit = (node) => {
    if (isSearchedFunction(node, translatorFunction)) {
      if (isArgumentValid(node)) {
        const text = extractTranslatedText(node).replace(
          /\\([\s\S])|("'")/g,
          "\\$1$2"
        );
        result[text] = text;
      } else {
        console.warn(
          `${path2}: Translator function first argument should be a string literal, found: ${extractFirstArgument(node, content)}`
        );
      }
    }
    forEachChild(node, visit);
  };
  nodes.forEach(visit);
  return result;
}
function isSearchedFunction(node, functionName) {
  return isCallExpression(node) && isIdentifier(node.expression) && node.expression.text === functionName;
}
function isArgumentValid(node) {
  const argument = node.arguments[0];
  return !!argument && isStringLiteralLike(argument);
}
function extractTranslatedText(node) {
  const argument = node.arguments[0];
  return argument && isStringLiteralLike(argument) ? argument.text : "";
}
function extractFirstArgument(node, content) {
  const argument = node.arguments[0];
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
    return node.kind === SyntaxKind.VariableStatement && node.declarationList?.declarations?.[0]?.initializer?.kind === SyntaxKind.CallExpression && node.declarationList.declarations[0].initializer.expression?.escapedText === moduleInitFunction;
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