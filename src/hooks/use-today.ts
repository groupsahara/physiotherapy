"use client";

import { useSyncExternalStore } from "react";
import { todayISO } from "@/lib/date";

const subscribe = () => () => {};

/** Today's date (YYYY-MM-DD) on the client; undefined during prerender. */
export function useTodayISO(timeZone: string): string | undefined {
  return useSyncExternalStore(subscribe, () => todayISO(timeZone), () => undefined);
}
