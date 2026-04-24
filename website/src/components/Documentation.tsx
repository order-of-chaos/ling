import {
  Book,
  Code,
  Settings,
  Terminal,
  ExternalLink,
  LucideIcon,
} from "lucide-react";
import { initI18nModule } from "@orderofchaos/ling-react";

const { useI18n } = initI18nModule("Documentation");

interface DocLink {
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

const docs: DocLink[] = [
  {
    titleKey: "gettingStarted",
    descKey: "gettingStartedDesc",
    icon: Book,
    href: "#",
    color: "from-emerald-500 to-teal-500",
  },
  {
    titleKey: "apiReference",
    descKey: "apiReferenceDesc",
    icon: Code,
    href: "#",
    color: "from-blue-500 to-indigo-500",
  },
  {
    titleKey: "customStorage",
    descKey: "customStorageDesc",
    icon: Settings,
    href: "#",
    color: "from-violet-500 to-purple-500",
  },
  {
    titleKey: "cliCommands",
    descKey: "cliCommandsDesc",
    icon: Terminal,
    href: "#",
    color: "from-orange-500 to-amber-500",
  },
];

interface ApiRef {
  title: string;
  descKey: string;
  code: string;
}

const apiReference: ApiRef[] = [
  {
    title: "I18nProvider",
    descKey: "providerDesc",
    code: `<I18nProvider
  translations={translations}
  defaultLanguage="en"
  storage={customStorage}
>
  {children}
</I18nProvider>`,
  },
  {
    title: "initI18nModule",
    descKey: "initModuleDesc",
    code: `const { useI18n } = initI18nModule('ComponentName');

// Returns hook for translations
const { t, language, changeLanguage } = useI18n();`,
  },
  {
    title: "t() function",
    descKey: "tFunctionDesc",
    code: `t('Hello')                    // → "Привет"
t('Hello, {{name}}!', { name: 'World' })  // → "Привет, World!"
t('Missing key')              // → "Missing key" (fallback)`,
  },
  {
    title: "Storage Interface",
    descKey: "storageDesc",
    code: `interface I18nStorage<L extends string = string> {
  getLanguage(): L | null;
  setLanguage(lang: L): void;
  subscribe?(callback: (lang: L | null) => void): () => void;
}`,
  },
];

export function Documentation() {
  const { t } = useI18n();

  const getDocTitle = (key: string) => {
    switch (key) {
      case "gettingStarted":
        return t("gettingStarted");
      case "apiReference":
        return t("apiReference");
      case "customStorage":
        return t("customStorage");
      case "cliCommands":
        return t("cliCommands");
      default:
        return key;
    }
  };

  const getDocDesc = (key: string) => {
    switch (key) {
      case "gettingStartedDesc":
        return t("gettingStartedDesc");
      case "apiReferenceDesc":
        return t("apiReferenceDesc");
      case "customStorageDesc":
        return t("customStorageDesc");
      case "cliCommandsDesc":
        return t("cliCommandsDesc");
      default:
        return key;
    }
  };

  const getApiDesc = (key: string) => {
    switch (key) {
      case "providerDesc":
        return t("providerDesc");
      case "initModuleDesc":
        return t("initModuleDesc");
      case "tFunctionDesc":
        return t("tFunctionDesc");
      case "storageDesc":
        return t("storageDesc");
      default:
        return key;
    }
  };

  return (
    <section id="documentation" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-primary-400">
            Documentation
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t("title")}
          </p>
          <p className="mt-6 text-lg text-slate-400">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {docs.map((doc) => (
            <a
              key={doc.titleKey}
              href={doc.href}
              className="group glass rounded-2xl p-6 transition-all hover:bg-white/10 hover:scale-105"
            >
              <div
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${doc.color}`}
              >
                <doc.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                {getDocTitle(doc.titleKey)}
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                {getDocDesc(doc.descKey)}
              </p>
            </a>
          ))}
        </div>

        <div className="mt-20">
          <h3 className="text-2xl font-bold text-white text-center mb-12">
            {t("quickApiReference")}
          </h3>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 max-w-5xl mx-auto">
            {apiReference.map((api) => (
              <div key={api.title} className="code-block">
                <div className="px-4 py-3 border-b border-slate-700/50">
                  <h4 className="font-semibold text-white">{api.title}</h4>
                  <p className="text-xs text-slate-400">
                    {getApiDesc(api.descKey)}
                  </p>
                </div>
                <pre className="p-4 text-sm overflow-x-auto">
                  <code className="text-slate-300">{api.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <a
            href="https://github.com/order-of-chaos/ling"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-primary-500/25 transition-all hover:shadow-primary-500/40"
          >
            {t("viewFullDocs")}
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
