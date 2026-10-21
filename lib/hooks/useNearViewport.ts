"use client"
import { useEffect, useState } from "react";

/**
 * Becomes true once `element` comes within `margin` of the viewport and stays
 * true (always false while server-rendering). `margin` is an IntersectionObserver
 * rootMargin; percentages are of the viewport.
 */
export function useNearViewport(element: Element | null | undefined, margin = "50% 0px") {
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (!element || near) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: margin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, margin, near]);

  return near;
}
