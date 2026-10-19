/** Today's date as YYYY-MM-DD in the given IANA time zone. */
export function todayISO(timeZone: string, now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Adds whole days to a YYYY-MM-DD string (calendar math, time-zone independent). */
export function addDaysISO(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** The given IANA time zone when the runtime knows it, else `fallback`. */
export function resolveTimeZone(timeZone: string, fallback = "UTC"): string {
  if (!timeZone) return fallback;
  try {
    new Intl.DateTimeFormat("en", { timeZone });
    return timeZone;
  } catch {
    return fallback;
  }
}

/** The given BCP 47 language tag when valid, else undefined (runtime default). */
function resolveLocale(locale: string | undefined): string | undefined {
  if (!locale) return undefined;
  try {
    return Intl.DateTimeFormat.supportedLocalesOf(locale).length > 0 ? locale : undefined;
  } catch {
    return undefined;
  }
}

/** "2026-10-20" → "Tue, 20 Oct 2026" (format follows `locale`). */
export function formatISODate(isoDate: string, locale?: string): string {
  return new Intl.DateTimeFormat(resolveLocale(locale), {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
