import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
    external: ['typescript'],
  },
  {
    entry: {
      bin: 'src/bin.ts',
      lint: 'src/lint.ts',
    },
    format: ['esm'],
    clean: false,
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]);
