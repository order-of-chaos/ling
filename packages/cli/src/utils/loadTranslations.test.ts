import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  getLocaleFromFileName,
  isTranslationFile,
  loadTranslationsFile,
} from './loadTranslations';

const tempDirs: string[] = [];

function writeFixture(fileName: string, content: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ling-translations-'));
  tempDirs.push(dir);

  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, content);
  return filePath;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe('loadTranslationsFile', () => {
  it('loads generated TypeScript translation files', async () => {
    const filePath = writeFixture(
      'de.ts',
      `export const de = {
        Header: {
          Hello: 'Hallo',
        },
      };

      export default de;
      `
    );

    await expect(loadTranslationsFile(filePath, 'de')).resolves.toEqual({
      Header: {
        Hello: 'Hallo',
      },
    });
  });

  it('loads JSON translation files', async () => {
    const filePath = writeFixture(
      'en.json',
      JSON.stringify({ Header: { Hello: 'Hello' } })
    );

    await expect(loadTranslationsFile(filePath, 'en')).resolves.toEqual({
      Header: {
        Hello: 'Hello',
      },
    });
  });
});

describe('translation file helpers', () => {
  it('detects supported translation files', () => {
    expect(isTranslationFile('en.ts')).toBe(true);
    expect(isTranslationFile('en.json')).toBe(true);
    expect(isTranslationFile('en.d.ts')).toBe(false);
    expect(isTranslationFile('README.md')).toBe(false);
  });

  it('extracts locale names from file names', () => {
    expect(getLocaleFromFileName('pt.ts')).toBe('pt');
    expect(getLocaleFromFileName('zh-CN.json')).toBe('zh-CN');
  });
});
