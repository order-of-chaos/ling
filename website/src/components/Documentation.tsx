import {
  Book,
  Code,
  Settings,
  Terminal,
  ShieldCheck,
  ExternalLink,
  LucideIcon,
} from "lucide-react";
import { initI18nModule } from "@orderofchaos/ling-react";
import { siteLinks } from "../siteLinks";

const { useI18n } = initI18nModule("Documentation");

interface DocLink {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

export function Documentation() {
  const { t } = useI18n();
  const docs: DocLink[] = [
    {
      title: t("gettingStarted"),
      description: t("gettingStartedDesc"),
      icon: Book,
      href: siteLinks.gettingStarted,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: t("apiReference"),
      description: t("apiReferenceDesc"),
      icon: Code,
      href: siteLinks.apiReference,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: t("customStorage"),
      description: t("customStorageDesc"),
      icon: Settings,
      href: siteLinks.customStorage,
      color: "from-violet-500 to-purple-500",
    },
    {
      title: t("cliCommands"),
      description: t("cliCommandsDesc"),
      icon: Terminal,
      href: siteLinks.cli,
      color: "from-orange-500 to-amber-500",
    },
    {
      title: t("eslintPlugin"),
      description: t("eslintPluginDesc"),
      icon: ShieldCheck,
      href: siteLinks.eslintPlugin,
      color: "from-pink-500 to-rose-500",
    },
  ];

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

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5 max-w-6xl mx-auto">
          {docs.map((doc) => (
            <a
              key={doc.href}
              href={doc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group glass rounded-2xl p-6 transition-all hover:bg-white/10 hover:scale-105"
            >
              <div
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${doc.color}`}
              >
                <doc.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                {doc.title}
              </h3>
              <p className="mt-1 text-sm text-slate-400">{doc.description}</p>
            </a>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href={siteLinks.docsIndex}
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
