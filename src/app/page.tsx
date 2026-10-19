import type { Metadata } from "next";
import { createElement, type ComponentType } from "react";
import { getSite } from "@/lib/cms/get-site";
import { visibleSections } from "@/lib/cms/selectors";
import type { SectionId, Site } from "@/lib/cms/types";
import { openGraphFor } from "@/lib/seo/metadata";
import { shareImageFor } from "@/lib/seo/share-image";
import { buildClinicJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/structured-data";
import { absoluteUrl, siteUrl } from "@/lib/site-url";
import { HeroSection } from "@/components/sections/HeroSection";
import { HighlightsStrip } from "@/components/sections/HighlightsStrip";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ApproachSection } from "@/components/sections/ApproachSection";
import { SessionsSection } from "@/components/sections/SessionsSection";
import { HomeVisitSection } from "@/components/sections/HomeVisitSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactSection } from "@/components/sections/ContactSection";

/** Every section the CMS can place on the page. */
const SECTIONS: Record<SectionId, ComponentType<{ site: Site }>> = {
  hero: HeroSection,
  highlights: HighlightsStrip,
  about: AboutSection,
  services: ServicesSection,
  approach: ApproachSection,
  sessions: SessionsSection,
  homeVisit: HomeVisitSection,
  testimonials: TestimonialsSection,
  faq: FaqSection,
  contact: ContactSection,
};

/**
 * Root-level `opengraph-image` files are attached to this page segment too, and would
 * replace the layout's share image unless the page sets `openGraph` itself.
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return site ? { openGraph: openGraphFor(site) } : {};
}

/**
 * Landing page = the sections listed in the CMS layout, in that order. Disabled
 * sections and sections whose collection is empty are left out.
 */
export default async function HomePage() {
  const site = await getSite();
  if (!site) return null; // The layout renders the "be right back" page.

  const sections = visibleSections(site);
  const structuredData = [
    buildClinicJsonLd(site, siteUrl, absoluteUrl(shareImageFor(site).url)),
    // FAQ rich results must match questions visible on the page.
    ...(sections.includes("faq") ? [buildFaqJsonLd(site.collections.faqs)] : []),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
      {sections.map((id) => createElement(SECTIONS[id], { key: id, site }))}
    </>
  );
}
