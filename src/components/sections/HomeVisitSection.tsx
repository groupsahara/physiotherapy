import Image from "next/image";
import { CircleCheck, House, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { homeVisitPhoto } from "@/content/media";
import { telHref, whatsappHref } from "@/lib/contact-links";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buttonClasses } from "@/components/ui/button";

const idealFor = ["Elderly patients", "Post-surgery recovery", "Paralysis & stroke rehab", "Severe back pain"];

/** Call-to-action banner for the "Home visit available on call" service. */
export function HomeVisitSection() {
  const { phones, whatsapp } = siteConfig.contact;

  return (
    <section aria-labelledby="home-visit-title" className="py-20 sm:py-24">
      <Container>
        <Reveal className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-[#0d3fa6] via-[#1557d6] to-[#2f7cf0] text-white shadow-lift dark:from-[#0a2a6e] dark:via-[#0f3d99] dark:to-[#1a56c4]">
          <div aria-hidden className="bg-grid absolute inset-0 opacity-30 [--grid-line:rgb(255_255_255/0.12)]" />
          <div aria-hidden className="absolute -top-24 -left-24 size-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative grid items-center lg:grid-cols-[1.15fr_1fr]">
            <div className="p-8 sm:p-12 lg:p-14">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[13px] font-semibold">
                <House aria-hidden className="size-4" />
                Home visit available on call
              </p>
              <h2 id="home-visit-title" className="mt-5 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                Can&apos;t travel to the clinic? We&apos;ll bring the treatment home.
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-blue-100">
                The same professional, one-on-one physiotherapy — delivered in the comfort and safety of your
                home. Just call to schedule a visit.
              </p>

              <ul className="mt-6 grid max-w-lg grid-cols-2 gap-x-4 gap-y-2.5">
                {idealFor.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[15px] text-white/95">
                    <CircleCheck aria-hidden className="size-4 shrink-0 text-sky-200" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-9 grid gap-3 sm:flex sm:flex-wrap">
                {phones.map((phone) => (
                  <a key={phone.e164} href={telHref(phone)} className={buttonClasses({ variant: "onBrand" })}>
                    <Phone aria-hidden className="size-5" />
                    {phone.display}
                  </a>
                ))}
                <a
                  href={whatsappHref(whatsapp, `Hello ${siteConfig.name}, I'd like to book a home visit.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses({ variant: "whatsapp" })}
                >
                  <WhatsAppIcon className="size-5" />
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="relative hidden h-full min-h-110 lg:block">
              <Image
                src={homeVisitPhoto.src}
                alt={homeVisitPhoto.alt}
                fill
                placeholder="blur"
                sizes="40vw"
                className="object-cover [mask-image:linear-gradient(to_right,transparent,black_30%)]"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
