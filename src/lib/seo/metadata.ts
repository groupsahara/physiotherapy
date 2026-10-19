import type { Metadata } from "next";
import type { Site } from "@/lib/cms/types";
import { siteUrl } from "@/lib/site-url";
import { shareImageFor } from "./share-image";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

function homeTitle(site: Site): string {
  return site.documents["site.seo"].title || site.documents["site.identity"].name;
}

/** Open Graph for the home page; the share image is the CMS one or the generated card. */
export function openGraphFor(site: Site): OpenGraph {
  const { "site.identity": identity, "site.seo": seo } = site.documents;
  return {
    type: "website",
    locale: identity.locale || undefined,
    url: "/",
    siteName: identity.legalName || identity.name || undefined,
    title: homeTitle(site),
    description: seo.description || undefined,
    images: [shareImageFor(site)],
  };
}

/** Site-wide metadata built from the CMS (root layout). */
export function siteMetadata(site: Site): Metadata {
  const { "site.identity": identity, "site.seo": seo, "site.practitioner": practitioner } = site.documents;
  const title = homeTitle(site);
  const description = seo.description || undefined;

  return {
    metadataBase: new URL(siteUrl),
    title: seo.titleTemplate ? { default: title, template: seo.titleTemplate } : title,
    description,
    keywords: seo.keywords.length > 0 ? seo.keywords : undefined,
    applicationName: identity.name || undefined,
    authors: practitioner.name ? [{ name: practitioner.name }] : undefined,
    alternates: { canonical: "/" },
    openGraph: openGraphFor(site),
    twitter: { card: "summary_large_image", title, description, images: [shareImageFor(site)] },
    formatDetection: { telephone: true, email: true, address: true },
    robots: { index: true, follow: true },
  };
}

/** Metadata while the CMS is unreachable: brand-less and kept out of search indexes. */
export const unavailableMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "We'll be right back",
  robots: { index: false, follow: false },
};
