import { DEFAULT_THEME, THEME_STORAGE_KEY, isTheme, type Theme } from "./constants";

/**
 * Theme state lives on <html data-theme> (set pre-paint by the init script),
 * so the DOM is the source of truth. This module is an observable wrapper
 * around it, shaped for React's `useSyncExternalStore` — no context provider
 * needed, and every subscriber stays in sync, including across browser tabs.
 */

type Listener = () => void;
const listeners = new Set<Listener>();

function readTheme(): Theme {
  const value = document.documentElement.getAttribute("data-theme");
  return isTheme(value) ? value : DEFAULT_THEME;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key === THEME_STORAGE_KEY && isTheme(event.newValue)) applyTheme(event.newValue);
}

export const themeStore = {
  subscribe(listener: Listener) {
    if (listeners.size === 0) window.addEventListener("storage", onStorage);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) window.removeEventListener("storage", onStorage);
    };
  },

  getSnapshot: readTheme,

  getServerSnapshot: (): Theme => DEFAULT_THEME,

  setTheme(theme: Theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this visit.
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion && typeof document.startViewTransition === "function") {
      document.startViewTransition(() => applyTheme(theme));
    } else {
      applyTheme(theme);
    }
  },
};
