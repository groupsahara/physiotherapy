type ClassValue = string | false | null | undefined;

/** Joins truthy class names. Tiny on purpose — no runtime dependency needed. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
