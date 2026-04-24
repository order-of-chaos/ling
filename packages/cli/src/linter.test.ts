import { describe, it, expect } from "vitest";
import { findMissingTranslations } from "./linter";

describe("findMissingTranslations", () => {
  it("should return empty result when all translations are properly translated", () => {
    const translations = {
      ru: {
        Header: {
          Hello: "Привет",
          World: "Мир",
        },
      },
      en: {
        Header: {
          Hello: "Hi",
          World: "Earth",
        },
      },
    };

    const result = findMissingTranslations(translations, "ru");

    expect(result.total).toBe(0);
    expect(result.missing).toHaveLength(0);
  });

  it("should find completely missing translations", () => {
    const translations = {
      ru: {
        Header: {
          Hello: "Привет",
          World: "Мир",
        },
      },
      en: {
        Header: {
          Hello: "Hi",
        },
      },
    };

    const result = findMissingTranslations(translations, "ru");

    expect(result.total).toBe(1);
    expect(result.missing).toEqual([
      { language: "en", namespace: "Header", key: "World" },
    ]);
  });

  it("should find untranslated keys (value same as key)", () => {
    const translations = {
      ru: {
        Header: {
          Hello: "Привет",
        },
      },
      en: {
        Header: {
          Hello: "Hello",
        },
      },
    };

    const result = findMissingTranslations(translations, "ru");

    expect(result.total).toBe(1);
    expect(result.missing[0]).toEqual({
      language: "en",
      namespace: "Header",
      key: "Hello",
    });
  });

  it("should find missing namespace", () => {
    const translations = {
      ru: {
        Header: { Title: "Заголовок" },
        Footer: { Copyright: "Копирайт" },
      },
      en: {
        Header: { Title: "Heading" },
      },
    };

    const result = findMissingTranslations(translations, "ru");

    expect(result.total).toBe(1);
    expect(result.missing).toContainEqual({
      language: "en",
      namespace: "Footer",
      key: "Copyright",
    });
  });

  it("should skip default language when checking", () => {
    const translations = {
      ru: {
        Header: { Hello: "Hello" },
      },
      en: {
        Header: { Hello: "Hi" },
      },
    };

    const result = findMissingTranslations(translations, "en");

    expect(result.total).toBe(1);
    expect(result.missing[0].language).toBe("ru");
    expect(result.missing[0].key).toBe("Hello");
  });

  it("should support custom string language codes", () => {
    const translations = {
      en: {
        Header: {
          Hello: "Hello",
        },
      },
      de: {
        Header: {},
      },
    };

    const result = findMissingTranslations(translations, "en");

    expect(result.total).toBe(1);
    expect(result.missing[0]).toEqual({
      language: "de",
      namespace: "Header",
      key: "Hello",
    });
  });
});
