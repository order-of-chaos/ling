import { defineConfig } from 'tsup';

const packageDependencies = [
  '@orderofchaos/eslint-plugin-ling',
  '@orderofchaos/ling-cli',
  '@orderofchaos/ling-cli/bin',
  '@orderofchaos/ling-cli/lint',
  '@orderofchaos/ling-core',
  '@orderofchaos/ling-react',
  'react',
];

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      cli: 'src/cli.ts',
      'eslint-plugin': 'src/eslint-plugin.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
    external: packageDependencies,
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
    external: packageDependencies,
  },
]);
