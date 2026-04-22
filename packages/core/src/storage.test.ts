import { describe, it, expect, beforeEach, vi } from "vitest";
import { createLocalStorage, createMemoryStorage } from "./storage";
import { Lang, LocalStorageLangKey } from "./types";

describe("storage", () => {
  describe("createMemoryStorage", () => {
    it("should create storage with default language", () => {
      const storage = createMemoryStorage(Lang.en);
      expect(storage.getLanguage()).toBe(Lang.en);
    });

    it("should set and get language", () => {
      const storage = createMemoryStorage(Lang.en);
      storage.setLanguage(Lang.ru);
      expect(storage.getLanguage()).toBe(Lang.ru);
    });

    it("should notify subscribers on language change", () => {
      const storage = createMemoryStorage(Lang.en);
      const callback = vi.fn();

      storage.subscribe!(callback);
      storage.setLanguage(Lang.ru);

      expect(callback).toHaveBeenCalledWith(Lang.ru);
    });

    it("should not notify after unsubscribe", () => {
      const storage = createMemoryStorage(Lang.en);
      const callback = vi.fn();

      const unsubscribe = storage.subscribe!(callback);
      unsubscribe();
      storage.setLanguage(Lang.ru);

      expect(callback).not.toHaveBeenCalled();
    });

    it("should support multiple subscribers", () => {
      const storage = createMemoryStorage(Lang.en);
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      storage.subscribe!(callback1);
      storage.subscribe!(callback2);
      storage.setLanguage(Lang.ru);

      expect(callback1).toHaveBeenCalledWith(Lang.ru);
      expect(callback2).toHaveBeenCalledWith(Lang.ru);
    });
  });

  describe("createLocalStorage", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("should create storage with custom key", () => {
      const storage = createLocalStorage({ key: "custom_key" });
      storage.setLanguage(Lang.ru);
      expect(localStorage.getItem("custom_key")).toBe(Lang.ru);
    });

    it("should use default key if not provided", () => {
      const storage = createLocalStorage();
      storage.setLanguage(Lang.en);
      expect(localStorage.getItem(LocalStorageLangKey)).toBe(Lang.en);
    });

    it("should return null if no language stored", () => {
      const storage = createLocalStorage();
      expect(storage.getLanguage()).toBeNull();
    });

    it("should get language from localStorage", () => {
      localStorage.setItem(LocalStorageLangKey, Lang.ru);
      const storage = createLocalStorage();
      expect(storage.getLanguage()).toBe(Lang.ru);
    });

    it("should set language to localStorage", () => {
      const storage = createLocalStorage();
      storage.setLanguage(Lang.en);
      expect(localStorage.getItem(LocalStorageLangKey)).toBe(Lang.en);
    });
  });
});
