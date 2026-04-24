# Custom Storage

By default, `I18nProvider` uses a localStorage adapter with the key `orderofchaos:ling/language`.

If you need a different persistence mechanism, pass your own `I18nStorage<L>` implementation.

## The `I18nStorage` Interface

```ts
interface I18nStorage<L extends string = string> {
  getLanguage(): L | null;
  setLanguage(lang: L): void;
  subscribe?(callback: (lang: L | null) => void): () => void;
}
```

## Built-in Adapters

### `createLocalStorage()`

```ts
import { createLocalStorage } from "@orderofchaos/ling";

const storage = createLocalStorage<"en" | "ru">({
  key: "my-app-language",
});
```

### `createMemoryStorage()`

Useful for tests, SSR, and state you control yourself:

```ts
import { createMemoryStorage } from "@orderofchaos/ling";

const storage = createMemoryStorage<"en" | "ru">("en");
```

## AsyncStorage Example

```ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { I18nStorage } from "@orderofchaos/ling";

type AppLang = "en" | "ru";

let cachedLanguage: AppLang | null = null;

export const asyncStorage: I18nStorage<AppLang> = {
  getLanguage() {
    return cachedLanguage;
  },

  setLanguage(lang) {
    cachedLanguage = lang;
    void AsyncStorage.setItem("app_language", lang);
  },
};

export async function hydrateLanguage() {
  const stored = await AsyncStorage.getItem("app_language");
  if (stored === "en" || stored === "ru") {
    cachedLanguage = stored;
  }
}
```

## Reactive Store Example

If your state container can notify listeners, implement `subscribe()`:

```ts
import { reaction } from "mobx";
import type { I18nStorage } from "@orderofchaos/ling";

type AppLang = "en" | "ru";

const mobxStorage: I18nStorage<AppLang> = {
  getLanguage: () => store.language,
  setLanguage: (lang) => store.setLanguage(lang),
  subscribe: (callback) => {
    return reaction(
      () => store.language,
      (lang) => callback(lang),
    );
  },
};
```

`I18nProvider` subscribes to this adapter and updates React state when the language changes outside the component tree.

## Cookie Example

```ts
import type { I18nStorage } from "@orderofchaos/ling";

type AppLang = "en" | "ru";

const cookieStorage: I18nStorage<AppLang> = {
  getLanguage() {
    const match = document.cookie.match(/language=(\w+)/);
    return match?.[1] === "ru" ? "ru" : match?.[1] === "en" ? "en" : null;
  },

  setLanguage(lang) {
    document.cookie = `language=${lang}; path=/; max-age=31536000`;
  },
};
```

## Server Bridge Example

```ts
import type { I18nStorage } from "@orderofchaos/ling";

type AppLang = "en" | "ru";

const serverStorage: I18nStorage<AppLang> = {
  getLanguage() {
    return null;
  },

  setLanguage(lang) {
    void fetch("/api/language", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: lang }),
    });
  },
};
```

## Use Custom Storage in `I18nProvider`

```tsx
import { I18nProvider } from "@orderofchaos/ling";

<I18nProvider translations={translations} storage={myCustomStorage}>
  <App />
</I18nProvider>;
```

## Related Docs

- [Getting Started](./getting-started.md)
- [API Reference](./api-reference.md)
