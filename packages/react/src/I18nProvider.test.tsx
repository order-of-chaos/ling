import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nProvider } from './I18nProvider';
import { useI18nContext } from './I18nContext';
import { createMemoryStorage, type Translations } from '@orderofchaos/ling-core';

type TestLang = "en" | "ru";

const translations: Record<TestLang, Translations> = {
  ru: {
    Test: {
      'Hello': 'Привет',
      'World': 'Мир',
    },
  },
  en: {
    Test: {
      'Hello': 'Hello',
      'World': 'World',
    },
  },
};

function TestComponent() {
  const { language, changeLanguage } = useI18nContext();
  return (
    <div>
      <span data-testid="language">{language}</span>
      <button onClick={() => changeLanguage("ru")}>Switch to RU</button>
      <button onClick={() => changeLanguage("en")}>Switch to EN</button>
    </div>
  );
}

describe('I18nProvider', () => {
  it('should provide default language', () => {
    render(
      <I18nProvider translations={translations} defaultLanguage="en">
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('language').textContent).toBe("en");
  });

  it('should change language', () => {
    render(
      <I18nProvider translations={translations} defaultLanguage="en">
        <TestComponent />
      </I18nProvider>
    );

    fireEvent.click(screen.getByText('Switch to RU'));
    expect(screen.getByTestId('language').textContent).toBe("ru");
  });

  it('should use custom storage', () => {
    const storage = createMemoryStorage<TestLang>("ru");
    
    render(
      <I18nProvider translations={translations} storage={storage}>
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('language').textContent).toBe("ru");
  });

  it('should save language to storage on change', () => {
    const storage = createMemoryStorage<TestLang>("en");
    
    render(
      <I18nProvider translations={translations} storage={storage}>
        <TestComponent />
      </I18nProvider>
    );

    fireEvent.click(screen.getByText('Switch to RU'));
    expect(storage.getLanguage()).toBe("ru");
  });
});
