import { Check, Phone } from "lucide-react";
import { primaryPhone } from "@/config/site";
import { services } from "@/content/services";
import { telHref } from "@/lib/contact-links";
import { BookServiceLink } from "@/features/appointment/components/BookServiceLink";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClasses } from "@/components/ui/button";

export function ServicesSection() {
  return (
    <Section id="services" labelledBy="services-title" tone="subtle">
      <SectionHeading
        id="services-title"
        eyebrow="Treatment available for"
        title="Specialised care for pain, injury & recovery"
        description="Evidence-based physiotherapy for the conditions we see most — each plan tailored to your body, your work and your goals."
      />

      <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(({ slug, title, summary, treatments, icon: Icon }, i) => (
          <Reveal
            as="li"
            key={slug}
            delay={(i % 4) * 80}
            className="group card relative flex flex-col overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lift"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary to-sky-400 transition-transform duration-500 group-hover:scale-x-100"
            />
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-brand transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-fg">
              <Icon aria-hidden className="size-7" />
            </span>
            <h3 className="mt-6 font-display text-xl font-bold">{title}</h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{summary}</p>
            <ul className="mt-5 space-y-2 border-t border-border pt-5">
              {treatments.map((treatment) => (
                <li key={treatment} className="flex items-start gap-2 text-sm text-fg">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
                  {treatment}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <BookServiceLink service={slug} title={title} />
            </div>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-12 flex flex-col items-center justify-between gap-5 rounded-3xl border border-dashed border-brand/40 bg-surface p-6 text-center sm:flex-row sm:p-8 sm:text-left">
        <div>
          <p className="font-display text-lg font-bold">Not sure what&apos;s causing your pain?</p>
          <p className="mt-1 text-muted">Talk to us — we&apos;ll assess your condition and recommend the right treatment.</p>
        </div>
        <a href={telHref(primaryPhone)} className={buttonClasses({ variant: "primary" })}>
          <Phone aria-hidden className="size-4" />
          Call {primaryPhone.display}
        </a>
      </Reveal>
    </Section>
  );
}
