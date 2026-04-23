import { useState } from "react";
import { initI18nModule } from "@orderofchaos/ling-react";

const { useI18n } = initI18nModule("CodeExamples");

interface Example {
  id: string;
  titleKey: string;
  descKey: string;
  code: string;
}

const examples: Example[] = [
  {
    id: "basic",
    titleKey: "basicUsage",
    descKey: "basicUsageDesc",
    code: `import { I18nProvider, initI18nModule, Lang } from '@orderofchaos/ling';

// Initialize module for component
const { useI18n } = initI18nModule('Greeting');

function Greeting() {
  const { t, changeLanguage } = useI18n();

  return (
    <div>
      <h1>{t('Hello, World!')}</h1>
      <button onClick={() => changeLanguage(Lang.ru)}>
        🇷🇺
      </button>
    </div>
  );
}

// Wrap your app
function App() {
  return (
    <I18nProvider translations={translations} defaultLanguage={Lang.en}>
      <Greeting />
    </I18nProvider>
  );
}`,
  },
  {
    id: "placeholders",
    titleKey: "placeholders",
    descKey: "placeholdersDesc",
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
    titleKey: "customStorage",
    descKey: "customStorageDesc",
    code: `import { createLocalStorage, createMemoryStorage } from '@orderofchaos/ling';

// localStorage (default, persists across sessions)
const localStorage = createLocalStorage({ key: 'my_app_lang' });

// Memory storage (for SSR or testing)
const memoryStorage = createMemoryStorage(Lang.en);

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
    titleKey: "cliExtraction",
    descKey: "cliExtractionDesc",
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

export function CodeExamples() {
  const { t } = useI18n();
  const [activeExample, setActiveExample] = useState(examples[0].id);
  const currentExample = examples.find((e) => e.id === activeExample)!;

  const getTitle = (key: string) => {
    switch (key) {
      case "basicUsage":
        return t("basicUsage");
      case "placeholders":
        return t("placeholders");
      case "customStorage":
        return t("customStorage");
      case "cliExtraction":
        return t("cliExtraction");
      default:
        return key;
    }
  };

  const getDesc = (key: string) => {
    switch (key) {
      case "basicUsageDesc":
        return t("basicUsageDesc");
      case "placeholdersDesc":
        return t("placeholdersDesc");
      case "customStorageDesc":
        return t("customStorageDesc");
      case "cliExtractionDesc":
        return t("cliExtractionDesc");
      default:
        return key;
    }
  };

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
                {getTitle(example.titleKey)}
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
                  {getDesc(currentExample.descKey)}
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
      </div>
    </section>
  );
}
