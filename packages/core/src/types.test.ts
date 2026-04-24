import { describe, it, expect } from "vitest";
import { LocalStorageLangKey } from "./types";

describe("types", () => {
  describe("LocalStorageLangKey", () => {
    it("should use the default ling storage key", () => {
      expect(LocalStorageLangKey).toBe("orderofchaos:ling/language");
    });
  });
});
