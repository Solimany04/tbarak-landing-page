"use client";

import { useEffect, useState, type ComponentType } from "react";

/* Decorative particles over the hero, kept out of the critical path: the
   tsparticles code (~140 KB, plus a costly engine start) is fetched 3 s after
   the window "load" event, on the next idle period, so it neither competes
   with the hero image nor lands on top of the other post-load work.
   With prefers-reduced-motion: reduce nothing is loaded at all. */
const START_DELAY_MS = 3000;

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
      timeoutId = setTimeout(() => {
        // Safari has no requestIdleCallback.
        if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(load, { timeout: 2000 });
        else load();
      }, START_DELAY_MS);
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
