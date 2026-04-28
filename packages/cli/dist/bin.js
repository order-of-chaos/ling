#!/usr/bin/env node
import {
  loadTranslationsFile
} from "./chunk-ET7SUAY2.js";

// src/bin.ts
import * as fs3 from "fs";
import * as path2 from "path";

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
function scanNodes(nodes, path3, content, options = {}) {
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
          `${path3}: Translator function first argument should be a string literal, found: ${extractFirstArgument(node, content)}`
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
function scanFile(path3, options = {}) {
  const opts = { ...defaultOptions, ...options };
  const content = fs.readFileSync(path3, "utf8");
  const tsFile = ts.createSourceFile(
    path3,
    content,
    ts.ScriptTarget.ES2020,
    false,
    ts.ScriptKind.TSX
  );
  const fileScanResult = scanNodes(tsFile.statements, path3, content, opts);
  if (Object.keys(fileScanResult).length > 0) {
    const namespace = extractNamespace(
      tsFile.statements,
      opts.moduleInitFunction
    );
    if (!namespace) {
      console.warn(
        `${path3}: Cannot find "${opts.moduleInitFunction}('ComponentName')"`
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

// src/utils/sortObjectKeys.ts
function sortObjectKeys(obj, compareFn) {
  return Object.keys(obj).sort(compareFn).reduce((sorted, key) => {
    sorted[key] = obj[key];
    return sorted;
  }, {});
}

// src/bin.ts
var defaultConfig = {
  outDir: "src/i18n/translations",
  locales: ["ru", "en"],
  originalLocale: "ru"
};
async function main() {
  const args = process.argv.slice(2);
  const scanPath = args[0] || "src";
  console.log(`\x1B[32mling-scan:\x1B[0m Scanning ${scanPath} for translations...`);
  const scanResult = scanDirectory(scanPath);
  const config = loadConfig() || defaultConfig;
  if (!fs3.existsSync(config.outDir)) {
    fs3.mkdirSync(config.outDir, { recursive: true });
  }
  for (const locale of config.locales) {
    await processLocale(locale, scanResult, config);
  }
  console.log("\x1B[32mling-scan:\x1B[0m Done!");
}
function loadConfig() {
  const configPath = path2.join(process.cwd(), "ling.config.json");
  if (fs3.existsSync(configPath)) {
    try {
      const content = fs3.readFileSync(configPath, "utf8");
      return { ...defaultConfig, ...JSON.parse(content) };
    } catch {
      console.warn("Failed to load ling.config.json, using defaults");
    }
  }
  return null;
}
async function processLocale(locale, scanResult, config) {
  const localePath = path2.join(config.outDir, `${locale}.ts`);
  let previousResult = {};
  if (fs3.existsSync(localePath)) {
    try {
      previousResult = await loadTranslationsFile(
        path2.resolve(localePath),
        locale
      );
    } catch {
    }
  }
  const localeResult = {};
  const newPhrases = {};
  const newModules = [];
  for (const namespace of Object.keys(scanResult)) {
    if (previousResult[namespace]) {
      localeResult[namespace] = {};
      for (const key of Object.keys(scanResult[namespace])) {
        if (!previousResult[namespace][key]) {
          if (!newPhrases[namespace]) {
            newPhrases[namespace] = {};
          }
          newPhrases[namespace][key] = scanResult[namespace][key];
        }
        localeResult[namespace][key] = previousResult[namespace][key] || scanResult[namespace][key];
      }
    } else {
      localeResult[namespace] = scanResult[namespace];
      newModules.push(namespace);
    }
  }
  const sorted = sortObjectKeys(localeResult);
  const content = `export const ${locale} = ${JSON.stringify(sorted, null, 2)};

export default ${locale};
`;
  fs3.writeFileSync(localePath, content);
  console.log(`  \x1B[36m${locale}\x1B[0m: ${localePath}`);
  if (newModules.length > 0) {
    console.log(`    New namespaces: ${newModules.join(", ")}`);
  }
  const newPhrasesCount = Object.values(newPhrases).reduce(
    (sum, ns) => sum + Object.keys(ns).length,
    0
  );
  if (newPhrasesCount > 0) {
    console.log(`    New phrases: ${newPhrasesCount}`);
  }
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
