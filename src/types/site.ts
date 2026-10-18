/**
 * Domain types for the clinic's identity and contact surface.
 * Everything the UI shows about the business is typed here so that a
 * single config object (`src/config/site.ts`) drives the whole site.
 */

export interface PhoneNumber {
  /** Human-friendly format shown in the UI, e.g. "+91 99100 84082". */
  display: string;
  /** E.164 format used for `tel:` links and structured data, e.g. "+919910084082". */
  e164: string;
}

export interface PostalAddress {
  street: string;
  landmark: string;
  locality: string;
  city: string;
  region: string;
  postalCode: string;
  countryCode: string;
}

export interface Practitioner {
  name: string;
  qualifications: readonly string[];
  role: string;
}

export interface SiteConfig {
  /** Short brand name used in the logo and page titles. */
  name: string;
  /** Full registered name as printed on the visiting card. */
  legalName: string;
  tagline: string;
  description: string;
  /** Absolute origin of the deployed site (no trailing slash). */
  url: string;
  locale: string;
  timeZone: string;
  practitioner: Practitioner;
  contact: {
    phones: readonly PhoneNumber[];
    /** Digits only, with country code — the format wa.me expects. */
    whatsapp: string;
    email: string;
    address: PostalAddress;
    /** Business name exactly as listed on Google Maps — pins the listing rather than a bare address. */
    mapsPlaceName: string;
  };
  policies: {
    homeVisitOnCall: boolean;
    consultationChargeable: boolean;
  };
  keywords: readonly string[];
}
