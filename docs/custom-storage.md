# Custom Storage

By default, `@orderofchaos/ling-react` stores the user's language preference in `localStorage`. However, you can provide your own storage implementation for different use cases.

## The I18nStorage Interface

```typescript
interface I18nStorage {
  // Get the current language from storage
  getLanguage(): Lang | null;
  
  // Save the language to storage
  setLanguage(lang: Lang): void;
  
  // Optional: Subscribe to language changes (for reactive storages)
  subscribe?(callback: (lang: Lang | null) => void): () => void;
}
```

## Built-in Storage Adapters

### localStorage (default)

```typescript
import { createLocalStorage } from '@orderofchaos/ling-core';

const storage = createLocalStorage({ key: 'my_app_lang' });
```

### In-Memory Storage

Useful for SSR or testing:

```typescript
import { createMemoryStorage, Lang } from '@orderofchaos/ling-core';

const storage = createMemoryStorage(Lang.en);
```

## Custom Storage Examples

### AsyncStorage (React Native)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { I18nStorage, Lang } from '@orderofchaos/ling-react';

let cachedLanguage: Lang | null = null;

const asyncStorage: I18nStorage = {
  getLanguage() {
    return cachedLanguage;
  },
  
  setLanguage(lang: Lang) {
    cachedLanguage = lang;
    AsyncStorage.setItem('app_language', lang);
  },
};

// Load language on app start
async function initLanguage() {
  const stored = await AsyncStorage.getItem('app_language');
  if (stored) {
    cachedLanguage = stored as Lang;
  }
}
```

### MobX Reactive Storage

```typescript
import { makeAutoObservable, reaction } from 'mobx';
import type { I18nStorage, Lang } from '@orderofchaos/ling-react';

class LanguageStore {
  language: Lang = Lang.en;

  constructor() {
    makeAutoObservable(this);
  }

  setLanguage(lang: Lang) {
    this.language = lang;
  }
}

const store = new LanguageStore();

const mobxStorage: I18nStorage = {
  getLanguage: () => store.language,
  setLanguage: (lang) => store.setLanguage(lang),
  subscribe: (callback) => {
    return reaction(
      () => store.language,
      (lang) => callback(lang)
    );
  },
};
```

### Cookies Storage

```typescript
import type { I18nStorage, Lang } from '@orderofchaos/ling-react';

const cookieStorage: I18nStorage = {
  getLanguage() {
    const match = document.cookie.match(/language=(\w+)/);
    return match ? (match[1] as Lang) : null;
  },

  setLanguage(lang: Lang) {
    document.cookie = `language=${lang}; path=/; max-age=31536000`;
  },
};
```

### Server-Side Storage (Next.js)

```typescript
import type { I18nStorage, Lang } from '@orderofchaos/ling-react';

// For server components, pass language from server
const serverStorage: I18nStorage = {
  getLanguage() {
    // This will be called on client only
    return null;
  },

  setLanguage(lang: Lang) {
    // Update via API call
    fetch('/api/language', {
      method: 'POST',
      body: JSON.stringify({ language: lang }),
    });
  },
};
```

## Using Custom Storage

```tsx
import { I18nProvider } from '@orderofchaos/ling-react';

<I18nProvider 
  translations={translations} 
  storage={myCustomStorage}
>
  <App />
</I18nProvider>
```
