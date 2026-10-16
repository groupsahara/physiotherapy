import {
  Accessibility,
  Armchair,
  Bone,
  Brain,
  Dumbbell,
  Footprints,
  PersonStanding,
  Zap,
} from "lucide-react";
import type { Service } from "@/types/content";

/** Conditions listed under "Treatment Available For" on the visiting card. */
export const services = [
  {
    slug: "back-pain",
    title: "Back Pain",
    summary:
      "Relief for lower and upper back pain caused by posture, long sitting hours, muscle strain or disc problems.",
    icon: Bone,
    treatments: ["Manual therapy & mobilisation", "Core stabilisation", "Posture correction"],
  },
  {
    slug: "cervical-pain",
    title: "Cervical Pain",
    summary:
      "Treatment for neck pain, stiffness and cervical spondylosis — including pain that travels into the shoulder or arm.",
    icon: PersonStanding,
    treatments: ["Cervical mobilisation", "Neck strengthening", "Ergonomic guidance"],
  },
  {
    slug: "knee-pain",
    title: "Knee Pain",
    summary:
      "Care for arthritis, ligament injuries and post-operative knee rehab to help you walk and climb stairs with confidence.",
    icon: Footprints,
    treatments: ["Strength & mobility training", "Pain-relief modalities", "Gait correction"],
  },
  {
    slug: "sciatica",
    title: "Sciatica",
    summary:
      "Targeted therapy for radiating leg pain, numbness and tingling caused by sciatic nerve irritation.",
    icon: Zap,
    treatments: ["Neural mobilisation", "Spinal decompression exercises", "Flexibility work"],
  },
  {
    slug: "tail-bone-pain",
    title: "Tail Bone Pain",
    summary:
      "Gentle, specialised treatment for coccyx pain that makes sitting, standing up or bending uncomfortable.",
    icon: Armchair,
    treatments: ["Soft-tissue release", "Pelvic & postural correction", "Sitting ergonomics"],
  },
  {
    slug: "frozen-shoulder",
    title: "Frozen Shoulder",
    summary:
      "Step-by-step programme to restore shoulder movement, reduce stiffness and get you reaching overhead again.",
    icon: Dumbbell,
    treatments: ["Joint mobilisation", "Range-of-motion exercises", "Strengthening"],
  },
  {
    slug: "paralysis-rehabilitation",
    title: "Paralysis Rehabilitation",
    summary:
      "Structured neuro-rehabilitation after stroke or nerve injury to rebuild strength, balance and independence.",
    icon: Accessibility,
    treatments: ["Neuro-rehab exercises", "Balance & gait training", "Daily-living skills"],
  },
  {
    slug: "ortho-neuro",
    title: "Orthopedic & Neurological",
    summary:
      "Rehab for sports injuries, fractures, post-surgery recovery and other orthopedic & neurological problems.",
    icon: Brain,
    treatments: ["Post-surgical rehab", "Sports injury care", "Neurological conditions"],
  },
] as const satisfies readonly Service[];

export type ServiceSlug = (typeof services)[number]["slug"];

export const serviceOptions = services.map(({ slug, title }) => ({ value: slug, label: title }));
