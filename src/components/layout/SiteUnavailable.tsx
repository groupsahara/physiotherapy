import { Container } from "@/components/ui/Container";

/**
 * Shown while the CMS cannot be reached and no content has been fetched yet.
 * Deliberately brand-less: without the CMS the site knows nothing about the business.
 */
export function SiteUnavailable() {
  return (
    <main id="main">
      <Container className="flex min-h-dvh flex-col items-center justify-center py-24 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">We&apos;ll be right back</h1>
        <p className="mt-4 max-w-md text-lg text-muted">
          This site is temporarily unavailable. Please check back in a few minutes.
        </p>
      </Container>
    </main>
  );
}
