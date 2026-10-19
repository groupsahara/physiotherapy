import type { ReactNode } from "react";

/**
 * Renders CMS text with `**bold**` markup as React nodes — no HTML parsing and no
 * dangerouslySetInnerHTML, so editors cannot inject markup. An unmatched `**` is
 * shown literally.
 */
export function InlineMarkup({ text, strongClassName }: { text: string; strongClassName?: string }) {
  const parts = text.split("**");

  // An even number of parts means the last marker was never closed: put it back.
  if (parts.length % 2 === 0) {
    const unclosed = parts.pop();
    parts[parts.length - 1] += `**${unclosed}`;
  }

  const nodes: ReactNode[] = parts.map((part, index) => {
    if (index % 2 === 0) return part;
    return part ? (
      <strong key={index} className={strongClassName}>
        {part}
      </strong>
    ) : null;
  });

  return <>{nodes}</>;
}
