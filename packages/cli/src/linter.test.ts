import { describe, it, expect } from "vitest";
import { findMissingTranslations } from "./linter";
import { Lang } from "@orderofchaos/ling-core";

describe("findMissingTranslations", () => {
  it("should return empty result when all translations are properly translated", () => {
    const translations = {
      [Lang.ru]: {
        Header: {
          Hello: "Привет",
          World: "Мир",
        },
      },
      [Lang.en]: {
        Header: {
          Hello: "Hi",
          World: "Earth",
        },
      },
    };

    const result = findMissingTranslations(translations, Lang.ru);

    expect(result.total).toBe(0);
    expect(result.missing).toHaveLength(0);
  });

  it("should find completely missing translations", () => {
    const translations = {
      [Lang.ru]: {
        Header: {
          Hello: "Привет",
          World: "Мир",
        },
      },
      [Lang.en]: {
        Header: {
          Hello: "Hi",
        },
      },
    };

    const result = findMissingTranslations(translations, Lang.ru);

    expect(result.total).toBe(1);
    expect(result.missing).toEqual([
      { language: "en", namespace: "Header", key: "World" },
    ]);
  });

  it("should find untranslated keys (value same as key)", () => {
    const translations = {
      [Lang.ru]: {
        Header: {
          Hello: "Привет",
        },
      },
      [Lang.en]: {
        Header: {
          Hello: "Hello",
        },
      },
    };

    const result = findMissingTranslations(translations, Lang.ru);

    expect(result.total).toBe(1);
    expect(result.missing[0]).toEqual({
      language: "en",
      namespace: "Header",
      key: "Hello",
    });
  });

  it("should find missing namespace", () => {
    const translations = {
      [Lang.ru]: {
        Header: { Title: "Заголовок" },
        Footer: { Copyright: "Копирайт" },
      },
      [Lang.en]: {
        Header: { Title: "Heading" },
      },
    };

    const result = findMissingTranslations(translations, Lang.ru);

    expect(result.total).toBe(1);
    expect(result.missing).toContainEqual({
      language: "en",
      namespace: "Footer",
      key: "Copyright",
    });
  });

  it("should skip default language when checking", () => {
    const translations = {
      [Lang.ru]: {
        Header: { Hello: "Hello" },
      },
      [Lang.en]: {
        Header: { Hello: "Hi" },
      },
    };

    const result = findMissingTranslations(translations, Lang.en);

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
