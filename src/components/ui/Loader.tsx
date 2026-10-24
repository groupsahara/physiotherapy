"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * The loader: an arc spinning round a pulsing dot (the same design as the apps and the admin
 * console). It takes the current text colour; size it with `size-*`.
 */
export function Loader({ className, label = "Loading" }: { className?: string; label?: string }) {
  return (
    <span role="status" aria-label={label} className={cn("relative inline-flex size-5 shrink-0 items-center justify-center", className)}>
      <svg className="animate-loader-spin absolute inset-0 size-full" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
        <path d="M12 2a10 10 0 0 1 0 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span className="animate-loader-pulse size-[34%] rounded-full bg-current" aria-hidden />
    </span>
  );
}

/** A label whose trailing dots fill in one by one ("Sending", "Sending.", ... "Sending..."). */
export function LoadingLabel({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline", className)}>
      {label}
      <span aria-hidden className="inline-flex">
        <span className="animate-loader-dot-1">.</span>
        <span className="animate-loader-dot-2">.</span>
        <span className="animate-loader-dot-3">.</span>
      </span>
    </span>
  );
}

/** Quick requests finish before the overlay would appear, so it never just flickers. */
const SHOW_AFTER_MS = 200;
/** Once shown, it stays long enough to be read. */
const MIN_VISIBLE_MS = 500;

/** Dims the page and says what is being processed while `active`. */
export function ProcessingOverlay({ active, label }: { active: boolean; label: string }) {
  const [visible, setVisible] = useState(false);
  const shownAt = useRef(0);

  useEffect(() => {
    if (active === visible) return;
    const wait = active ? SHOW_AFTER_MS : Math.max(0, MIN_VISIBLE_MS - (Date.now() - shownAt.current));
    const timer = setTimeout(() => {
      if (active) shownAt.current = Date.now();
      setVisible(active);
    }, wait);
    return () => clearTimeout(timer);
  }, [active, visible]);

  if (!visible) return null;
  return (
    <div
      className="animate-loader-fade fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
      role="alertdialog"
      aria-modal="true"
      aria-busy="true"
      aria-label={label}
    >
      <div className="flex min-w-60 flex-col items-center gap-4 rounded-3xl border border-border bg-surface px-8 py-7 text-fg shadow-lift">
        <Loader className="size-14 text-primary" label={label} />
        <LoadingLabel label={label} className="text-sm font-semibold" />
      </div>
    </div>
  );
}
