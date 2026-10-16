"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const buildYear = Number(process.env.NEXT_PUBLIC_BUILD_YEAR);

/**
 * Clock reads can't happen in a prerendered Server Component, so the year is
 * resolved on the client. The server snapshot is the build year (injected by
 * next.config.ts); React swaps in the live year after hydration, mismatch-free.
 */
export function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => buildYear,
  );
  return <>{year}</>;
}
