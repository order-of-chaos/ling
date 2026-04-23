#!/usr/bin/env node
import {
  getLocaleFromFileName,
  isTranslationFile,
  loadTranslationsFile
} from "./chunk-ET7SUAY2.js";

// src/lint.ts
import * as fs from "fs";
import * as path from "path";

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

// src/lint.ts
var defaultTranslationsDir = "src/i18n/translations";
async function main() {
  const { defaultLang, translationsDir } = parseArgs(process.argv.slice(2));
  console.log(
    `\x1B[32mling-lint:\x1B[0m Checking translations (default: ${defaultLang})...`
  );
  if (!fs.existsSync(translationsDir)) {
    console.error(`Translations directory not found: ${translationsDir}`);
    process.exit(1);
  }
  const translations = {};
  for (const file of fs.readdirSync(translationsDir)) {
    if (!isTranslationFile(file)) {
      continue;
    }
    const locale = getLocaleFromFileName(file);
    const localePath = path.join(translationsDir, file);
    try {
      translations[locale] = await loadTranslationsFile(
        path.resolve(localePath),
        locale
      );
    } catch (err) {
      console.error(`Failed to load ${localePath}:`, err);
      process.exit(1);
    }
  }
  if (!translations[defaultLang]) {
    console.error(
      `Default language "${defaultLang}" was not found in ${translationsDir}`
    );
    process.exit(1);
  }
  const result = findMissingTranslations(translations, defaultLang);
  if (result.total === 0) {
    console.log("\x1B[32mling-lint:\x1B[0m All translations are complete!");
    process.exit(0);
  }
  console.log(
    `\x1B[31mling-lint:\x1B[0m Found ${result.total} missing translations:
`
  );
  for (const item of result.missing) {
    console.log(`  [${item.language}] ${item.namespace}.${item.key}`);
  }
  process.exit(1);
}
function parseArgs(args) {
  const first = args[0];
  if (!first) {
    return {
      defaultLang: "en",
      translationsDir: defaultTranslationsDir
    };
  }
  if (looksLikePath(first)) {
    return {
      defaultLang: "en",
      translationsDir: first
    };
  }
  return {
    defaultLang: first,
    translationsDir: args[1] || defaultTranslationsDir
  };
}
function looksLikePath(value) {
  return value.startsWith(".") || value.includes("/") || value.includes("\\") || fs.existsSync(value) && fs.statSync(value).isDirectory();
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
