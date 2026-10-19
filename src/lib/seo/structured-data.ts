import { joinParts } from "@/lib/contact-links";
import type { Faq, Site } from "@/lib/cms/types";

/**
 * schema.org JSON-LD builders. `Physiotherapy` is a MedicalBusiness subtype,
 * which lets search engines show the clinic as a local medical business.
 * Empty CMS values are left out rather than published as blanks.
 */

type JsonObject = Record<string, unknown>;

function compact(object: JsonObject): JsonObject {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => value !== undefined && value !== "" && !(Array.isArray(value) && value.length === 0),
    ),
  );
}

/** @param origin public site origin; @param image absolute share-image URL. */
export function buildClinicJsonLd(site: Site, origin: string, image: string): JsonObject {
  const {
    "site.identity": identity,
    "site.seo": seo,
    "site.contact": contact,
    "site.practitioner": practitioner,
  } = site.documents;
  const { address } = contact;

  return compact({
    "@context": "https://schema.org",
    "@type": "Physiotherapy",
    "@id": `${origin}/#clinic`,
    name: identity.legalName || identity.name,
    alternateName: identity.legalName ? identity.name : undefined,
    description: seo.description,
    url: origin,
    image,
    telephone: contact.phones.map((phone) => phone.e164),
    email: contact.email,
    address: compact({
      "@type": "PostalAddress",
      streetAddress: joinParts([address.street, address.landmark], ", "),
      addressLocality: joinParts([address.locality, address.city], ", "),
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.countryCode,
    }),
    areaServed: address.city ? { "@type": "City", name: address.city } : undefined,
    medicalSpecialty: "PhysicalTherapy",
    availableService: site.collections.treatments.map((treatment) =>
      compact({ "@type": "MedicalTherapy", name: treatment.title, description: treatment.summary }),
    ),
    employee: practitioner.name
      ? compact({
          "@type": "Person",
          name: practitioner.name,
          jobTitle: practitioner.jobTitle,
          hasCredential: practitioner.qualifications.map((name) => ({
            "@type": "EducationalOccupationalCredential",
            name,
          })),
        })
      : undefined,
  });
}

export function buildFaqJsonLd(faqs: readonly Faq[]): JsonObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** Serialises JSON-LD safely for inlining in a <script> tag (prevents `</script>` injection). */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
