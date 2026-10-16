import type { Testimonial } from "@/types/content";

/**
 * ⚠️ PLACEHOLDER CONTENT — replace before going live.
 *
 * These entries are illustrative samples so the layout can be reviewed.
 * Swap them for real feedback from patients who have agreed to be quoted
 * (first name + initial is fine). Publishing invented reviews is misleading
 * to patients and is not allowed under Indian consumer-protection rules.
 */
export const testimonials: readonly Testimonial[] = [
  {
    name: "Rakesh S.",
    context: "Lower back pain",
    quote:
      "After months of back pain from desk work, the exercises and hands-on treatment made a real difference. Dr. Deepak explained everything clearly.",
    rating: 5,
  },
  {
    name: "Sunita M.",
    context: "Frozen shoulder",
    quote:
      "I could not lift my arm to comb my hair. Step by step my movement came back, and the home exercises were easy to follow.",
    rating: 5,
  },
  {
    name: "Harish K.",
    context: "Home visits · Stroke rehab",
    quote:
      "The home visits were a big help for my father after his stroke. Patient, punctual and very encouraging throughout.",
    rating: 5,
  },
];
