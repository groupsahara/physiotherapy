import { imageSource } from "@/lib/cms/media";
import type { Site } from "@/lib/cms/types";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SessionGallery, type GalleryPhoto } from "./SessionGallery";

export function SessionsSection({ site }: { site: Site }) {
  const content = site.documents["section.sessions"];
  const photos: GalleryPhoto[] = site.collections.gallery.map((item) => ({
    id: item.id,
    title: item.title,
    caption: item.caption,
    tag: item.tag,
    image: imageSource(item.image),
    credit: item.creditLabel ? { label: item.creditLabel, url: item.creditUrl } : null,
  }));

  return (
    <Section id="sessions" labelledBy="sessions-title" tone="subtle">
      <SectionHeading
        id="sessions-title"
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <Reveal className="mt-14">
        <SessionGallery photos={photos} />
      </Reveal>
    </Section>
  );
}
