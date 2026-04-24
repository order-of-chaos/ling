import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nProvider } from './I18nProvider';
import { initI18nModule } from './initI18nModule';
import type { Translations } from '@orderofchaos/ling-core';

type TestLang = "en" | "ru";

const translations: Record<TestLang, Translations> = {
  ru: {
    MyComponent: {
      'Hello': 'Привет',
      'Hello, {{name}}!': 'Привет, {{name}}!',
      'Count: {{count}}': 'Количество: {{count}}',
    },
  },
  en: {
    MyComponent: {
      'Hello': 'Hello',
      'Hello, {{name}}!': 'Hello, {{name}}!',
      'Count: {{count}}': 'Count: {{count}}',
    },
  },
};

const { useI18n } = initI18nModule('MyComponent');

function TestComponent() {
  const { t, language, changeLanguage } = useI18n();
  return (
    <div>
      <span data-testid="hello">{t('Hello')}</span>
      <span data-testid="greeting">{t('Hello, {{name}}!', { name: 'World' })}</span>
      <span data-testid="count">{t('Count: {{count}}', { count: 42 })}</span>
      <span data-testid="language">{language}</span>
      <button onClick={() => changeLanguage("ru")}>RU</button>
      <button onClick={() => changeLanguage("en")}>EN</button>
    </div>
  );
}

describe('initI18nModule', () => {
  it('should translate text', () => {
    render(
      <I18nProvider translations={translations} defaultLanguage="en">
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('hello').textContent).toBe('Hello');
  });

  it('should translate with placeholders', () => {
    render(
      <I18nProvider translations={translations} defaultLanguage="en">
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('greeting').textContent).toBe('Hello, World!');
    expect(screen.getByTestId('count').textContent).toBe('Count: 42');
  });

  it('should react to language changes', () => {
    render(
      <I18nProvider translations={translations} defaultLanguage="en">
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('hello').textContent).toBe('Hello');

    fireEvent.click(screen.getByText('RU'));

    expect(screen.getByTestId('hello').textContent).toBe('Привет');
    expect(screen.getByTestId('greeting').textContent).toBe('Привет, World!');
  });

  it('should return key if translation not found', () => {
    const { useI18n: useUnknown } = initI18nModule('UnknownComponent');
    
    function UnknownComponent() {
      const { t } = useUnknown();
      return <span data-testid="unknown">{t('Unknown key')}</span>;
    }

    render(
      <I18nProvider translations={translations} defaultLanguage="en">
        <UnknownComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('unknown').textContent).toBe('Unknown key');
  });
});
