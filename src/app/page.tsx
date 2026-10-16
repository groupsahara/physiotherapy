import { siteConfig } from "@/config/site";
import { faqs } from "@/content/faqs";
import { services } from "@/content/services";
import { buildClinicJsonLd, buildFaqJsonLd, serializeJsonLd } from "@/lib/seo/structured-data";
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

/**
 * Landing page = an ordered composition of self-contained sections.
 * Reordering, adding or removing a section is a one-line change here.
 */
export default function HomePage() {
  const structuredData = [buildClinicJsonLd(siteConfig, services), buildFaqJsonLd(faqs)];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
      <HeroSection />
      <HighlightsStrip />
      <AboutSection />
      <ServicesSection />
      <ApproachSection />
      <SessionsSection />
      <HomeVisitSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
