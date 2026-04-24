import type { I18nStorage } from "@orderofchaos/ling";

export type AppLang = "en" | "ru";

function readLanguage(): AppLang | null {
  const value = new URLSearchParams(window.location.search).get("lang");
  return value === "en" || value === "ru" ? value : null;
}

export function createUrlStorage(): I18nStorage<AppLang> {
  const listeners = new Set<(lang: AppLang | null) => void>();

  const notify = (lang: AppLang | null) => {
    listeners.forEach((listener) => listener(lang));
  };

  window.addEventListener("popstate", () => {
    notify(readLanguage());
  });

  return {
    getLanguage() {
      return readLanguage();
    },
    setLanguage(lang) {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", lang);
      window.history.pushState({}, "", url);
      notify(lang);
    },
    subscribe(callback) {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
  };
}
