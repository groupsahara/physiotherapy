import type { MetadataRoute } from "next";
import { getSite } from "@/lib/cms/get-site";
import { siteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSite();
  // The CMS content version is the time of the last content change.
  const lastModified = site && !Number.isNaN(Date.parse(site.version)) ? site.version : undefined;

  return [{ url: siteUrl, lastModified, changeFrequency: "monthly", priority: 1 }];
}
