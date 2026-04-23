import * as fs from "fs";
import * as path from "path";

import { findMissingTranslations } from "./linter";
import {
  getLocaleFromFileName,
  isTranslationFile,
  loadTranslationsFile,
} from "./utils/loadTranslations";

const defaultTranslationsDir = "src/i18n/translations";

interface LintArgs {
  defaultLang: string;
  translationsDir: string;
}

async function main() {
  const { defaultLang, translationsDir } = parseArgs(process.argv.slice(2));

  console.log(
    `\x1b[32mling-lint:\x1b[0m Checking translations (default: ${defaultLang})...`,
  );

  if (!fs.existsSync(translationsDir)) {
    console.error(`Translations directory not found: ${translationsDir}`);
    process.exit(1);
  }

  const translations: Record<string, Record<string, Record<string, string>>> =
    {};

  for (const file of fs.readdirSync(translationsDir)) {
    if (!isTranslationFile(file)) {
      continue;
    }

    const locale = getLocaleFromFileName(file);
    const localePath = path.join(translationsDir, file);

    try {
      translations[locale] = await loadTranslationsFile(
        path.resolve(localePath),
        locale,
      );
    } catch (err) {
      console.error(`Failed to load ${localePath}:`, err);
      process.exit(1);
    }
  }

  if (!translations[defaultLang]) {
    console.error(
      `Default language "${defaultLang}" was not found in ${translationsDir}`,
    );
    process.exit(1);
  }

  const result = findMissingTranslations(translations, defaultLang);

  if (result.total === 0) {
    console.log("\x1b[32mling-lint:\x1b[0m All translations are complete!");
    process.exit(0);
  }

  console.log(
    `\x1b[31mling-lint:\x1b[0m Found ${result.total} missing translations:\n`,
  );

  for (const item of result.missing) {
    console.log(`  [${item.language}] ${item.namespace}.${item.key}`);
  }

  process.exit(1);
}

function parseArgs(args: string[]): LintArgs {
  const first = args[0];

  if (!first) {
    return {
      defaultLang: "en",
      translationsDir: defaultTranslationsDir,
    };
  }

  if (looksLikePath(first)) {
    return {
      defaultLang: "en",
      translationsDir: first,
    };
  }

  return {
    defaultLang: first,
    translationsDir: args[1] || defaultTranslationsDir,
  };
}

function looksLikePath(value: string): boolean {
  return (
    value.startsWith(".") ||
    value.includes("/") ||
    value.includes("\\") ||
    (fs.existsSync(value) && fs.statSync(value).isDirectory())
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
