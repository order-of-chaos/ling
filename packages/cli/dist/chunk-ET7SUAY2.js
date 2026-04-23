#!/usr/bin/env node

// src/utils/loadTranslations.ts
import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";
import * as vm from "vm";
import * as ts from "typescript";
var moduleExtensions = /* @__PURE__ */ new Set([".js", ".mjs", ".cjs"]);
var sourceExtensions = /* @__PURE__ */ new Set([".ts", ".tsx"]);
var supportedExtensions = /* @__PURE__ */ new Set([
  ...moduleExtensions,
  ...sourceExtensions,
  ".json"
]);
function isTranslationFile(fileName) {
  return !fileName.endsWith(".d.ts") && supportedExtensions.has(path.extname(fileName));
}
function getLocaleFromFileName(fileName) {
  return path.basename(fileName, path.extname(fileName));
}
async function loadTranslationsFile(filePath, exportName) {
  const extension = path.extname(filePath);
  if (extension === ".json") {
    return normalizeTranslations(JSON.parse(fs.readFileSync(filePath, "utf8")));
  }
  if (moduleExtensions.has(extension)) {
    const fileUrl = pathToFileURL(filePath).href;
    const module = await import(fileUrl);
    return normalizeTranslations(module.default ?? module[exportName]);
  }
  if (sourceExtensions.has(extension)) {
    return loadTypeScriptTranslations(filePath, exportName);
  }
  throw new Error(`Unsupported translation file extension: ${filePath}`);
}
function loadTypeScriptTranslations(filePath, exportName) {
  const source = fs.readFileSync(filePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    fileName: filePath,
    reportDiagnostics: true,
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020
    }
  });
  const diagnostic = transpiled.diagnostics?.find(
    (item) => item.category === ts.DiagnosticCategory.Error
  );
  if (diagnostic) {
    throw new Error(
      ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
    );
  }
  const moduleObject = {
    exports: {}
  };
  const context = vm.createContext({
    module: moduleObject,
    exports: moduleObject.exports,
    require(id) {
      throw new Error(
        `Cannot import "${id}" from translation file ${filePath}`
      );
    }
  });
  const script = new vm.Script(transpiled.outputText, { filename: filePath });
  script.runInContext(context);
  return normalizeTranslations(
    moduleObject.exports.default ?? moduleObject.exports[exportName]
  );
}
function normalizeTranslations(value) {
  if (value && typeof value === "object") {
    return value;
  }
  return {};
}

export {
  isTranslationFile,
  getLocaleFromFileName,
  loadTranslationsFile
};
