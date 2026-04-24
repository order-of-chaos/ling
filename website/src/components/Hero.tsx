import { ArrowRight, Sparkles, Zap, Package } from "lucide-react";
import { initI18nModule } from "@orderofchaos/ling-react";

const { useI18n } = initI18nModule("Hero");

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-slate-950 to-accent-950" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-dot-pattern opacity-50" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm">
          <Sparkles className="h-4 w-4 text-accent-400" />
          <span className="text-slate-300">{t("badge")}</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
          <span className="block text-white">{t("headline1")}</span>
          <span className="block gradient-text">{t("headline2")}</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-400 sm:text-xl">
          {t("subheadline")}
        </p>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-center">
          <div className="glass rounded-2xl px-6 py-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary-400" />
              <span className="text-2xl font-bold text-white">~3kb</span>
            </div>
            <span className="text-sm text-slate-400">{t("gzipped")}</span>
          </div>
          <div className="glass rounded-2xl px-6 py-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent-400" />
              <span className="text-2xl font-bold text-white">0</span>
            </div>
            <span className="text-sm text-slate-400">{t("dependencies")}</span>
          </div>
          <div className="glass rounded-2xl px-6 py-4">
            <div className="text-2xl font-bold text-white">100%</div>
            <span className="text-sm text-slate-400">TypeScript</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#installation"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-primary-500/25 transition-all hover:shadow-primary-500/40"
          >
            {t("getStarted")}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#examples"
            className="flex items-center gap-2 rounded-xl glass px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
          >
            {t("seeExamples")}
          </a>
        </div>

        {/* Code Preview */}
        <div className="mt-16 mx-auto max-w-3xl">
          <div className="code-block text-left">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-slate-500">
                MyComponent.tsx
              </span>
            </div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code className="text-slate-300">
                {`const { useI18n } = initI18nModule('MyComponent');

function MyComponent() {
  const { t, language, changeLanguage } = useI18n();

  return (
    <div>
      <h1>{t('Welcome to our app!')}</h1>
      <p>{t('Hello, {{name}}!', { name: 'World' })}</p>
      <button onClick={() => changeLanguage('ru')}>
        🇷🇺 Русский
      </button>
    </div>
  );
}`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
