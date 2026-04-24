import { describe, it, expect, beforeEach, vi } from "vitest";
import { createLocalStorage, createMemoryStorage } from "./storage";
import { LocalStorageLangKey } from "./types";

describe("storage", () => {
  describe("createMemoryStorage", () => {
    it("should create storage with default language", () => {
      const storage = createMemoryStorage("en");
      expect(storage.getLanguage()).toBe("en");
    });

    it("should set and get language", () => {
      const storage = createMemoryStorage("en");
      storage.setLanguage("ru");
      expect(storage.getLanguage()).toBe("ru");
    });

    it("should notify subscribers on language change", () => {
      const storage = createMemoryStorage("en");
      const callback = vi.fn();

      storage.subscribe!(callback);
      storage.setLanguage("ru");

      expect(callback).toHaveBeenCalledWith("ru");
    });

    it("should not notify after unsubscribe", () => {
      const storage = createMemoryStorage("en");
      const callback = vi.fn();

      const unsubscribe = storage.subscribe!(callback);
      unsubscribe();
      storage.setLanguage("ru");

      expect(callback).not.toHaveBeenCalled();
    });

    it("should support multiple subscribers", () => {
      const storage = createMemoryStorage("en");
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      storage.subscribe!(callback1);
      storage.subscribe!(callback2);
      storage.setLanguage("ru");

      expect(callback1).toHaveBeenCalledWith("ru");
      expect(callback2).toHaveBeenCalledWith("ru");
    });
  });

  describe("createLocalStorage", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("should create storage with custom key", () => {
      const storage = createLocalStorage({ key: "custom_key" });
      storage.setLanguage("ru");
      expect(localStorage.getItem("custom_key")).toBe("ru");
    });

    it("should use default key if not provided", () => {
      const storage = createLocalStorage();
      storage.setLanguage("en");
      expect(localStorage.getItem(LocalStorageLangKey)).toBe("en");
    });

    it("should return null if no language stored", () => {
      const storage = createLocalStorage();
      expect(storage.getLanguage()).toBeNull();
    });

    it("should get language from localStorage", () => {
      localStorage.setItem(LocalStorageLangKey, "ru");
      const storage = createLocalStorage();
      expect(storage.getLanguage()).toBe("ru");
    });

    it("should set language to localStorage", () => {
      const storage = createLocalStorage();
      storage.setLanguage("en");
      expect(localStorage.getItem(LocalStorageLangKey)).toBe("en");
    });
  });
});
