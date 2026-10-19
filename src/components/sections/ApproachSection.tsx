import type { Site } from "@/lib/cms/types";
import { CmsIcon } from "@/components/ui/CmsIcon";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function ApproachSection({ site }: { site: Site }) {
  const content = site.documents["section.approach"];

  return (
    <Section id="approach" labelledBy="approach-title">
      <SectionHeading
        id="approach-title"
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <div className="relative mt-16">
        {/* Connector line on large screens */}
        <span
          aria-hidden
          className="absolute top-8 right-[12.5%] left-[12.5%] hidden h-0.5 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10 lg:block"
        />
        <ol className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {site.collections.approachSteps.map(({ id, title, description, icon }, i) => (
            <Reveal as="li" key={id} delay={i * 120} className="relative text-center">
              <span className="relative mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-fg shadow-[0_12px_30px_-10px_var(--primary)] ring-8 ring-bg">
                <CmsIcon name={icon} className="size-7" />
                <span className="absolute -top-2.5 -right-2.5 flex size-7 items-center justify-center rounded-full border-2 border-bg bg-surface font-display text-xs font-extrabold text-brand shadow-card">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <h3 className="mt-6 font-display text-xl font-bold">{title}</h3>
              {description ? <p className="mx-auto mt-2.5 max-w-xs text-[15px] leading-relaxed text-muted">{description}</p> : null}
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
