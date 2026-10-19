import { telHref } from "@/lib/contact-links";
import type { NavItem, NavTarget, PhoneNumber, SectionId, Site } from "./types";

/**
 * Pure read-models derived from the CMS payload, shared by the layout, the page
 * and the metadata so they always agree on what is visible.
 */

export interface LinkAction {
  label: string;
  href: string;
}

/** Whether a section has anything to show (an empty collection hides its section). */
function hasContent(site: Site, id: SectionId): boolean {
  const { documents, collections } = site;
  switch (id) {
    case "hero":
      return Boolean(documents["section.hero"].titleLead || documents["section.hero"].titleHighlight);
    case "highlights":
      return collections.highlights.length > 0;
    case "about":
      return Boolean(documents["section.about"].title || documents["section.about"].paragraphs.length > 0);
    case "services":
      return collections.treatments.length > 0;
    case "approach":
      return collections.approachSteps.length > 0;
    case "sessions":
      return collections.gallery.length > 0;
    case "homeVisit":
      return Boolean(documents["section.homeVisit"].title);
    case "testimonials":
      return collections.testimonials.length > 0;
    case "faq":
      return collections.faqs.length > 0;
    case "contact":
      return true;
  }
}

/** Sections rendered on the home page, in CMS order. */
export function visibleSections(site: Site): SectionId[] {
  return site.documents["site.layout"].sections
    .filter((section) => section.enabled && hasContent(site, section.id))
    .map((section) => section.id);
}

export function isSectionVisible(site: Site, id: SectionId): boolean {
  return visibleSections(site).includes(id);
}

/** Menu links whose target section is actually on the page (one link per target). */
export function visibleNavigation(site: Site): NavItem[] {
  const visible = new Set<SectionId>(visibleSections(site));
  const seen = new Set<NavTarget>();
  return site.documents["site.layout"].navigation.filter((item) => {
    if (!visible.has(item.target) || seen.has(item.target)) return false;
    seen.add(item.target);
    return true;
  });
}

/** The first phone number is the primary one. */
export function primaryPhone(site: Site): PhoneNumber | undefined {
  return site.documents["site.contact"].phones[0];
}

/** "Call +91 …" button for the primary phone, when there is one. */
export function callAction(site: Site): LinkAction | null {
  const phone = primaryPhone(site);
  if (!phone) return null;
  const prefix = site.documents["site.layout"].callButtonPrefix;
  return { label: prefix ? `${prefix} ${phone.display}` : phone.display, href: telHref(phone) };
}

/** Link to the booking form, when the contact section is shown and the label is set. */
export function bookAction(site: Site, label: string): LinkAction | null {
  return label && isSectionVisible(site, "contact") ? { label, href: "#contact" } : null;
}
