import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { initI18nModule } from "@orderofchaos/ling-react";
import { siteLinks } from "../siteLinks";

const { useI18n } = initI18nModule("CodeExamples");

interface Example {
  id: string;
  title: string;
  description: string;
  code: string;
}

interface RepoExample {
  title: string;
  description: string;
  href: string;
}

const exampleDefinitions = [
  {
    id: "basic",
    code: `import { I18nProvider, initI18nModule } from '@orderofchaos/ling';

// Initialize module for component
const { useI18n } = initI18nModule('Greeting');

function Greeting() {
  const { t, changeLanguage } = useI18n();

  return (
    <div>
      <h1>{t('Hello, World!')}</h1>
      <button onClick={() => changeLanguage('ru')}>
        🇷🇺
      </button>
    </div>
  );
}

// Wrap your app
function App() {
  return (
    <I18nProvider translations={translations} defaultLanguage="en">
      <Greeting />
    </I18nProvider>
  );
}`,
  },
  {
    id: "placeholders",
    code: `const { useI18n } = initI18nModule('Profile');

function Profile({ user }) {
  const { t } = useI18n();

  return (
    <div>
      <h1>{t('Welcome, {{name}}!', { name: user.name })}</h1>
      <p>{t('You have {{count}} messages', { count: user.messages })}</p>
      <p>{t('Last login: {{date}}', { date: user.lastLogin })}</p>
    </div>
  );
}

// translations/ru.ts
export const ru = {
  Profile: {
    'Welcome, {{name}}!': 'Добро пожаловать, {{name}}!',
    'You have {{count}} messages': 'У вас {{count}} сообщений',
    'Last login: {{date}}': 'Последний вход: {{date}}',
  },
};`,
  },
  {
    id: "storage",
    code: `import { createLocalStorage, createMemoryStorage } from '@orderofchaos/ling';

// localStorage (default, persists across sessions)
const localStorage = createLocalStorage({ key: 'my_app_lang' });

// Memory storage (for SSR or testing)
const memoryStorage = createMemoryStorage('en');

// Custom storage (e.g., AsyncStorage for React Native)
const asyncStorage: I18nStorage = {
  getLanguage: () => cachedLang,
  setLanguage: (lang) => {
    cachedLang = lang;
    AsyncStorage.setItem('lang', lang);
  },
};

// Use in provider
<I18nProvider 
  translations={translations} 
  storage={asyncStorage}
>
  <App />
</I18nProvider>`,
  },
  {
    id: "cli",
    code: `# Install Ling
pnpm add @orderofchaos/ling

# Scan source code for t() calls
pnpm ling-scan src

# Output: src/i18n/translations/ru.ts
export const ru = {
  Greeting: {
    'Hello, World!': 'Hello, World!',  // ← Fill in translation
  },
  Profile: {
    'Welcome, {{name}}!': 'Welcome, {{name}}!',
    'You have {{count}} messages': 'You have {{count}} messages',
  },
};

# Check for missing translations
pnpm ling-lint ru

# Output:
# ❌ [en] Profile.Welcome, {{name}}!
# ❌ [en] Profile.You have {{count}} messages`,
  },
];

const repoExampleDefinitions = [
  {
    href: siteLinks.examplesBasic,
  },
  {
    href: siteLinks.examplesCoreOnly,
  },
  {
    href: siteLinks.examplesUmbrella,
  },
  {
    href: siteLinks.examplesCustomStorage,
  },
  {
    href: siteLinks.examplesCliSetup,
  },
  {
    href: siteLinks.examplesEslintFlatConfig,
  },
];

export function CodeExamples() {
  const { t } = useI18n();
  const examples: Example[] = [
    {
      ...exampleDefinitions[0],
      title: t("basicUsage"),
      description: t("basicUsageDesc"),
    },
    {
      ...exampleDefinitions[1],
      title: t("placeholders"),
      description: t("placeholdersDesc"),
    },
    {
      ...exampleDefinitions[2],
      title: t("customStorage"),
      description: t("customStorageDesc"),
    },
    {
      ...exampleDefinitions[3],
      title: t("cliExtraction"),
      description: t("cliExtractionDesc"),
    },
  ];
  const repoExamples: RepoExample[] = [
    {
      ...repoExampleDefinitions[0],
      title: t("basicAppExample"),
      description: t("basicAppExampleDesc"),
    },
    {
      ...repoExampleDefinitions[1],
      title: t("coreOnlyExample"),
      description: t("coreOnlyExampleDesc"),
    },
    {
      ...repoExampleDefinitions[2],
      title: t("umbrellaExample"),
      description: t("umbrellaExampleDesc"),
    },
    {
      ...repoExampleDefinitions[3],
      title: t("customStorageExample"),
      description: t("customStorageExampleDesc"),
    },
    {
      ...repoExampleDefinitions[4],
      title: t("cliSetupExample"),
      description: t("cliSetupExampleDesc"),
    },
    {
      ...repoExampleDefinitions[5],
      title: t("eslintFlatConfigExample"),
      description: t("eslintFlatConfigExampleDesc"),
    },
  ];
  const [activeExample, setActiveExample] = useState(examples[0].id);
  const currentExample = examples.find((e) => e.id === activeExample)!;

  return (
    <section id="examples" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-primary-400">Examples</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t("title")}
          </p>
          <p className="mt-6 text-lg text-slate-400">{t("subtitle")}</p>
        </div>

        <div className="mt-16">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {examples.map((example) => (
              <button
                key={example.id}
                onClick={() => setActiveExample(example.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeExample === example.id
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                    : "glass text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {example.title}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="code-block">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-slate-500">
                  {currentExample.description}
                </span>
              </div>
              <pre className="p-6 text-sm overflow-x-auto max-h-[500px]">
                <code className="text-slate-300 whitespace-pre">
                  {currentExample.code}
                </code>
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-16 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white">
              {t("repoExamplesTitle")}
            </h3>
            <p className="mt-3 text-slate-400">{t("repoExamplesSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {repoExamples.map((example) => (
              <a
                key={example.href}
                href={example.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass rounded-2xl p-6 transition-all hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                      {example.title}
                    </h4>
                    <p className="mt-2 text-sm text-slate-400">
                      {example.description}
                    </p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href={siteLinks.examplesIndex}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              {t("browseAllExamples")}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
