// src/types.ts
var LocalStorageLangKey = "orderofchaos:ling/language";

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
  LocalStorageLangKey,
  createLocalStorage,
  createMemoryStorage,
  createNoun,
  createTranslator,
  noun
};
//# sourceMappingURL=index.js.map