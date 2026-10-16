import type { Photo, SessionPhoto } from "@/types/content";

import heroTreatmentTable from "@/assets/images/hero-treatment-table.jpg";
import aboutShoulderAssessment from "@/assets/images/about-shoulder-assessment.jpg";
import homeVisitSession from "@/assets/images/home-visit-session.jpg";
import coreStability from "@/assets/images/session-core-stability.jpg";
import resistanceBand from "@/assets/images/session-resistance-band.jpg";
import sciaticStretch from "@/assets/images/session-sciatic-stretch.jpg";
import kneeAssessment from "@/assets/images/session-knee-assessment.jpg";
import ultrasoundTherapy from "@/assets/images/session-ultrasound-therapy.jpg";
import spinalMobilisation from "@/assets/images/session-spinal-mobilisation.jpg";
import balanceTraining from "@/assets/images/session-balance-training.jpg";
import cervicalAssessment from "@/assets/images/session-cervical-assessment.jpg";

/**
 * Media registry. Images are statically imported so Next.js knows their
 * dimensions and generates blur placeholders at build time.
 *
 * These are royalty-free stock photos (Pexels / Unsplash licence). Replace
 * them with real clinic photos — with patient consent — whenever available;
 * only the `src` import needs to change.
 */

export const heroPhoto: Photo = {
  src: heroTreatmentTable,
  alt: "Physiotherapist treating a patient lying on a treatment table",
  credit: {
    source: "Pexels",
    url: "https://www.pexels.com/photo/patient-lying-on-his-hide-being-examined-by-a-physiotherapist-20860610/",
  },
};

export const aboutPhoto: Photo = {
  src: aboutShoulderAssessment,
  alt: "Physiotherapist guiding a patient through a shoulder stretch",
  credit: {
    source: "Pexels",
    url: "https://www.pexels.com/photo/physiotherapist-massaging-arms-of-patient-20860596/",
  },
};

export const homeVisitPhoto: Photo = {
  src: homeVisitSession,
  alt: "Therapist helping a patient stretch her arm in a bright room at home",
  credit: {
    source: "Pexels",
    url: "https://www.pexels.com/photo/woman-in-white-long-sleeve-shirt-stretching-woman-s-arm-5793713/",
  },
};

export const sessionPhotos: readonly SessionPhoto[] = [
  {
    id: "core-stability",
    title: "Core stabilisation",
    caption: "Guided bird-dog exercise to build deep core strength and protect the lower back.",
    tag: "Back Pain",
    src: coreStability,
    alt: "Physiotherapist supporting a patient doing a core stability exercise on a mat",
    credit: { source: "Pexels", url: "https://www.pexels.com/photo/woman-helping-patient-exercising-20860621/" },
  },
  {
    id: "cervical-assessment",
    title: "Neck & posture assessment",
    caption: "Hands-on assessment of neck movement and posture before planning cervical care.",
    tag: "Cervical Pain",
    src: cervicalAssessment,
    alt: "Physiotherapist assessing a patient's neck posture",
    credit: { source: "Pexels", url: "https://www.pexels.com/photo/physiotherapist-massaging-arm-20860585/" },
  },
  {
    id: "knee-assessment",
    title: "Knee joint evaluation",
    caption: "Checking knee stability and range of motion to tailor a strengthening plan.",
    tag: "Knee Pain",
    src: kneeAssessment,
    alt: "Physiotherapist examining a patient's knee",
    credit: {
      source: "Unsplash",
      url: "https://unsplash.com/photos/a-man-getting-his-leg-examined-by-a-doctor-pbUWW-CBoqY",
    },
  },
  {
    id: "sciatic-stretch",
    title: "Nerve & hamstring mobility",
    caption: "Straight-leg raise to assess and gently mobilise the sciatic nerve.",
    tag: "Sciatica",
    src: sciaticStretch,
    alt: "Physiotherapist lifting a patient's straight leg during a stretch",
    credit: { source: "Pexels", url: "https://www.pexels.com/photo/physiotherapist-holding-patient-leg-20860584/" },
  },
  {
    id: "resistance-band",
    title: "Shoulder rehabilitation",
    caption: "Resistance-band work to restore strength and movement in a stiff shoulder.",
    tag: "Frozen Shoulder",
    src: resistanceBand,
    alt: "Patient pulling a resistance band while the physiotherapist supports her shoulder",
    credit: {
      source: "Pexels",
      url: "https://www.pexels.com/photo/crop-orthopedist-checking-up-female-patient-with-elastic-band-4506163/",
    },
  },
  {
    id: "spinal-mobilisation",
    title: "Manual therapy",
    caption: "Spinal mobilisation to ease stiffness in the upper back and neck.",
    tag: "Back Pain",
    src: spinalMobilisation,
    alt: "Therapist applying manual therapy to a patient's upper back",
    credit: {
      source: "Unsplash",
      url: "https://unsplash.com/photos/chiropractor-adjusting-patients-upper-back-and-neck-ZzkNkbUxFMc",
    },
  },
  {
    id: "ultrasound-therapy",
    title: "Therapeutic modalities",
    caption: "Electro- and ultrasound therapy to calm pain and speed up tissue healing.",
    tag: "Pain Relief",
    src: ultrasoundTherapy,
    alt: "Therapist using a therapy device on a patient's forearm",
    credit: {
      source: "Unsplash",
      url: "https://unsplash.com/photos/therapist-using-ultrasound-device-on-patients-arm-PBdLYkML-b0",
    },
  },
  {
    id: "balance-training",
    title: "Balance & gait training",
    caption: "Balance-board training to rebuild stability after injury or paralysis.",
    tag: "Neuro Rehab",
    src: balanceTraining,
    alt: "Patient standing on a balance board with the therapist's support",
    credit: { source: "Pexels", url: "https://www.pexels.com/photo/physiotherapy-balance-training-session-30483062/" },
  },
];
