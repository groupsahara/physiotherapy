import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

/** Brand mark: a figure in motion inside a rounded tile. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={cn("size-10 shrink-0", className)}>
      <defs>
        <linearGradient id="mc-logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1246b8" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#mc-logo-gradient)" />
      <circle cx="23.5" cy="9.5" r="3.2" fill="#fff" />
      <path
        d="M14 31.5l4.6-8.2 4.4 3.2V33M18.6 23.3l2-8.3 6 4.6 4.4-1.6M20.6 15l-6.6 2.6-2 5"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-extrabold tracking-tight uppercase",
            inverted ? "text-white" : "text-fg",
          )}
        >
          {siteConfig.name}
        </span>
        <span
          className={cn(
            "mt-1 text-[10.5px] font-semibold tracking-[0.14em] uppercase",
            inverted ? "text-blue-200" : "text-brand",
          )}
        >
          Physiotherapy &amp; Rehab
        </span>
      </span>
    </span>
  );
}
