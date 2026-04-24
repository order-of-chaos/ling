import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nProvider } from '@orderofchaos/ling-react';
import App from './App';
import { ru } from './translations/ru';
import { en } from './translations/en';

const translations = { ru, en };

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider translations={translations} defaultLanguage="en">
      <App />
    </I18nProvider>
  </React.StrictMode>
);
