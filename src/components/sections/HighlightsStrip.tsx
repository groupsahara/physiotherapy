import type { Site } from "@/lib/cms/types";
import { CmsIcon } from "@/components/ui/CmsIcon";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/** Credential strip that sits between the hero and the About section. */
export function HighlightsStrip({ site }: { site: Site }) {
  return (
    <div className="relative z-10 -mt-6 lg:-mt-12">
      <Container>
        <Reveal>
          {/* gap-px over a border-coloured background draws hairline dividers at every breakpoint */}
          <ul className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border shadow-card sm:grid-cols-2 lg:grid-cols-4">
            {site.collections.highlights.map(({ id, title, description, icon }) => (
              <li key={id} className="flex items-center gap-4 bg-surface p-5 sm:p-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-brand">
                  <CmsIcon name={icon} className="size-6" />
                </span>
                <span>
                  <span className="block font-display text-[15.5px] font-bold">{title}</span>
                  {description ? <span className="text-sm text-muted">{description}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </div>
  );
}
