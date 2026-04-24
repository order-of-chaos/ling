import { Languages, Github, Heart } from "lucide-react";
import { initI18nModule } from "@orderofchaos/ling-react";
import { siteLinks } from "../siteLinks";

const { useI18n } = initI18nModule("Footer");

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-slate-800 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
              <Languages className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Ling</span>
              <p className="text-xs text-slate-400">{t("tagline")}</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">
              {t("features")}
            </a>
            <a
              href="#comparison"
              className="hover:text-white transition-colors"
            >
              {t("comparison")}
            </a>
            <a href="#examples" className="hover:text-white transition-colors">
              {t("examples")}
            </a>
            <a
              href={siteLinks.docsIndex}
              className="hover:text-white transition-colors"
            >
              {t("docs")}
            </a>
            <a
              href={siteLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col items-center gap-2 text-center text-sm text-slate-500">
          <p className="flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500" /> by Order of
            Chaos
          </p>
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
