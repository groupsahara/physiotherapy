import { cn } from "@/lib/cn";

/**
 * Button styles as a pure function so the same look applies to <button>,
 * <a> and next/link without a polymorphic component.
 */

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98]";

const variants = {
  primary:
    "bg-primary text-primary-fg shadow-[0_8px_24px_-8px_var(--primary)] hover:bg-primary-hover hover:-translate-y-0.5",
  outline: "border border-border bg-surface text-fg hover:border-brand hover:text-brand",
  soft: "bg-primary-soft text-brand hover:bg-primary hover:text-primary-fg",
  onBrand: "bg-white text-[#0b3a8c] hover:bg-blue-50 hover:-translate-y-0.5",
  ghostOnBrand: "border border-white/40 text-white hover:bg-white/10",
  whatsapp: "bg-[#25D366] text-[#05301a] hover:bg-[#1ebe5b] hover:-translate-y-0.5",
} as const;

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-6 text-base sm:h-13 sm:px-7",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}
