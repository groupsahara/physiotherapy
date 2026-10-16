"use client";

import { useCallback, useSyncExternalStore } from "react";
import { themeStore } from "./theme-store";

export function useTheme() {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot,
  );

  const toggleTheme = useCallback(
    () => themeStore.setTheme(theme === "dark" ? "light" : "dark"),
    [theme],
  );

  return { theme, setTheme: themeStore.setTheme, toggleTheme };
}
