/**
 * Public origin of the deployed website (env `NEXT_PUBLIC_SITE_URL`, no trailing slash).
 * Deployment configuration, not content: used for canonical URLs, sitemap and social cards.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002").replace(/\/+$/, "");

/** Resolves a site-relative path (or passes through an absolute URL). */
export function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, `${siteUrl}/`).toString();
}
