/**
 * Public site payload served by the backend CMS (`GET /api/v1/public/site`).
 * Mirrors section 12 of `backend_phy/docs/ADMIN_API.md` one to one: every key is
 * always present; empty optional values are "", null, false or [].
 */

/** `src` is a site-relative path ("/images/x.jpg") or an absolute media URL. */
export interface CmsImage {
  src: string;
  alt: string;
}

/** Page sections the website knows how to render. */
export const SECTION_IDS = [
  "hero",
  "highlights",
  "about",
  "services",
  "approach",
  "sessions",
  "homeVisit",
  "testimonials",
  "faq",
  "contact",
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/** In-page anchors navigation may point to (each is also the anchor id of its section). */
export const NAV_TARGETS = ["about", "services", "approach", "sessions", "testimonials", "faq", "contact"] as const;
export type NavTarget = (typeof NAV_TARGETS)[number];

export interface PhoneNumber {
  /** Shown in the UI, e.g. "+91 99100 84082". */
  display: string;
  /** E.164, used for `tel:` links and structured data, e.g. "+919910084082". */
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

export interface SiteIdentity {
  name: string;
  legalName: string;
  tagline: string;
  logoSubtitle: string;
  monogram: string;
  logo: CmsImage | null;
  themeColor: string;
  language: string;
  locale: string;
  timeZone: string;
}

export interface SiteSeo {
  title: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
  shareHeadline: string;
  shareImage: CmsImage | null;
}

export interface SiteContact {
  phones: PhoneNumber[];
  /** Digits only with country code — the format wa.me expects. */
  whatsapp: string;
  whatsappMessage: string;
  email: string;
  address: PostalAddress;
  mapsPlaceName: string;
}

export interface SitePractitioner {
  name: string;
  qualifications: string[];
  role: string;
  shortTitle: string;
  jobTitle: string;
}

export interface LayoutSection {
  id: SectionId;
  enabled: boolean;
}

export interface NavItem {
  target: NavTarget;
  label: string;
}

export interface SiteLayout {
  sections: LayoutSection[];
  navigation: NavItem[];
  bookButtonLabel: string;
  callButtonPrefix: string;
  topBarEnabled: boolean;
  topBarNotice: string;
  floatingWhatsApp: boolean;
}

/** Eyebrow / title / description trio shared by most sections. */
export interface SectionHeadingContent {
  eyebrow: string;
  title: string;
  description: string;
}

export interface HeroContent {
  badge: string;
  titleLead: string;
  titleHighlight: string;
  /** May contain `**bold**` markup. */
  intro: string;
  primaryCtaLabel: string;
  promises: string[];
  image: CmsImage | null;
  showPractitionerCard: boolean;
  cardTitle: string;
  cardSubtitle: string;
}

export interface AboutContent extends SectionHeadingContent {
  paragraphs: string[];
  image: CmsImage | null;
}

export interface ServicesContent extends SectionHeadingContent {
  bookLabel: string;
  ctaTitle: string;
  ctaText: string;
}

export interface HomeVisitContent {
  badge: string;
  title: string;
  description: string;
  idealFor: string[];
  whatsappLabel: string;
  whatsappMessage: string;
  image: CmsImage | null;
}

export interface ContactContent extends SectionHeadingContent {
  visitTitle: string;
  directionsLabel: string;
  callTitle: string;
  emailTitle: string;
  emailSubject: string;
  homeVisitTitle: string;
  homeVisitText: string;
  formTitle: string;
  formSubtitle: string;
  showMap: boolean;
}

export interface FooterContent {
  blurb: string;
  badge: string;
  exploreTitle: string;
  treatmentsTitle: string;
  contactTitle: string;
  bottomNote: string;
}

export interface NotFoundContent {
  title: string;
  message: string;
  ctaLabel: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface VisitTypeOption extends SelectOption {
  hint: string;
}

export interface BookingFormContent {
  visitTypes: VisitTypeOption[];
  /** The first option is pre-selected. */
  timeSlots: SelectOption[];
  /** Empty hides the "not sure" treatment option. */
  unsureOptionLabel: string;
  maxDaysAhead: number | null;
  messageMaxLength: number | null;
  messagePlaceholder: string;
  submitLabel: string;
  footnote: string;
  successMessage: string;
  fallbackMessage: string;
}

export interface SiteDocuments {
  "site.identity": SiteIdentity;
  "site.seo": SiteSeo;
  "site.contact": SiteContact;
  "site.practitioner": SitePractitioner;
  "site.layout": SiteLayout;
  "section.hero": HeroContent;
  "section.about": AboutContent;
  "section.services": ServicesContent;
  "section.approach": SectionHeadingContent;
  "section.sessions": SectionHeadingContent;
  "section.homeVisit": HomeVisitContent;
  "section.testimonials": SectionHeadingContent;
  "section.faq": SectionHeadingContent;
  "section.contact": ContactContent;
  "section.footer": FooterContent;
  "section.notFound": NotFoundContent;
  "booking.form": BookingFormContent;
}

interface CollectionItem {
  id: string;
}

export interface Treatment extends CollectionItem {
  slug: string;
  title: string;
  summary: string;
  icon: string;
  points: string[];
}

/** Icon tile used by highlights, reasons and approach steps. */
export interface Feature extends CollectionItem {
  title: string;
  description: string;
  icon: string;
}

export interface GalleryItem extends CollectionItem {
  title: string;
  caption: string;
  tag: string;
  image: CmsImage;
  creditLabel: string;
  creditUrl: string;
}

export interface Testimonial extends CollectionItem {
  name: string;
  context: string;
  quote: string;
  rating: number;
}

export interface Faq extends CollectionItem {
  question: string;
  answer: string;
}

/** Published items only, in display order. */
export interface SiteCollections {
  treatments: Treatment[];
  highlights: Feature[];
  reasons: Feature[];
  approachSteps: Feature[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  faqs: Faq[];
}

export interface Site {
  /** Content version (ISO timestamp), bumped on every CMS write. */
  version: string;
  documents: SiteDocuments;
  collections: SiteCollections;
}
