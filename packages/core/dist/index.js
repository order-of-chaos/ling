// src/types.ts
var LocalStorageLangKey = "MA_lang";
var Lang = /* @__PURE__ */ ((Lang2) => {
  Lang2["ru"] = "ru";
  Lang2["en"] = "en";
  Lang2["pt"] = "pt";
  return Lang2;
})(Lang || {});
var LangNames = {
  en: "English",
  ru: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
  pt: "Portugu\xEAs",
  zh: "\u4E2D\u6587",
  ja: "\u65E5\u672C\u8A9E",
  ko: "\uD55C\uAD6D\uC5B4",
  es: "Espa\xF1ol",
  fr: "Fran\xE7ais",
  de: "Deutsch",
  it: "Italiano",
  ar: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
  hi: "\u0939\u093F\u0928\u094D\u0926\u0940",
  pl: "Polski",
  uk: "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430",
  tr: "T\xFCrk\xE7e",
  nl: "Nederlands",
  sv: "Svenska"
};
var LangMap = LangNames;

// src/storage.ts
function createLocalStorage(options = {}) {
  const key = options.key ?? LocalStorageLangKey;
  return {
    getLanguage() {
      if (typeof window === "undefined" || !window.localStorage) {
        return null;
      }
      const stored = localStorage.getItem(key);
      return stored;
    },
    setLanguage(lang) {
      if (typeof window === "undefined" || !window.localStorage) {
        return;
      }
      localStorage.setItem(key, lang);
    }
  };
}
function createMemoryStorage(initialLang = null) {
  let currentLang = initialLang;
  const listeners = /* @__PURE__ */ new Set();
  return {
    getLanguage() {
      return currentLang;
    },
    setLanguage(lang) {
      currentLang = lang;
      listeners.forEach((cb) => cb(lang));
    },
    subscribe(callback) {
      listeners.add(callback);
      return () => listeners.delete(callback);
    }
  };
}

// src/translator.ts
function createTranslator(options) {
  const { translations, namespace, getLanguage, onMissingKey } = options;
  return (key, replace = {}) => {
    const lang = getLanguage();
    const langTranslations = translations[lang];
    if (!langTranslations?.[namespace]) {
      onMissingKey?.(namespace, key);
      return key;
    }
    const text = langTranslations[namespace][key];
    if (!text) {
      onMissingKey?.(namespace, key);
      return key;
    }
    let result = text.split("&nbsp;").join("\xA0");
    for (const [placeholder, value] of Object.entries(replace)) {
      result = result.replace(
        new RegExp(`{{${placeholder}}}`, "g"),
        String(value)
      );
    }
    return result;
  };
}

// src/plural.ts
function noun(count, forms, locale = "en") {
  const rules = new Intl.PluralRules(locale);
  const category = rules.select(count);
  const result = forms[category] ?? forms.other ?? Object.values(forms)[0];
  return result;
}
function createNoun(locale) {
  return (count, forms) => {
    return noun(count, forms, locale);
  };
}
export {
  Lang,
  LangMap,
  LangNames,
  LocalStorageLangKey,
  createLocalStorage,
  createMemoryStorage,
  createNoun,
  createTranslator,
  noun
};
//# sourceMappingURL=index.js.map