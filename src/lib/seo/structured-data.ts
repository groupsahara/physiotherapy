import type { SiteConfig } from "@/types/site";
import type { Faq, Service } from "@/types/content";

/**
 * schema.org JSON-LD builders. `Physiotherapy` is a MedicalBusiness subtype,
 * which lets search engines show the clinic as a local medical business.
 */

export function buildClinicJsonLd(site: SiteConfig, services: readonly Service[]) {
  const { address } = site.contact;

  return {
    "@context": "https://schema.org",
    "@type": "Physiotherapy",
    "@id": `${site.url}/#clinic`,
    name: site.legalName,
    alternateName: site.name,
    description: site.description,
    url: site.url,
    image: `${site.url}/opengraph-image`,
    telephone: site.contact.phones.map((phone) => phone.e164),
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${address.street}, ${address.landmark}`,
      addressLocality: `${address.locality}, ${address.city}`,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.countryCode,
    },
    areaServed: { "@type": "City", name: address.city },
    medicalSpecialty: "PhysicalTherapy",
    availableService: services.map((service) => ({
      "@type": "MedicalTherapy",
      name: `${service.title} physiotherapy`,
      description: service.summary,
    })),
    employee: {
      "@type": "Person",
      name: site.practitioner.name,
      jobTitle: "Physiotherapist",
      hasCredential: site.practitioner.qualifications.map((name) => ({
        "@type": "EducationalOccupationalCredential",
        name,
      })),
    },
  };
}

export function buildFaqJsonLd(faqs: readonly Faq[]) {
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
