# Getting Started

## Installation

### For React applications

```bash
# npm
npm install @orderofchaos/ling-react

# pnpm
pnpm add @orderofchaos/ling-react

# yarn
yarn add @orderofchaos/ling-react
```

### CLI for translation extraction (dev dependency)

```bash
pnpm add -D @orderofchaos/ling-cli
```

## Basic Setup

### 1. Create translation files

Create a directory for your translations, e.g., `src/i18n/translations/`:

```typescript
// src/i18n/translations/ru.ts
export const ru = {
  App: {
    'Hello World': 'Привет мир',
    'Welcome, {{name}}!': 'Добро пожаловать, {{name}}!',
  },
};

export default ru;
```

```typescript
// src/i18n/translations/en.ts
export const en = {
  App: {
    'Hello World': 'Hello World',
    'Welcome, {{name}}!': 'Welcome, {{name}}!',
  },
};

export default en;
```

### 2. Wrap your app with I18nProvider

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nProvider, Lang } from '@orderofchaos/ling-react';
import App from './App';
import { ru } from './i18n/translations/ru';
import { en } from './i18n/translations/en';

const translations = { ru, en };

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider translations={translations} defaultLanguage={Lang.en}>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
```

### 3. Use translations in components

```tsx
// src/App.tsx
import { initI18nModule, Lang } from '@orderofchaos/ling-react';

// Initialize i18n module for this component
const { useI18n } = initI18nModule('App');

function App() {
  const { t, language, changeLanguage } = useI18n();

  return (
    <div>
      <h1>{t('Hello World')}</h1>
      <p>{t('Welcome, {{name}}!', { name: 'User' })}</p>
      
      <button onClick={() => changeLanguage(Lang.ru)}>
        Русский
      </button>
      <button onClick={() => changeLanguage(Lang.en)}>
        English
      </button>
    </div>
  );
}
```

## Next Steps

- [Custom Storage](./custom-storage.md) - Learn how to use custom storage for language persistence
- [CLI Usage](./cli.md) - Learn how to extract translations automatically
- [API Reference](./api-reference.md) - Full API documentation
