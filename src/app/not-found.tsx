import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSite } from "@/lib/cms/get-site";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/button";

export default async function NotFound() {
  const site = await getSite();
  if (!site) return null; // The layout renders the "be right back" page.

  const { title, message, ctaLabel } = site.documents["section.notFound"];

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">{title || "Page not found"}</h1>
      {message ? <p className="mt-4 max-w-md text-lg text-muted">{message}</p> : null}
      {ctaLabel ? (
        <Link href="/" className={buttonClasses({ size: "lg", className: "mt-8" })}>
          {ctaLabel}
          <ArrowRight aria-hidden className="size-5" />
        </Link>
      ) : null}
    </Container>
  );
}
