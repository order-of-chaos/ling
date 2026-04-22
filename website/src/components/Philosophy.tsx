import { BookOpen, Search, Rocket, CheckCircle } from "lucide-react";
import { initI18nModule } from "@orderofchaos/ling-react";

const { useI18n } = initI18nModule("Philosophy");

export function Philosophy() {
  const { t } = useI18n();

  return (
    <section id="philosophy" className="py-24 sm:py-32 bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-primary-400">Philosophy</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t("Key = Text")}
          </p>
          <p className="mt-6 text-lg text-slate-400">
            {t("Unlike traditional i18n libraries, Ling uses the actual text as the key. Your code becomes self-documenting.")}
          </p>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="code-block">
              <div className="px-4 py-3 border-b border-slate-700/50 flex items-center gap-2">
                <span className="text-red-400">✗</span>
                <span className="text-sm text-slate-400">{t("Traditional approach")}</span>
              </div>
              <pre className="p-4 text-sm overflow-x-auto">
                <code className="text-slate-400">
{`// What does this text say? 🤔
t('hero.title')
t('errors.validation.required')
t('buttons.submit.loading')`}
                </code>
              </pre>
            </div>

            <div className="code-block border-primary-500/50">
              <div className="px-4 py-3 border-b border-slate-700/50 flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span className="text-sm text-slate-400">{t("Ling approach")}</span>
              </div>
              <pre className="p-4 text-sm overflow-x-auto">
                <code className="text-emerald-300">
{`// Crystal clear! ✨
t('The best i18n library')
t('This field is required')
t('Submitting...')`}
                </code>
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          <div className="glass rounded-2xl p-6 text-center">
            <BookOpen className="h-8 w-8 text-primary-400 mx-auto mb-4" />
            <h3 className="font-semibold text-white">{t("Self-documenting")}</h3>
            <p className="mt-2 text-sm text-slate-400">
              {t("See the actual text right in your code")}
            </p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <Search className="h-8 w-8 text-primary-400 mx-auto mb-4" />
            <h3 className="font-semibold text-white">{t("Easy to find")}</h3>
            <p className="mt-2 text-sm text-slate-400">
              {t("Search for any text and find it instantly")}
            </p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <Rocket className="h-8 w-8 text-primary-400 mx-auto mb-4" />
            <h3 className="font-semibold text-white">{t("No key management")}</h3>
            <p className="mt-2 text-sm text-slate-400">
              {t("CLI extracts keys automatically")}
            </p>
          </div>
          <div className="glass rounded-2xl p-6 text-center">
            <CheckCircle className="h-8 w-8 text-primary-400 mx-auto mb-4" />
            <h3 className="font-semibold text-white">{t("Never forget")}</h3>
            <p className="mt-2 text-sm text-slate-400">
              {t("Linter catches missing translations")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
