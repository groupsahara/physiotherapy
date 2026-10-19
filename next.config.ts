import type { NextConfig } from "next";
import { getMediaOrigins, toRemotePattern } from "./src/lib/cms/origins";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  env: {
    // Evaluated once at build time; the footer swaps in the live year on the client.
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // CMS images: site-relative files from public/ plus uploads served by the API
    // (`API_URL` + `/media/**`) or any extra origin listed in `MEDIA_ORIGINS`.
    remotePatterns: getMediaOrigins().map(toRemotePattern),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
