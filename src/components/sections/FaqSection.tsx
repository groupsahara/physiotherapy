import { ChevronDown, Phone } from "lucide-react";
import { primaryPhone } from "@/lib/cms/selectors";
import type { Site } from "@/lib/cms/types";
import { telHref } from "@/lib/contact-links";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClasses } from "@/components/ui/button";

/** Native <details> accordion — accessible and works without JavaScript. */
export function FaqSection({ site }: { site: Site }) {
  const content = site.documents["section.faq"];
  const phone = primaryPhone(site);

  return (
    <Section id="faq" labelledBy="faq-title" tone="subtle">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="faq-title"
            align="left"
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
          {phone && (
            <Reveal className="mt-8">
              <a href={telHref(phone)} className={buttonClasses({ variant: "outline" })}>
                <Phone aria-hidden className="size-4" />
                {phone.display}
              </a>
            </Reveal>
          )}
        </div>

        <div className="space-y-3">
          {site.collections.faqs.map((faq, i) => (
            <Reveal key={faq.id} delay={i * 60}>
              <details name="faq" className="group card overflow-hidden p-0 open:border-brand/40" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display text-[17px] font-bold sm:p-6 [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-brand transition-transform duration-300 group-open:rotate-180">
                    <ChevronDown aria-hidden className="size-4" />
                  </span>
                </summary>
                <p className="px-5 pb-6 text-[15.5px] leading-relaxed text-muted sm:px-6">{faq.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
