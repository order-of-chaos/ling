import * as fs from "fs";
import * as path from "path";

import { Lang } from "@orderofchaos/ling-core";

import { findMissingTranslations } from "./linter";

async function main() {
  const args = process.argv.slice(2);
  const validLangs = Object.values(Lang);

  // First arg can be either a lang or a directory
  const firstArgIsLang = validLangs.includes(args[0] as Lang);
  const defaultLang = firstArgIsLang ? (args[0] as Lang) : Lang.en;
  const translationsDir = firstArgIsLang
    ? args[1] || "src/i18n/translations"
    : args[0] || "src/i18n/translations";

  console.log(
    `\x1b[32mling-lint:\x1b[0m Checking translations (default: ${defaultLang})...`,
  );

  const translations: Record<
    Lang,
    Record<string, Record<string, string>>
  > = {} as Record<Lang, Record<string, Record<string, string>>>;

  for (const locale of Object.values(Lang)) {
    const localePath = path.join(translationsDir, `${locale}.ts`);

    if (fs.existsSync(localePath)) {
      try {
        const module = await import(path.resolve(localePath));
        translations[locale] = module.default || module[locale] || {};
      } catch (err) {
        console.error(`Failed to load ${localePath}:`, err);
        process.exit(1);
      }
    }
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
