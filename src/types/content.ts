import type { StaticImageData } from "next/image";
import type { LucideIcon } from "lucide-react";

/** Every in-page anchor. Navigation, scroll-spy and sections share this union. */
export type SectionId =
  | "home"
  | "about"
  | "services"
  | "approach"
  | "sessions"
  | "testimonials"
  | "faq"
  | "contact";

export interface NavItem {
  id: SectionId;
  label: string;
}

/** Feature tile with an icon — used by highlights, approach steps and "why us". */
export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Service {
  slug: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  treatments: readonly string[];
}

export interface PhotoCredit {
  source: "Pexels" | "Unsplash";
  url: string;
}

export interface Photo {
  src: StaticImageData;
  alt: string;
  credit: PhotoCredit;
}

export interface SessionPhoto extends Photo {
  id: string;
  title: string;
  caption: string;
  tag: string;
}

export interface Testimonial {
  name: string;
  context: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

export interface Faq {
  question: string;
  answer: string;
}
