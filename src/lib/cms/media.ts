import "server-only";
import { getMediaOrigins, matchesMediaOrigin } from "./origins";
import type { CmsImage } from "./types";

/** Props for `next/image` built from a CMS image. */
export interface ImageSource {
  src: string;
  alt: string;
  /** True when the Next.js optimiser cannot (or may not) fetch the image. */
  unoptimized: boolean;
}

const mediaOrigins = getMediaOrigins();

/** Loopback / private-network hosts, which the image optimiser refuses to fetch (SSRF guard). */
const PRIVATE_HOST =
  /^(?:localhost|.*\.localhost|127(?:\.\d{1,3}){3}|10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}|169\.254(?:\.\d{1,3}){2}|0\.0\.0\.0|\[(?:::1?|f[cd][0-9a-f:]*|fe80:[0-9a-f:]*)\])$/i;

/**
 * Site-relative files from `public/` and media from the configured origins
 * (`images.remotePatterns`, see `next.config.ts`) are optimised. Anything else is
 * rendered as-is, so an image pasted from an unexpected host still shows instead of
 * failing the render.
 */
function isOptimizable(src: string): boolean {
  if (src.startsWith("/")) return !src.includes("?");

  try {
    const url = new URL(src);
    return !PRIVATE_HOST.test(url.hostname) && matchesMediaOrigin(url, mediaOrigins);
  } catch {
    return false;
  }
}

export function imageSource(image: CmsImage): ImageSource {
  return { src: image.src, alt: image.alt, unoptimized: !isOptimizable(image.src) };
}
