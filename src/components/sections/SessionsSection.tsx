import { sessionPhotos } from "@/content/media";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SessionGallery } from "./SessionGallery";

export function SessionsSection() {
  return (
    <Section id="sessions" labelledBy="sessions-title" tone="subtle">
      <SectionHeading
        id="sessions-title"
        eyebrow="Inside our sessions"
        title="Hands-on care, guided every step of the way"
        description="A look at the kind of treatment our patients receive — assessment, manual therapy, modalities and progressive exercise."
      />
      <Reveal className="mt-14">
        <SessionGallery photos={sessionPhotos} />
      </Reveal>
    </Section>
  );
}
