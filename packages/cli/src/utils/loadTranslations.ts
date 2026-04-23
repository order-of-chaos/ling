import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import * as vm from 'vm';

import type { Translations } from '@orderofchaos/ling-core';
import * as ts from 'typescript';

const moduleExtensions = new Set(['.js', '.mjs', '.cjs']);
const sourceExtensions = new Set(['.ts', '.tsx']);
const supportedExtensions = new Set([
  ...moduleExtensions,
  ...sourceExtensions,
  '.json',
]);

export function isTranslationFile(fileName: string): boolean {
  return (
    !fileName.endsWith('.d.ts') &&
    supportedExtensions.has(path.extname(fileName))
  );
}

export function getLocaleFromFileName(fileName: string): string {
  return path.basename(fileName, path.extname(fileName));
}

export async function loadTranslationsFile(
  filePath: string,
  exportName: string
): Promise<Translations> {
  const extension = path.extname(filePath);

  if (extension === '.json') {
    return normalizeTranslations(JSON.parse(fs.readFileSync(filePath, 'utf8')));
  }

  if (moduleExtensions.has(extension)) {
    const fileUrl = pathToFileURL(filePath).href;
    const module = (await import(fileUrl)) as Record<string, unknown>;
    return normalizeTranslations(module.default ?? module[exportName]);
  }

  if (sourceExtensions.has(extension)) {
    return loadTypeScriptTranslations(filePath, exportName);
  }

  throw new Error(`Unsupported translation file extension: ${filePath}`);
}

function loadTypeScriptTranslations(
  filePath: string,
  exportName: string
): Translations {
  const source = fs.readFileSync(filePath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    fileName: filePath,
    reportDiagnostics: true,
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });

  const diagnostic = transpiled.diagnostics?.find(
    (item) => item.category === ts.DiagnosticCategory.Error
  );

  if (diagnostic) {
    throw new Error(
      ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
    );
  }

  const moduleObject = {
    exports: {} as Record<string, unknown>,
  };

  const context = vm.createContext({
    module: moduleObject,
    exports: moduleObject.exports,
    require(id: string) {
      throw new Error(
        `Cannot import "${id}" from translation file ${filePath}`
      );
    },
  });

  const script = new vm.Script(transpiled.outputText, { filename: filePath });
  script.runInContext(context);

  return normalizeTranslations(
    moduleObject.exports.default ?? moduleObject.exports[exportName]
  );
}

function normalizeTranslations(value: unknown): Translations {
  if (value && typeof value === 'object') {
    return value as Translations;
  }

  return {};
}
