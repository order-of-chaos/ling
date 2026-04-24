import { useState } from "react";
import { Menu, X, Github, Languages } from "lucide-react";
import { initI18nModule } from "@orderofchaos/ling-react";
import type { WebsiteLang } from "../i18n";

const { useI18n } = initI18nModule<WebsiteLang>("Header");

const languageLabels: Record<WebsiteLang, string> = {
  en: "🇬🇧 EN",
  ru: "🇷🇺 RU",
  pt: "🇧🇷 PT",
};

const languages: WebsiteLang[] = ["en", "ru", "pt"];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language, changeLanguage } = useI18n();

  const navigation = [
    { name: t("features"), href: "#features" },
    { name: t("comparison"), href: "#comparison" },
    { name: t("examples"), href: "#examples" },
    { name: t("docs"), href: "#documentation" },
  ];

  const toggleLanguage = () => {
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    changeLanguage(languages[nextIndex]);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Global">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
              <Languages className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">Ling</span>
          </div>

          <div className="hidden md:flex md:gap-x-8">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white hover:bg-white/5"
            >
              {languageLabels[language]}
            </button>
            <a
              href="https://github.com/order-of-chaos/ling"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              <Github className="h-5 w-5" />
              GitHub
            </a>
            <a
              href="#installation"
              className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-400 hover:shadow-primary-500/40"
            >
              {t("getStarted")}
            </a>
          </div>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              <button
                onClick={toggleLanguage}
                className="text-left text-base font-medium text-slate-300 hover:text-white"
              >
                {languageLabels[language]}
              </button>
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-base font-medium text-slate-300 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
