import { z } from "zod";
import {
  NAV_TARGETS,
  SECTION_IDS,
  type BookingFormContent,
  type CmsImage,
  type ContactContent,
  type Faq,
  type Feature,
  type FooterContent,
  type GalleryItem,
  type HeroContent,
  type HomeVisitContent,
  type LayoutSection,
  type NavItem,
  type NotFoundContent,
  type PhoneNumber,
  type PostalAddress,
  type SectionHeadingContent,
  type SelectOption,
  type ServicesContent,
  type Site,
  type SiteContact,
  type SiteIdentity,
  type SiteLayout,
  type SitePractitioner,
  type SiteSeo,
  type AboutContent,
  type Testimonial,
  type Treatment,
  type VisitTypeOption,
} from "./types";

/**
 * Lenient runtime validation of the public site payload.
 *
 * The backend already validates content on write, so this layer only guards the
 * website against contract drift without ever taking the page down:
 *  - unknown keys are stripped,
 *  - a missing or malformed document field falls back to its empty value ("", null, false, []),
 *  - a malformed list or collection item is dropped and logged on the server.
 * Only a payload that is not shaped like `{ documents: {…}, collections: {…} }` is rejected.
 */

// ---------------------------------------------------------------- primitives

const text = z.string().catch("");
const flag = z.boolean().catch(false);
const nullableNumber = z.number().finite().nullable().catch(null);
const required = z.string().trim().min(1);

/** Site-relative path (not protocol-relative "//") or an http(s) URL. */
const IMAGE_SRC = /^(?:\/(?!\/)\S*|https?:\/\/\S+)$/i;
const PHONE_E164 = /^\+[1-9]\d{7,14}$/;

const image: z.ZodType<CmsImage> = z.object({
  src: z.string().trim().regex(IMAGE_SRC),
  alt: text,
});
const optionalImage = image.nullable().catch(null);

/** Only http(s) links are rendered as hrefs. */
const httpUrl = z.string().trim().regex(/^https?:\/\/\S+$/i).catch("");

/** List of non-empty strings; blank or non-string entries are skipped. */
const textList = z
  .array(z.unknown())
  .catch([])
  .transform((items) => items.filter((item): item is string => typeof item === "string" && item.trim() !== ""));

// ---------------------------------------------------------------- helpers

function describeItem(raw: unknown, index: number): string {
  const id = raw && typeof raw === "object" && "id" in raw ? String(raw.id) : undefined;
  return id ? `#${index} (id ${id})` : `#${index}`;
}

/** Keeps the items that match `schema`; logs and drops the rest. */
function keepValid<T>(items: unknown[], schema: z.ZodType<T>, label: string, key?: (item: T) => string): T[] {
  const kept: T[] = [];
  const seen = new Set<string>();

  items.forEach((raw, index) => {
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      console.warn(`[cms] Dropped invalid ${label} item ${describeItem(raw, index)}:\n${z.prettifyError(parsed.error)}`);
      return;
    }
    const identity = key?.(parsed.data);
    if (identity !== undefined) {
      if (seen.has(identity)) {
        console.warn(`[cms] Dropped duplicate ${label} item ${describeItem(raw, index)} ("${identity}")`);
        return;
      }
      seen.add(identity);
    }
    kept.push(parsed.data);
  });

  return kept;
}

/** Array whose malformed entries are dropped individually (never fails). */
function list<T>(schema: z.ZodType<T>, label: string, key?: (item: T) => string) {
  return z
    .array(z.unknown())
    .catch([])
    .transform((items) => keepValid(items, schema, label, key));
}

/** Object whose fields all recover on their own; a missing/non-object value yields the empty object. */
function lenientObject<S extends z.ZodRawShape>(shape: S) {
  const schema = z.object(shape);
  return schema.catch(() => schema.parse({}));
}

// ---------------------------------------------------------------- documents

const headingShape = { eyebrow: text, title: text, description: text };

const identity: z.ZodType<SiteIdentity> = lenientObject({
  name: text,
  legalName: text,
  tagline: text,
  logoSubtitle: text,
  monogram: text,
  logo: optionalImage,
  themeColor: text,
  language: text,
  locale: text,
  timeZone: text,
});

const seo: z.ZodType<SiteSeo> = lenientObject({
  title: text,
  titleTemplate: text,
  description: text,
  keywords: textList,
  shareHeadline: text,
  shareImage: optionalImage,
});

const phone: z.ZodType<PhoneNumber> = z.object({
  display: required,
  e164: z.string().trim().regex(PHONE_E164),
});

const address: z.ZodType<PostalAddress> = lenientObject({
  street: text,
  landmark: text,
  locality: text,
  city: text,
  region: text,
  postalCode: text,
  countryCode: text,
});

const contact: z.ZodType<SiteContact> = lenientObject({
  phones: list(phone, "contact phone", (p) => p.e164),
  whatsapp: text,
  whatsappMessage: text,
  email: text,
  address,
  mapsPlaceName: text,
});

const practitioner: z.ZodType<SitePractitioner> = lenientObject({
  name: text,
  qualifications: textList,
  role: text,
  shortTitle: text,
  jobTitle: text,
});

const layoutSection: z.ZodType<LayoutSection> = z.object({
  id: z.enum(SECTION_IDS),
  enabled: flag,
});

const navItem: z.ZodType<NavItem> = z.object({
  target: z.enum(NAV_TARGETS),
  label: required,
});

const layout: z.ZodType<SiteLayout> = lenientObject({
  sections: list(layoutSection, "layout section", (s) => s.id),
  navigation: list(navItem, "navigation"),
  bookButtonLabel: text,
  callButtonPrefix: text,
  topBarEnabled: flag,
  topBarNotice: text,
  floatingWhatsApp: flag,
});

const hero: z.ZodType<HeroContent> = lenientObject({
  badge: text,
  titleLead: text,
  titleHighlight: text,
  intro: text,
  primaryCtaLabel: text,
  promises: textList,
  image: optionalImage,
  showPractitionerCard: flag,
  cardTitle: text,
  cardSubtitle: text,
});

const heading: z.ZodType<SectionHeadingContent> = lenientObject(headingShape);

const about: z.ZodType<AboutContent> = lenientObject({
  ...headingShape,
  paragraphs: textList,
  image: optionalImage,
});

const services: z.ZodType<ServicesContent> = lenientObject({
  ...headingShape,
  bookLabel: text,
  ctaTitle: text,
  ctaText: text,
});

const homeVisit: z.ZodType<HomeVisitContent> = lenientObject({
  badge: text,
  title: text,
  description: text,
  idealFor: textList,
  whatsappLabel: text,
  whatsappMessage: text,
  image: optionalImage,
});

const contactSection: z.ZodType<ContactContent> = lenientObject({
  ...headingShape,
  visitTitle: text,
  directionsLabel: text,
  callTitle: text,
  emailTitle: text,
  emailSubject: text,
  homeVisitTitle: text,
  homeVisitText: text,
  formTitle: text,
  formSubtitle: text,
  showMap: flag,
});

const footer: z.ZodType<FooterContent> = lenientObject({
  blurb: text,
  badge: text,
  exploreTitle: text,
  treatmentsTitle: text,
  contactTitle: text,
  bottomNote: text,
});

const notFound: z.ZodType<NotFoundContent> = lenientObject({
  title: text,
  message: text,
  ctaLabel: text,
});

const selectOption: z.ZodType<SelectOption> = z.object({ value: required, label: required });
const visitTypeOption: z.ZodType<VisitTypeOption> = z.object({ value: required, label: required, hint: text });

const bookingForm: z.ZodType<BookingFormContent> = lenientObject({
  visitTypes: list(visitTypeOption, "visit type", (o) => o.value),
  timeSlots: list(selectOption, "time slot", (o) => o.value),
  unsureOptionLabel: text,
  maxDaysAhead: nullableNumber,
  messageMaxLength: nullableNumber,
  messagePlaceholder: text,
  submitLabel: text,
  footnote: text,
  successMessage: text,
  fallbackMessage: text,
});

// ---------------------------------------------------------------- collections

const id = required;

const treatment: z.ZodType<Treatment> = z.object({
  id,
  slug: required,
  title: required,
  summary: text,
  icon: text,
  points: textList,
});

const feature: z.ZodType<Feature> = z.object({ id, title: required, description: text, icon: text });

const galleryItem: z.ZodType<GalleryItem> = z.object({
  id,
  title: required,
  caption: text,
  tag: text,
  image,
  creditLabel: text,
  creditUrl: httpUrl,
});

const testimonial: z.ZodType<Testimonial> = z.object({
  id,
  name: required,
  context: text,
  quote: required,
  rating: z.number().int().min(1).max(5),
});

const faq: z.ZodType<Faq> = z.object({ id, question: required, answer: required });

// ---------------------------------------------------------------- payload

const siteSchema: z.ZodType<Site> = z.object({
  version: text,
  documents: z.object({
    "site.identity": identity,
    "site.seo": seo,
    "site.contact": contact,
    "site.practitioner": practitioner,
    "site.layout": layout,
    "section.hero": hero,
    "section.about": about,
    "section.services": services,
    "section.approach": heading,
    "section.sessions": heading,
    "section.homeVisit": homeVisit,
    "section.testimonials": heading,
    "section.faq": heading,
    "section.contact": contactSection,
    "section.footer": footer,
    "section.notFound": notFound,
    "booking.form": bookingForm,
  }),
  collections: z.object({
    treatments: list(treatment, "treatments", (t) => t.slug),
    highlights: list(feature, "highlights"),
    reasons: list(feature, "reasons"),
    approachSteps: list(feature, "approachSteps"),
    gallery: list(galleryItem, "gallery"),
    testimonials: list(testimonial, "testimonials"),
    faqs: list(faq, "faqs"),
  }),
});

/** Validates the payload leniently. Returns null only when it is structurally unusable. */
export function parseSite(payload: unknown): Site | null {
  const parsed = siteSchema.safeParse(payload);
  if (!parsed.success) {
    console.error(`[cms] Site payload rejected:\n${z.prettifyError(parsed.error)}`);
    return null;
  }
  return parsed.data;
}
