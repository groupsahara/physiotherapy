import Image, { type ImageProps } from "next/image";
import { imageSource } from "@/lib/cms/media";
import type { CmsImage } from "@/lib/cms/types";

type ContentImageProps = Omit<ImageProps, "src" | "alt" | "unoptimized"> & {
  image: CmsImage;
  /** Overrides the CMS alt text (e.g. "" for a decorative use). */
  alt?: string;
};

/**
 * `next/image` for an image from the CMS (string `src`, so no static blur placeholder —
 * containers show a neutral background while it loads). Server-only: it decides whether
 * the image host is one the optimiser may fetch.
 */
export function ContentImage({ image, alt, ...props }: ContentImageProps) {
  const source = imageSource(image);
  return <Image {...props} src={source.src} alt={alt ?? source.alt} unoptimized={source.unoptimized} />;
}
