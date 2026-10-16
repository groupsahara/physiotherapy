import {
  BadgeCheck,
  ClipboardList,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  House,
  Stethoscope,
  Target,
  UserRound,
} from "lucide-react";
import type { Feature } from "@/types/content";

/** Trust strip directly under the hero — facts taken from the visiting card. */
export const highlights: readonly Feature[] = [
  {
    title: "BPT (D.U.)",
    description: "Bachelor of Physiotherapy, University of Delhi",
    icon: GraduationCap,
  },
  {
    title: "DCPT",
    description: "Additional professional qualification",
    icon: BadgeCheck,
  },
  {
    title: "Registered Physiotherapist",
    description: "Specialized & well-experienced",
    icon: Stethoscope,
  },
  {
    title: "Home Visits",
    description: "Available on call",
    icon: House,
  },
];

/** "Why choose us" points shown in the About section. */
export const reasons: readonly Feature[] = [
  {
    title: "One-on-one attention",
    description: "Every session is with your physiotherapist — not handed off to an assistant.",
    icon: UserRound,
  },
  {
    title: "Personalised plans",
    description: "Treatment designed around your condition, lifestyle and recovery goals.",
    icon: Target,
  },
  {
    title: "Care at your doorstep",
    description: "Home visits on call for elderly, post-surgery and paralysis patients.",
    icon: HeartHandshake,
  },
];

/** Four-step treatment journey for the Approach section. */
export const approachSteps: readonly Feature[] = [
  {
    title: "Detailed assessment",
    description:
      "We understand your history, examine posture and movement, and review any X-ray or MRI reports you bring.",
    icon: ClipboardList,
  },
  {
    title: "Clear diagnosis & plan",
    description:
      "You get a simple explanation of what is causing the pain and a personalised plan with realistic goals.",
    icon: Target,
  },
  {
    title: "Hands-on treatment",
    description:
      "Manual therapy, therapeutic modalities and guided exercise — progressed session by session.",
    icon: HandHeart,
  },
  {
    title: "Recovery & prevention",
    description:
      "A home-exercise programme and posture advice so the pain stays away after you finish treatment.",
    icon: HeartHandshake,
  },
];
