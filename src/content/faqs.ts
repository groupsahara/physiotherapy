import type { Faq } from "@/types/content";
import { siteConfig } from "@/config/site";

const [primary, secondary] = siteConfig.contact.phones;

export const faqs: readonly Faq[] = [
  {
    question: "Do I need a doctor's referral to book a session?",
    answer:
      "No. You can book directly with us. If you have X-ray or MRI reports, prescriptions or discharge summaries, please bring them to your first visit — they help us plan your treatment.",
  },
  {
    question: "Do you provide physiotherapy at home?",
    answer: `Yes — home visits are available on call. They are ideal for elderly patients, post-surgery recovery and paralysis rehabilitation. Call ${primary.display} or ${secondary.display} to schedule a visit.`,
  },
  {
    question: "Is the consultation free?",
    answer:
      "Consultation is chargeable. Please call us for current consultation and session fees — we're happy to explain everything before you book.",
  },
  {
    question: "How many sessions will I need?",
    answer:
      "It depends on your condition, how long you've had it and your goals. After the first assessment we'll share a treatment plan with an estimated number of sessions and review progress as we go.",
  },
  {
    question: "Which conditions do you treat?",
    answer:
      "Back pain, cervical (neck) pain, knee pain, sciatica, tail bone pain, frozen shoulder, paralysis rehabilitation and other orthopedic & neurological problems.",
  },
  {
    question: "What should I wear to my session?",
    answer:
      "Loose, comfortable clothing that lets us easily access and move the area being treated — for example shorts for knee problems or a sleeveless top for shoulder issues.",
  },
];
