import * as fs from 'fs';
import * as path from 'path';

import type { ScanOptions, ScanResult } from './types';
import { defaultOptions } from './types';
import { scanFile } from './scanFile';

export function scanDirectory(
  dirPath: string,
  options: ScanOptions = {}
): ScanResult {
  const opts = { ...defaultOptions, ...options };
  const result: ScanResult = {};

  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    let scanResult: ScanResult = {};

    if (item.isDirectory()) {
      scanResult = scanDirectory(fullPath, opts);
    } else {
      const ext = item.name.split('.').pop();
      if (ext && opts.extensions.includes(ext)) {
        scanResult = scanFile(fullPath, opts);
      }
    }

    // Merge results
    for (const namespace of Object.keys(scanResult)) {
      if (!result[namespace]) {
        result[namespace] = {};
      }
      Object.assign(result[namespace], scanResult[namespace]);
    }
  }

  return result;
}
