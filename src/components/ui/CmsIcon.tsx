import { createElement } from "react";
import { iconFor } from "@/lib/icons";

/** Decorative Lucide icon chosen in the CMS by name (unknown names get a fallback). */
export function CmsIcon({ name, className }: { name: string; className?: string }) {
  return createElement(iconFor(name), { "aria-hidden": true, className });
}
