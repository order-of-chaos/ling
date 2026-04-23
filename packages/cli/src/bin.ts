import * as fs from 'fs';
import * as path from 'path';

import { scanDirectory } from './scanner/scanDirectory';
import { sortObjectKeys } from './utils/sortObjectKeys';
import { loadTranslationsFile } from './utils/loadTranslations';
import type { ScanResult } from './scanner/types';

interface Config {
  outDir: string;
  locales: string[];
  originalLocale: string;
}

const defaultConfig: Config = {
  outDir: 'src/i18n/translations',
  locales: ['ru', 'en'],
  originalLocale: 'ru',
};

async function main() {
  const args = process.argv.slice(2);
  const scanPath = args[0] || 'src';

  console.log(`\x1b[32mling-scan:\x1b[0m Scanning ${scanPath} for translations...`);

  const scanResult = scanDirectory(scanPath);
  const config = loadConfig() || defaultConfig;

  if (!fs.existsSync(config.outDir)) {
    fs.mkdirSync(config.outDir, { recursive: true });
  }

  for (const locale of config.locales) {
    await processLocale(locale, scanResult, config);
  }

  console.log('\x1b[32mling-scan:\x1b[0m Done!');
}

function loadConfig(): Config | null {
  const configPath = path.join(process.cwd(), 'ling.config.json');

  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, 'utf8');
      return { ...defaultConfig, ...JSON.parse(content) };
    } catch {
      console.warn('Failed to load ling.config.json, using defaults');
    }
  }

  return null;
}

async function processLocale(
  locale: string,
  scanResult: ScanResult,
  config: Config
) {
  const localePath = path.join(config.outDir, `${locale}.ts`);
  let previousResult: ScanResult = {};

  if (fs.existsSync(localePath)) {
    try {
      previousResult = await loadTranslationsFile(
        path.resolve(localePath),
        locale
      );
    } catch {
      // File exists but couldn't be imported
    }
  }

  const localeResult: ScanResult = {};
  const newPhrases: ScanResult = {};
  const newModules: string[] = [];

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

        localeResult[namespace][key] =
          previousResult[namespace][key] || scanResult[namespace][key];
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

  fs.writeFileSync(localePath, content);
  console.log(`  \x1b[36m${locale}\x1b[0m: ${localePath}`);

  if (newModules.length > 0) {
    console.log(`    New namespaces: ${newModules.join(', ')}`);
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
