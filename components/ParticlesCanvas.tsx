"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

/* The tsparticles canvas itself. Only ever loaded through ParticlesBackground,
   which imports this module after the page has loaded, so tsparticles stays
   out of the initial JavaScript. */
export default function ParticlesCanvas() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(() => {
    // Phones: fewer particles and a 30 fps cap; the drift is slow enough that
    // the lower frame rate is not visible, and the canvas redraws far less.
    const phone = window.matchMedia("(max-width: 767px)").matches;
    return {
      fullScreen: { enable: false },
      fpsLimit: phone ? 30 : 120,
      // Stop the render loop while the hero is scrolled away or the tab/window
      // is in the background (both are tsparticles defaults; kept explicit).
      pauseOnOutsideViewport: true,
      pauseOnBlur: true,
      particles: {
        color: { value: "#ffffff" },
        move: {
          enable: true,
          direction: "none" as const,
          outModes: "out" as const,
          random: true,
          speed: 1.5,
          straight: false,
        },
        number: {
          density: { enable: true, area: 800 },
          value: phone ? 24 : 40,
        },
        opacity: {
          value: { min: 0.1, max: 0.5 },
        },
        shape: { type: "circle" },
        size: {
          value: { min: 1, max: 4 },
        },
      },
    };
  }, []);

  if (init) {
    return (
      <Particles
        id="tsparticles"
        className="absolute inset-0 -z-5"
        options={options}
      />
    );
  }

  return null;
}
