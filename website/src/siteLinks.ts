const baseUrl = import.meta.env.BASE_URL;

const githubExamplesBase =
  "https://github.com/order-of-chaos/ling/tree/master/examples";

export const siteLinks = {
  home: baseUrl,
  docsIndex: `${baseUrl}docs/`,
  gettingStarted: `${baseUrl}docs/getting-started/`,
  apiReference: `${baseUrl}docs/api-reference/`,
  customStorage: `${baseUrl}docs/custom-storage/`,
  cli: `${baseUrl}docs/cli/`,
  eslintPlugin: `${baseUrl}docs/eslint-plugin/`,
  examplesIndex: githubExamplesBase,
  examplesBasic: `${githubExamplesBase}/basic`,
  examplesCoreOnly: `${githubExamplesBase}/core-only`,
  examplesUmbrella: `${githubExamplesBase}/umbrella`,
  examplesCustomStorage: `${githubExamplesBase}/custom-storage`,
  examplesCliSetup: `${githubExamplesBase}/cli-setup`,
  examplesEslintFlatConfig: `${githubExamplesBase}/eslint-flat-config`,
  github: "https://github.com/order-of-chaos/ling",
} as const;
