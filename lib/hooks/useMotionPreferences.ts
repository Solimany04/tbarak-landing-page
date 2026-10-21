"use client"
import { useEffect, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** True when the visitor asked for reduced motion. Always false while server-rendering. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

/** Whether `element` is (at least partly) inside the viewport. Starts as true. */
export function useInViewport(element: Element | null | undefined) {
  const [inViewport, setInViewport] = useState(true);

  useEffect(() => {
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInViewport(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return inViewport;
}
