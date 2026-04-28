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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  LocalStorageLangKey: () => LocalStorageLangKey,
  createLocalStorage: () => createLocalStorage,
  createMemoryStorage: () => createMemoryStorage,
  createNoun: () => createNoun,
  createTranslator: () => createTranslator,
  noun: () => noun
});
module.exports = __toCommonJS(index_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LocalStorageLangKey,
  createLocalStorage,
  createMemoryStorage,
  createNoun,
  createTranslator,
  noun
});
//# sourceMappingURL=index.cjs.map