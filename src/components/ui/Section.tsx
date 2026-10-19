import type { ReactNode } from "react";
import type { NavTarget } from "@/lib/cms/types";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

interface SectionProps {
  /** In-page anchor; navigation links target these ids. */
  id: NavTarget;
  /** id of the heading that labels this landmark. */
  labelledBy: string;
  tone?: "default" | "subtle";
  className?: string;
  children: ReactNode;
}

/** Page-level landmark with consistent rhythm, anchor id and background tone. */
export function Section({ id, labelledBy, tone = "default", className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative scroll-mt-24 py-20 sm:py-24 lg:py-28",
        tone === "subtle" && "bg-bg-subtle",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}
