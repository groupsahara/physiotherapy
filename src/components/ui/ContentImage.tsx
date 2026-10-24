import type { ComponentProps } from "react";
import { imageSource } from "@/lib/cms/media";
import type { CmsImage } from "@/lib/cms/types";
import { LoadingImage } from "./LoadingImage";

type ContentImageProps = Omit<ComponentProps<typeof LoadingImage>, "src" | "alt" | "unoptimized"> & {
  image: CmsImage;
  /** Overrides the CMS alt text (e.g. "" for a decorative use). */
  alt?: string;
};

/**
 * `next/image` for an image from the CMS, with a shimmering skeleton until it loads (string
 * `src`, so no static blur placeholder). Server-only: it decides whether the image host is one
 * the optimiser may fetch.
 */
export function ContentImage({ image, alt, ...props }: ContentImageProps) {
  const source = imageSource(image);
  return <LoadingImage {...props} src={source.src} alt={alt ?? source.alt} unoptimized={source.unoptimized} />;
}
