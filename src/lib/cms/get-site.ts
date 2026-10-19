import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { getApiEnv } from "@/lib/env";
import { parseSite } from "./schema";
import type { Site } from "./types";

/** Tag of every cache entry derived from CMS content — see `app/api/revalidate/route.ts`. */
export const SITE_CACHE_TAG = "site";

const SITE_PATH = "/api/v1/public/site";
const FETCH_TIMEOUT_MS = 5_000;

const envelopeSchema = z.object({ success: z.literal(true), data: z.unknown() });

/**
 * Content fetched successfully earlier by this server process. Served while the API
 * is briefly unreachable during a revalidation, instead of the "be right back" page.
 */
let lastGoodSite: Site | undefined;

/**
 * Everything the website shows, from the backend CMS.
 *
 * Cached with `use cache` and tagged `site`: the backend calls `POST /api/revalidate`
 * after every content change, and the hourly lifetime is only a safety net for a lost
 * ping. Resolves to `null` when the CMS is unreachable and nothing was fetched before —
 * callers then render a minimal, brand-less "We'll be right back" page. That outcome is
 * cached for 30 seconds only, so the site recovers on its own once the API is back.
 */
export async function getSite(): Promise<Site | null> {
  "use cache";
  cacheTag(SITE_CACHE_TAG);

  try {
    const site = await fetchSite();
    cacheLife("hours");
    lastGoodSite = site;
    return site;
  } catch (error) {
    // Short, but long enough (expire ≥ 5 min, stale ≥ 30 s) to stay in the prerendered shell.
    cacheLife({ stale: 30, revalidate: 30, expire: 300 });
    const reason = describeError(error);

    if (lastGoodSite) {
      console.warn(`[cms] Could not refresh site content (${reason}); serving the last content fetched.`);
      return lastGoodSite;
    }

    console.warn(
      `[cms] Could not load site content from ${endpoint()} (${reason}). ` +
        `Rendering the temporary "We'll be right back" page; retrying every 30 seconds.`,
    );
    return null;
  }
}

function endpoint(): string {
  try {
    return `${getApiEnv().baseUrl}${SITE_PATH}`;
  } catch {
    return `<invalid API_URL>${SITE_PATH}`;
  }
}

async function fetchSite(): Promise<Site> {
  const response = await fetch(`${getApiEnv().baseUrl}${SITE_PATH}`, {
    // `use cache` above is the only cache. Without this, Next.js would also keep the response in
    // its fetch cache on disk, and a later build could reuse it instead of asking the API.
    cache: "no-store",
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`API responded ${response.status}`);

  const envelope = envelopeSchema.safeParse(await response.json());
  if (!envelope.success) throw new Error("unexpected response envelope");

  const site = parseSite(envelope.data.data);
  if (!site) throw new Error("invalid site payload");
  return site;
}

function describeError(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const cause = error.cause;
  if (cause && typeof cause === "object" && "code" in cause) return `${error.message}: ${String(cause.code)}`;
  return error.message;
}
