// src/I18nProvider.tsx
import { useState, useCallback, useEffect, useMemo } from "react";
import {
  createLocalStorage
} from "@orderofchaos/ling-core";

// src/I18nContext.ts
import { createContext, useContext } from "react";
var I18nContext = createContext(null);
function useI18nContext() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18nContext must be used within I18nProvider");
  }
  return context;
}

// src/I18nProvider.tsx
import { jsx } from "react/jsx-runtime";
function detectBrowserLanguage(supported, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }
  const browserLang = window.navigator?.language?.split("-")[0];
  if (browserLang && supported.includes(browserLang)) {
    return browserLang;
  }
  return fallback;
}
function I18nProvider({
  children,
  translations,
  defaultLanguage = "en",
  storage: customStorage,
  supportedLanguages
}) {
  const storage = useMemo(
    () => customStorage ?? createLocalStorage(),
    [customStorage]
  );
  const supported = supportedLanguages ?? Object.keys(translations);
  const [language, setLanguage] = useState(() => {
    const stored = storage.getLanguage();
    if (stored) {
      return stored;
    }
    return detectBrowserLanguage(supported, defaultLanguage);
  });
  useEffect(() => {
    if (!storage.subscribe) {
      return;
    }
    const unsubscribe = storage.subscribe((lang) => {
      if (lang && lang !== language) {
        setLanguage(lang);
      }
    });
    return unsubscribe;
  }, [storage, language]);
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);
  const changeLanguage = useCallback(
    (lang) => {
      storage.setLanguage(lang);
      setLanguage(lang);
    },
    [storage]
  );
  const contextValue = useMemo(
    () => ({
      language,
      translations,
      storage,
      changeLanguage
    }),
    [language, translations, storage, changeLanguage]
  );
  return /* @__PURE__ */ jsx(I18nContext.Provider, { value: contextValue, children });
}

// src/initI18nModule.ts
import { useCallback as useCallback2, useMemo as useMemo2 } from "react";
import { createTranslator, createNoun } from "@orderofchaos/ling-core";
function initI18nModule(namespace) {
  const useI18n = () => {
    const { language, translations, changeLanguage } = useI18nContext();
    const t = useCallback2(
      (key, replace) => {
        const translator = createTranslator({
          translations,
          namespace,
          getLanguage: () => language,
          onMissingKey: (ns, k) => {
            console.warn(`[i18n] Missing translation: ${ns}.${k}`);
          }
        });
        return translator(key, replace);
      },
      [language, translations]
    );
    const noun = useMemo2(() => createNoun(language), [language]);
    return {
      t,
      noun,
      language,
      changeLanguage
    };
  };
  return { useI18n };
}

// src/index.ts
export * from "@orderofchaos/ling-core";
export {
  I18nProvider,
  initI18nModule,
  useI18nContext
};
//# sourceMappingURL=index.js.map