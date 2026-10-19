import { CircleCheck, House, Phone } from "lucide-react";
import type { Site } from "@/lib/cms/types";
import { cn } from "@/lib/cn";
import { telHref, whatsappHref } from "@/lib/contact-links";
import { Container } from "@/components/ui/Container";
import { ContentImage } from "@/components/ui/ContentImage";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buttonClasses } from "@/components/ui/button";

/** Call-to-action banner promoting home visits. */
export function HomeVisitSection({ site }: { site: Site }) {
  const content = site.documents["section.homeVisit"];
  const { phones, whatsapp } = site.documents["site.contact"];
  const showWhatsApp = whatsapp !== "" && content.whatsappLabel !== "";

  return (
    <section aria-labelledby="home-visit-title" className="py-20 sm:py-24">
      <Container>
        <Reveal className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-[#0d3fa6] via-[#1557d6] to-[#2f7cf0] text-white shadow-lift dark:from-[#0a2a6e] dark:via-[#0f3d99] dark:to-[#1a56c4]">
          <div aria-hidden className="bg-grid absolute inset-0 opacity-30 [--grid-line:rgb(255_255_255/0.12)]" />
          <div aria-hidden className="absolute -top-24 -left-24 size-80 rounded-full bg-white/10 blur-3xl" />

          <div className={cn("relative grid items-center", content.image && "lg:grid-cols-[1.15fr_1fr]")}>
            <div className="p-8 sm:p-12 lg:p-14">
              {content.badge ? (
                <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] font-semibold">
                  <House aria-hidden className="size-4" />
                  {content.badge}
                </p>
              ) : null}
              <h2
                id="home-visit-title"
                className={cn("font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl", content.badge && "mt-5")}
              >
                {content.title}
              </h2>
              {content.description ? (
                <p className="mt-4 max-w-lg text-lg leading-relaxed text-blue-100">{content.description}</p>
              ) : null}

              {content.idealFor.length > 0 && (
                <ul className="mt-6 grid max-w-lg grid-cols-2 gap-x-4 gap-y-2.5">
                  {content.idealFor.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[15px] text-white/95">
                      <CircleCheck aria-hidden className="size-4 shrink-0 text-sky-200" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {(phones.length > 0 || showWhatsApp) && (
                <div className="mt-9 grid gap-3 sm:flex sm:flex-wrap">
                  {phones.map((phone) => (
                    <a key={phone.e164} href={telHref(phone)} className={buttonClasses({ variant: "onBrand" })}>
                      <Phone aria-hidden className="size-5" />
                      {phone.display}
                    </a>
                  ))}
                  {showWhatsApp && (
                    <a
                      href={whatsappHref(whatsapp, content.whatsappMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClasses({ variant: "whatsapp" })}
                    >
                      <WhatsAppIcon className="size-5" />
                      {content.whatsappLabel}
                    </a>
                  )}
                </div>
              )}
            </div>

            {content.image && (
              <div className="relative hidden h-full min-h-110 lg:block">
                <ContentImage
                  image={content.image}
                  fill
                  sizes="40vw"
                  className="bg-white/10 object-cover [mask-image:linear-gradient(to_right,transparent,black_30%)]"
                />
              </div>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
