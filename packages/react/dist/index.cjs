"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  I18nProvider: () => I18nProvider,
  initI18nModule: () => initI18nModule,
  useI18nContext: () => useI18nContext
});
module.exports = __toCommonJS(index_exports);

// src/I18nProvider.tsx
var import_react2 = require("react");
var import_ling_core = require("@orderofchaos/ling-core");

// src/I18nContext.ts
var import_react = require("react");
var I18nContext = (0, import_react.createContext)(null);
function useI18nContext() {
  const context = (0, import_react.useContext)(I18nContext);
  if (!context) {
    throw new Error("useI18nContext must be used within I18nProvider");
  }
  return context;
}

// src/I18nProvider.tsx
var import_jsx_runtime = require("react/jsx-runtime");
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
  const storage = (0, import_react2.useMemo)(
    () => customStorage ?? (0, import_ling_core.createLocalStorage)(),
    [customStorage]
  );
  const supported = supportedLanguages ?? Object.keys(translations);
  const [language, setLanguage] = (0, import_react2.useState)(() => {
    const stored = storage.getLanguage();
    if (stored) {
      return stored;
    }
    return detectBrowserLanguage(supported, defaultLanguage);
  });
  (0, import_react2.useEffect)(() => {
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
  (0, import_react2.useEffect)(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);
  const changeLanguage = (0, import_react2.useCallback)(
    (lang) => {
      storage.setLanguage(lang);
      setLanguage(lang);
    },
    [storage]
  );
  const contextValue = (0, import_react2.useMemo)(
    () => ({
      language,
      translations,
      storage,
      changeLanguage
    }),
    [language, translations, storage, changeLanguage]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I18nContext.Provider, { value: contextValue, children });
}

// src/initI18nModule.ts
var import_react3 = require("react");
var import_ling_core2 = require("@orderofchaos/ling-core");
function initI18nModule(namespace) {
  const useI18n = () => {
    const { language, translations, changeLanguage } = useI18nContext();
    const t = (0, import_react3.useCallback)(
      (key, replace) => {
        const translator = (0, import_ling_core2.createTranslator)({
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
    const noun = (0, import_react3.useMemo)(() => (0, import_ling_core2.createNoun)(language), [language]);
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
__reExport(index_exports, require("@orderofchaos/ling-core"), module.exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  I18nProvider,
  initI18nModule,
  useI18nContext,
  ...require("@orderofchaos/ling-core")
});
//# sourceMappingURL=index.cjs.map