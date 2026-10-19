/**
 * Where the backend API and its media live. Imported by `next.config.ts` (to build
 * `images.remotePatterns`) as well as by server code, so it must stay free of
 * framework and path-alias imports.
 */

type Env = Record<string, string | undefined>;

export const DEFAULT_API_URL = "http://localhost:3000";

/** Uploaded media is served by the API under this path (`{API_ORIGIN}/media/...`). */
const API_MEDIA_PATH = "/media";

/** Origin (plus optional base path) that serves CMS images. */
export interface MediaOrigin {
  protocol: "http" | "https";
  hostname: string;
  port: string;
  /** "" or a base path without trailing slash, e.g. "/media". */
  pathPrefix: string;
}

/** Base URL of the backend API, without trailing slash (env `API_URL`). */
export function getApiBaseUrl(env: Env = process.env): string {
  return (env.API_URL?.trim() || DEFAULT_API_URL).replace(/\/+$/, "");
}

function toMediaOrigin(value: string, pathPrefix?: string): MediaOrigin | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return {
      protocol: url.protocol === "https:" ? "https" : "http",
      hostname: url.hostname,
      port: url.port,
      pathPrefix: pathPrefix ?? url.pathname.replace(/\/+$/, ""),
    };
  } catch {
    return null;
  }
}

/**
 * Hosts allowed to serve optimised CMS images: the API's own `/media` path plus every
 * entry of the optional comma-separated `MEDIA_ORIGINS` list (e.g. a CDN in front of
 * the uploads, or the API's public URL when `API_URL` is an internal address).
 */
export function getMediaOrigins(env: Env = process.env): MediaOrigin[] {
  const origins = [
    toMediaOrigin(getApiBaseUrl(env), API_MEDIA_PATH),
    ...(env.MEDIA_ORIGINS ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => toMediaOrigin(entry)),
  ];
  return origins.filter((origin): origin is MediaOrigin => origin !== null);
}

/** `images.remotePatterns` entry for a media origin. */
export function toRemotePattern({ protocol, hostname, port, pathPrefix }: MediaOrigin) {
  return { protocol, hostname, port, pathname: `${pathPrefix}/**` };
}

export function matchesMediaOrigin(url: URL, origins: readonly MediaOrigin[]): boolean {
  return origins.some(
    (origin) =>
      url.protocol === `${origin.protocol}:` &&
      url.hostname === origin.hostname &&
      url.port === origin.port &&
      url.pathname.startsWith(`${origin.pathPrefix}/`),
  );
}
