import type { NavItem } from "@/types/content";

export const mainNav: readonly NavItem[] = [
  { id: "about", label: "About" },
  { id: "services", label: "Treatments" },
  { id: "approach", label: "Our Approach" },
  { id: "sessions", label: "Sessions" },
  { id: "testimonials", label: "Reviews" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export const sectionHref = (id: NavItem["id"]) => `#${id}` as const;
