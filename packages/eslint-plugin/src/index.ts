import requireLiteralKeys from './rules/require-literal-keys';

const plugin = {
  meta: {
    name: '@orderofchaos/eslint-plugin-ling',
    version: '0.1.0',
  },
  rules: {
    'require-literal-keys': requireLiteralKeys,
  },
  configs: {
    recommended: {
      plugins: ['@orderofchaos/ling'],
      rules: {
        '@orderofchaos/ling/require-literal-keys': 'error',
      },
    },
  },
};

export = plugin;
