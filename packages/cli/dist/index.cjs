"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  findMissingTranslations: () => findMissingTranslations,
  scanDirectory: () => scanDirectory,
  scanFile: () => scanFile,
  scanNodes: () => scanNodes
});
module.exports = __toCommonJS(index_exports);

// src/scanner/scanDirectory.ts
var fs2 = __toESM(require("fs"), 1);
var path = __toESM(require("path"), 1);

// src/scanner/types.ts
var defaultOptions = {
  extensions: ["ts", "tsx"],
  translatorFunction: "t",
  moduleInitFunction: "initI18nModule"
};

// src/scanner/scanFile.ts
var fs = __toESM(require("fs"), 1);
var ts = __toESM(require("typescript"), 1);
var import_typescript2 = require("typescript");

// src/scanner/scanNodes.ts
var import_typescript = require("typescript");
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
    (0, import_typescript.forEachChild)(node, visit);
  };
  nodes.forEach(visit);
  return result;
}
function isSearchedFunction(node, functionName) {
  return (0, import_typescript.isCallExpression)(node) && (0, import_typescript.isIdentifier)(node.expression) && node.expression.text === functionName;
}
function isArgumentValid(node) {
  const argument = node.arguments[0];
  return !!argument && (0, import_typescript.isStringLiteralLike)(argument);
}
function extractTranslatedText(node) {
  const argument = node.arguments[0];
  return argument && (0, import_typescript.isStringLiteralLike)(argument) ? argument.text : "";
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
    return node.kind === import_typescript2.SyntaxKind.VariableStatement && node.declarationList?.declarations?.[0]?.initializer?.kind === import_typescript2.SyntaxKind.CallExpression && node.declarationList.declarations[0].initializer.expression?.escapedText === moduleInitFunction;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findMissingTranslations,
  scanDirectory,
  scanFile,
  scanNodes
});
//# sourceMappingURL=index.cjs.map