import { describe, it, expect } from "vitest";
import { noun, createNoun } from "./plural";

describe("plural", () => {
  describe("noun", () => {
    it("should select 'one' form for count 1 in English", () => {
      const result = noun(1, { one: "1 item", other: "items" }, "en");
      expect(result).toBe("1 item");
    });

    it("should select 'other' form for count > 1 in English", () => {
      const result = noun(5, { one: "1 item", other: "5 items" }, "en");
      expect(result).toBe("5 items");
    });

    it("should select 'one' form for count 1 in Russian", () => {
      const result = noun(1, {
        one: "1 товар",
        few: "товара",
        many: "товаров",
      }, "ru");
      expect(result).toBe("1 товар");
    });

    it("should select 'few' form for count 2-4 in Russian", () => {
      const result = noun(3, {
        one: "товар",
        few: "товара",
        many: "товаров",
      }, "ru");
      expect(result).toBe("товара");
    });

    it("should select 'many' form for count 5+ in Russian", () => {
      const result = noun(5, {
        one: "товар",
        few: "товара",
        many: "товаров",
      }, "ru");
      expect(result).toBe("товаров");
    });

    it("should handle Russian 11-19 (always many)", () => {
      const forms = { one: "товар", few: "товара", many: "товаров" };
      expect(noun(11, forms, "ru")).toBe("товаров");
      expect(noun(14, forms, "ru")).toBe("товаров");
      expect(noun(19, forms, "ru")).toBe("товаров");
    });

    it("should handle Russian 21, 31, etc. (one)", () => {
      const forms = { one: "товар", few: "товара", many: "товаров" };
      expect(noun(21, forms, "ru")).toBe("товар");
      expect(noun(31, forms, "ru")).toBe("товар");
      expect(noun(101, forms, "ru")).toBe("товар");
    });

    it("should fallback to 'other' if exact form not found", () => {
      const result = noun(5, { other: "items" }, "en");
      expect(result).toBe("items");
    });

    it("should fallback to first available form if 'other' not found", () => {
      const result = noun(5, { one: "item" }, "en");
      expect(result).toBe("item");
    });

    it("should default to English locale", () => {
      const result = noun(1, { one: "one", other: "other" });
      expect(result).toBe("one");
    });

    it("should work with any type, not just strings", () => {
      const result = noun(1, {
        one: { text: "singular", icon: "📦" },
        other: { text: "plural", icon: "📦📦" },
      }, "en");
      expect(result).toEqual({ text: "singular", icon: "📦" });
    });
  });

  describe("createNoun", () => {
    it("should create a noun function bound to locale", () => {
      const nounRu = createNoun("ru");
      
      expect(nounRu(1, { one: "товар", few: "товара", many: "товаров" }))
        .toBe("товар");
      expect(nounRu(3, { one: "товар", few: "товара", many: "товаров" }))
        .toBe("товара");
      expect(nounRu(5, { one: "товар", few: "товара", many: "товаров" }))
        .toBe("товаров");
    });
  });
});
