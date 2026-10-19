import { GraduationCap } from "lucide-react";
import type { Site } from "@/lib/cms/types";
import { cn } from "@/lib/cn";
import { CmsIcon } from "@/components/ui/CmsIcon";
import { ContentImage } from "@/components/ui/ContentImage";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function AboutSection({ site }: { site: Site }) {
  const about = site.documents["section.about"];
  const practitioner = site.documents["site.practitioner"];
  const reasons = site.collections.reasons;
  const paragraphs = [about.description, ...about.paragraphs].filter(Boolean);

  return (
    <Section id="about" labelledBy="about-title">
      <div className={cn("grid items-center gap-14 lg:gap-20", about.image && "lg:grid-cols-2")}>
        {about.image && (
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-4/3 overflow-hidden rounded-4xl bg-surface-2 shadow-lift lg:aspect-4/5">
              <ContentImage
                image={about.image}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            {practitioner.name && (
              <div className="absolute -bottom-8 left-6 right-6 rounded-2xl border border-border bg-surface p-5 shadow-lift sm:left-auto sm:-right-6 sm:w-80">
                <div className="flex items-start gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-fg">
                    <GraduationCap aria-hidden className="size-6" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold">{practitioner.name}</p>
                    {practitioner.qualifications.length > 0 && (
                      <p className="text-sm font-semibold text-brand">{practitioner.qualifications.join(" · ")}</p>
                    )}
                    {practitioner.shortTitle && (
                      <p className="mt-1 text-[13px] leading-snug text-muted">{practitioner.shortTitle}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Reveal>
        )}

        <div className="order-1 lg:order-2">
          <Reveal>
            {about.eyebrow ? <p className="eyebrow">{about.eyebrow}</p> : null}
            <h2 id="about-title" className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              {about.title}
            </h2>
            {paragraphs.map((paragraph, i) => (
              <p key={i} className={cn("text-lg leading-relaxed text-muted text-pretty", i === 0 ? "mt-5" : "mt-4")}>
                {paragraph}
              </p>
            ))}
          </Reveal>

          {reasons.length > 0 && (
            <ul className="mt-9 grid gap-4">
              {reasons.map(({ id, title, description, icon }, i) => (
                <Reveal
                  as="li"
                  key={id}
                  delay={i * 90}
                  className="flex gap-4 rounded-2xl border border-border bg-bg-subtle p-4 transition-colors hover:border-brand/40"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface text-brand shadow-card">
                    <CmsIcon name={icon} className="size-5" />
                  </span>
                  <span>
                    <span className="block font-display font-bold">{title}</span>
                    {description ? <span className="text-[15px] text-muted">{description}</span> : null}
                  </span>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Section>
  );
}
