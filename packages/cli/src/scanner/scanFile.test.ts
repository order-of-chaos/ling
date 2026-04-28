import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import { scanFile } from './scanFile';

const tempDirs: string[] = [];

function writeFixture(fileName: string, content: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ling-scan-file-'));
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

describe('scanFile', () => {
  it('extracts nested translation keys from TSX translator arguments', () => {
    const filePath = writeFixture(
      'HomePage.tsx',
      `
        import { initI18nModule } from '@/shared/lib/ling';

        type AppLanguage = 'ru' | 'en';

        const { useI18n } = initI18nModule<AppLanguage>('HomePage');

        export function HomePageView({ hasInitData, restoredSession, commitSha }) {
          const { t } = useI18n();

          return (
            <main>
              <p>
                {t('init payload: {{initPayload}}, сессия: {{sessionState}}', {
                  initPayload: hasInitData ? t('есть') : t('нет init payload'),
                  sessionState: restoredSession ? t('восстановлена') : t('пусто'),
                })}
              </p>
              <p>
                {t('commit: {{commit}}', {
                  commit: commitSha ?? t('нет commit'),
                })}
              </p>
            </main>
          );
        }
      `
    );

    expect(scanFile(filePath)).toEqual({
      HomePage: {
        'init payload: {{initPayload}}, сессия: {{sessionState}}':
          'init payload: {{initPayload}}, сессия: {{sessionState}}',
        есть: 'есть',
        'нет init payload': 'нет init payload',
        восстановлена: 'восстановлена',
        пусто: 'пусто',
        'commit: {{commit}}': 'commit: {{commit}}',
        'нет commit': 'нет commit',
      },
    });
  });
});
