import { describe, it, expect, vi } from 'vitest';
import { createTranslator } from './translator';
import type { Translations } from './types';

type TestLang = "en" | "ru";

describe('createTranslator', () => {
  const translations: Record<TestLang, Translations> = {
    ru: {
      TestComponent: {
        'Hello': 'Привет',
        'Hello, {{name}}!': 'Привет, {{name}}!',
        'You have {{count}} messages': 'У вас {{count}} сообщений',
      },
    },
    en: {
      TestComponent: {
        'Hello': 'Hello',
        'Hello, {{name}}!': 'Hello, {{name}}!',
        'You have {{count}} messages': 'You have {{count}} messages',
      },
    },
  };

  it('should translate key to current language', () => {
    const t = createTranslator({
      translations,
      namespace: 'TestComponent',
      getLanguage: () => "ru",
    });

    expect(t('Hello')).toBe('Привет');
  });

  it('should return key if translation not found', () => {
    const t = createTranslator({
      translations,
      namespace: 'TestComponent',
      getLanguage: () => "ru",
    });

    expect(t('Unknown key')).toBe('Unknown key');
  });

  it('should return key if namespace not found', () => {
    const t = createTranslator({
      translations,
      namespace: 'UnknownComponent',
      getLanguage: () => "ru",
    });

    expect(t('Hello')).toBe('Hello');
  });

  it('should replace placeholders', () => {
    const t = createTranslator({
      translations,
      namespace: 'TestComponent',
      getLanguage: () => "ru",
    });

    expect(t('Hello, {{name}}!', { name: 'World' })).toBe('Привет, World!');
  });

  it('should replace multiple placeholders', () => {
    const t = createTranslator({
      translations,
      namespace: 'TestComponent',
      getLanguage: () => "ru",
    });

    expect(t('You have {{count}} messages', { count: 5 })).toBe('У вас 5 сообщений');
  });

  it('should handle number replacements', () => {
    const t = createTranslator({
      translations,
      namespace: 'TestComponent',
      getLanguage: () => "en",
    });

    expect(t('You have {{count}} messages', { count: 42 })).toBe('You have 42 messages');
  });

  it('should react to language changes', () => {
    let currentLang: TestLang = "en";
    const t = createTranslator({
      translations,
      namespace: 'TestComponent',
      getLanguage: () => currentLang,
    });

    expect(t('Hello')).toBe('Hello');

    currentLang = "ru";
    expect(t('Hello')).toBe('Привет');
  });

  it('should call getLanguage on each translation', () => {
    const getLanguage = vi.fn().mockReturnValue("ru");
    const t = createTranslator({
      translations,
      namespace: 'TestComponent',
      getLanguage,
    });

    t('Hello');
    t('Hello');

    expect(getLanguage).toHaveBeenCalledTimes(2);
  });
});
