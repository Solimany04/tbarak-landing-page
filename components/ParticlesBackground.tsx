"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export const ParticlesBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 120,
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
          value: 40,
        },
        opacity: {
          value: { min: 0.1, max: 0.5 },
        },
        shape: { type: "circle" },
        size: {
          value: { min: 1, max: 4 },
        },
      },
    }),
    [],
  );

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
};
