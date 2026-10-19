import { Check, Phone } from "lucide-react";
import { bookAction, callAction } from "@/lib/cms/selectors";
import type { Site } from "@/lib/cms/types";
import { BookServiceLink } from "@/features/appointment/components/BookServiceLink";
import { CmsIcon } from "@/components/ui/CmsIcon";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClasses } from "@/components/ui/button";

export function ServicesSection({ site }: { site: Site }) {
  const content = site.documents["section.services"];
  const book = bookAction(site, content.bookLabel);
  const call = callAction(site);

  return (
    <Section id="services" labelledBy="services-title" tone="subtle">
      <SectionHeading
        id="services-title"
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {site.collections.treatments.map(({ id, slug, title, summary, points, icon }, i) => (
          <Reveal
            as="li"
            key={id}
            delay={(i % 4) * 80}
            className="group card relative flex flex-col overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lift"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary to-sky-400 transition-transform duration-500 group-hover:scale-x-100"
            />
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-brand transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-fg">
              <CmsIcon name={icon} className="size-7" />
            </span>
            <h3 className="mt-6 font-display text-xl font-bold">{title}</h3>
            {summary ? <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{summary}</p> : null}
            {points.length > 0 && (
              <ul className="mt-5 space-y-2 border-t border-border pt-5">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-fg">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
                    {point}
                  </li>
                ))}
              </ul>
            )}
            {book && (
              <div className="mt-auto pt-6">
                <BookServiceLink treatment={slug} title={title} label={book.label} href={book.href} />
              </div>
            )}
          </Reveal>
        ))}
      </ul>

      {(content.ctaTitle || content.ctaText) && (
        <Reveal className="mt-12 flex flex-col items-center justify-between gap-5 rounded-3xl border border-dashed border-brand/40 bg-surface p-6 text-center sm:flex-row sm:p-8 sm:text-left">
          <div>
            {content.ctaTitle ? <p className="font-display text-lg font-bold">{content.ctaTitle}</p> : null}
            {content.ctaText ? <p className="mt-1 text-muted">{content.ctaText}</p> : null}
          </div>
          {call && (
            <a href={call.href} className={buttonClasses({ variant: "primary" })}>
              <Phone aria-hidden className="size-4" />
              {call.label}
            </a>
          )}
        </Reveal>
      )}
    </Section>
  );
}
