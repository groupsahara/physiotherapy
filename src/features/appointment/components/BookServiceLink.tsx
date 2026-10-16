"use client";

import { ArrowRight } from "lucide-react";
import { sectionHref } from "@/config/navigation";
import { requestServicePrefill } from "../prefill";

/** Jumps to the booking form with this treatment pre-selected. */
export function BookServiceLink({ service, title }: { service: string; title: string }) {
  return (
    <a
      href={sectionHref("contact")}
      onClick={() => requestServicePrefill(service)}
      aria-label={`Book an appointment for ${title}`}
      className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
    >
      Book this treatment
      <ArrowRight aria-hidden className="size-4 transition-transform group-hover/link:translate-x-1" />
    </a>
  );
}
