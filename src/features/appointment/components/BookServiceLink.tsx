"use client";

import { ArrowRight } from "lucide-react";
import { requestTreatmentPrefill } from "../prefill";

interface BookServiceLinkProps {
  /** Treatment slug to pre-select in the form. */
  treatment: string;
  title: string;
  label: string;
  href: string;
}

/** Jumps to the booking form with this treatment pre-selected. */
export function BookServiceLink({ treatment, title, label, href }: BookServiceLinkProps) {
  return (
    <a
      href={href}
      onClick={() => requestTreatmentPrefill(treatment)}
      aria-label={`Book an appointment for ${title}`}
      className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
    >
      {label}
      <ArrowRight aria-hidden className="size-4 transition-transform group-hover/link:translate-x-1" />
    </a>
  );
}
