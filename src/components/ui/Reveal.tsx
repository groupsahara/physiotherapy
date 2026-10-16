"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";

/**
 * Fade-up on first scroll into view. One IntersectionObserver is shared by
 * every Reveal on the page (flyweight) instead of one observer per element.
 * The hidden state is pure CSS keyed on `html[data-js]`, so content is fully
 * visible without JavaScript and for search engines.
 */

let sharedObserver: IntersectionObserver | undefined;

function getObserver() {
  sharedObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-revealed", "");
          sharedObserver?.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );
  return sharedObserver;
}

interface RevealProps {
  children: ReactNode;
  /** Rendered element — use "li" inside lists to keep the markup valid. */
  as?: "div" | "li" | "article";
  className?: string;
  /** Stagger delay in milliseconds. */
  delay?: number;
}

export function Reveal({ children, as = "div", className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = getObserver();
    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  const style = delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined;

  const Tag = as as "div";
  return (
    <Tag ref={ref as RefObject<HTMLDivElement>} data-reveal="" className={className} style={style}>
      {children}
    </Tag>
  );
}
