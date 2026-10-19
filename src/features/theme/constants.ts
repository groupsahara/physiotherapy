export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

/** The site opens in the white theme unless the visitor has chosen otherwise. */
export const DEFAULT_THEME: Theme = "light";
export const THEME_STORAGE_KEY = "site-theme";

export const isTheme = (value: unknown): value is Theme =>
  typeof value === "string" && (THEMES as readonly string[]).includes(value);
