import { describe, it, expect } from "vitest";
import { Lang, LocalStorageLangKey } from "./types";

describe("types", () => {
  describe("Lang enum", () => {
    it("should have ru and en values", () => {
      expect(Lang.ru).toBe("ru");
      expect(Lang.en).toBe("en");
    });

    it("should have all supported languages", () => {
      const languages = Object.values(Lang);
      expect(languages).toHaveLength(3);
      expect(languages).toContain("ru");
      expect(languages).toContain("en");
      expect(languages).toContain("pt");
    });
  });

  describe("LocalStorageLangKey", () => {
    it("should be MA_lang", () => {
      expect(LocalStorageLangKey).toBe("MA_lang");
    });
  });
});
