import type { SiteConfig } from "@/types/site";

/**
 * Single source of truth for the business — transcribed from the
 * Moving Cure visiting card. Change a phone number or address here and it
 * updates the header, footer, contact section, WhatsApp links, map and SEO.
 */
export const siteConfig = {
  name: "Moving Cure",
  legalName: "Moving Cure Physiotherapy Clinic & Rehabilitation Centre",
  tagline: "Physiotherapy Clinic & Rehabilitation Centre",
  description:
    "Expert physiotherapy in Vishwas Nagar, Delhi by Dr. Deepak, BPT (D.U.), DCPT. Treatment for back pain, cervical pain, knee pain, sciatica, tail bone pain, frozen shoulder, paralysis rehabilitation and other orthopedic & neurological problems. Home visits available on call.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_IN",
  timeZone: "Asia/Kolkata",
  practitioner: {
    name: "Dr. Deepak",
    qualifications: ["BPT (D.U.)", "DCPT"],
    role: "Specialized, Well-Experienced & Registered Physiotherapist",
  },
  contact: {
    phones: [
      { display: "+91 99100 84082", e164: "+919910084082" },
      { display: "+91 82875 54047", e164: "+918287554047" },
    ],
    whatsapp: "919910084082",
    email: "movingcure24@gmail.com",
    address: {
      street: "1/150, Street No. 1, Karkari Road",
      landmark: "Near Shani Bazaar Chowk",
      locality: "Vishwas Nagar",
      city: "Delhi",
      region: "Delhi",
      postalCode: "110032",
      countryCode: "IN",
    },
    mapsPlaceName: "Moving Cure Physiotherapy Clinic & Rehabilitation Center",
  },
  policies: {
    homeVisitOnCall: true,
    consultationChargeable: true,
  },
  keywords: [
    "physiotherapist in Vishwas Nagar",
    "physiotherapy clinic East Delhi",
    "back pain treatment Delhi",
    "cervical pain physiotherapy",
    "knee pain physiotherapy",
    "sciatica treatment",
    "frozen shoulder treatment",
    "paralysis rehabilitation Delhi",
    "home visit physiotherapist Delhi",
    "Moving Cure physiotherapy",
  ],
} as const satisfies SiteConfig;

export const primaryPhone = siteConfig.contact.phones[0];
