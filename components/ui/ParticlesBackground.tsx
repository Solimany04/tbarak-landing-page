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
      fullScreen: { enable: false }, // مهم جداً عشان تكون داخل الـ Hero بس
      fpsLimit: 120,
      particles: {
        color: { value: "#ffffff" }, // غير اللون حسب لون الـ Brand بتاعك
        move: {
          enable: true,
          direction: "none" as const,
          outModes: "out" as const,
          random: true,
          speed: 1.5, // سرعة الطيران
          straight: false,
        },
        number: {
          density: { enable: true, area: 800 },
          value: 40, // عدد الكرات
        },
        opacity: {
          value: { min: 0.1, max: 0.5 }, // درجات شفافية مختلفة لعمق بصري
        },
        shape: { type: "circle" },
        size: {
          value: { min: 1, max: 4 }, // أحجام مختلفة للكرات
        },
      },
    }),
    [],
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        className="absolute inset-0 -z-5" // التأكد من إنها تغطي الخلفية وفي طبقة متوسطة
        options={options}
      />
    );
  }

  return null;
};
