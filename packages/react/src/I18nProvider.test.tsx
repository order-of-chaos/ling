import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nProvider } from './I18nProvider';
import { useI18nContext } from './I18nContext';
import { Lang, type Translations, createMemoryStorage } from '@orderofchaos/ling-core';

const translations: Record<Lang, Translations> = {
  [Lang.ru]: {
    Test: {
      'Hello': 'Привет',
      'World': 'Мир',
    },
  },
  [Lang.en]: {
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
      <button onClick={() => changeLanguage(Lang.ru)}>Switch to RU</button>
      <button onClick={() => changeLanguage(Lang.en)}>Switch to EN</button>
    </div>
  );
}

describe('I18nProvider', () => {
  it('should provide default language', () => {
    render(
      <I18nProvider translations={translations} defaultLanguage={Lang.en}>
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('language').textContent).toBe(Lang.en);
  });

  it('should change language', () => {
    render(
      <I18nProvider translations={translations} defaultLanguage={Lang.en}>
        <TestComponent />
      </I18nProvider>
    );

    fireEvent.click(screen.getByText('Switch to RU'));
    expect(screen.getByTestId('language').textContent).toBe(Lang.ru);
  });

  it('should use custom storage', () => {
    const storage = createMemoryStorage(Lang.ru);
    
    render(
      <I18nProvider translations={translations} storage={storage}>
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('language').textContent).toBe(Lang.ru);
  });

  it('should save language to storage on change', () => {
    const storage = createMemoryStorage(Lang.en);
    
    render(
      <I18nProvider translations={translations} storage={storage}>
        <TestComponent />
      </I18nProvider>
    );

    fireEvent.click(screen.getByText('Switch to RU'));
    expect(storage.getLanguage()).toBe(Lang.ru);
  });
});
