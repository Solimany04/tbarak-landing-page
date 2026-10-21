"use client";

import { useEffect, useState, type ComponentType } from "react";

/* Decorative particles over the hero, kept out of the critical path: the
   tsparticles code is fetched only after the window "load" event and an idle
   period, so it never competes with the hero image or delays first paint.
   With prefers-reduced-motion: reduce nothing is loaded at all. */
export const ParticlesBackground = () => {
  const [Canvas, setCanvas] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const load = () => {
      import("./ParticlesCanvas").then((mod) => {
        if (!cancelled) setCanvas(() => mod.default);
      });
    };
    const whenIdle = () => {
      // Safari has no requestIdleCallback.
      if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(load, { timeout: 3000 });
      else timeoutId = setTimeout(load, 1000);
    };

    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", whenIdle);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  return Canvas ? <Canvas /> : null;
};
