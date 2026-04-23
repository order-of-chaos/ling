import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { initI18nModule } from "@orderofchaos/ling-react";

const { useI18n } = initI18nModule("Installation");

const installCommands = {
  pnpm: "pnpm add @orderofchaos/ling",
  npm: "npm install @orderofchaos/ling",
  yarn: "yarn add @orderofchaos/ling",
};

export function Installation() {
  const { t } = useI18n();
  const [packageManager, setPackageManager] = useState<"pnpm" | "npm" | "yarn">(
    "pnpm",
  );
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installCommands[packageManager]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="installation" className="py-24 sm:py-32 bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-primary-400">
            Installation
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t("title")}
          </p>
          <p className="mt-6 text-lg text-slate-400">{t("subtitle")}</p>
        </div>

        <div className="mt-12 max-w-xl mx-auto">
          <div className="flex gap-2 mb-4 justify-center">
            {(["pnpm", "npm", "yarn"] as const).map((pm) => (
              <button
                key={pm}
                onClick={() => setPackageManager(pm)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  packageManager === pm
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {pm}
              </button>
            ))}
          </div>

          <div className="code-block">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Terminal className="h-5 w-5 text-slate-500" />
                <code className="text-slate-300">
                  {installCommands[packageManager]}
                </code>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm">{t("copied")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span className="text-sm">{t("copy")}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 max-w-6xl mx-auto">
          <div className="glass rounded-2xl p-6 text-center border-primary-500/50 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 rounded-full text-xs font-semibold text-white">
              {t("recommended")}
            </div>
            <div className="text-base font-bold text-white mb-2 break-words">
              @orderofchaos/ling
            </div>
            <p className="text-sm text-slate-400 mb-4">{t("completeDesc")}</p>
            <code className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
              {t("fullToolkit")}
            </code>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-base font-bold text-white mb-2 break-words">
              @orderofchaos/ling-core
            </div>
            <p className="text-sm text-slate-400 mb-4">{t("coreDesc")}</p>
            <code className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
              ~1kb gzipped
            </code>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-base font-bold text-white mb-2 break-words">
              @orderofchaos/ling-react
            </div>
            <p className="text-sm text-slate-400 mb-4">{t("reactDesc")}</p>
            <code className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
              ~3kb gzipped
            </code>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-base font-bold text-white mb-2 break-words">
              @orderofchaos/ling-cli
            </div>
            <p className="text-sm text-slate-400 mb-4">{t("cliDesc")}</p>
            <code className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
              ~8kb gzipped
            </code>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-base font-bold text-white mb-2 break-words">
              @orderofchaos/eslint-plugin-ling
            </div>
            <p className="text-sm text-slate-400 mb-4">{t("eslintDesc")}</p>
            <code className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
              {t("lintRules")}
            </code>
          </div>
        </div>
      </div>
    </section>
  );
}
