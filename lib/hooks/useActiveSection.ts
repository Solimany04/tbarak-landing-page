{/*
"use client";

import { useState, useEffect } from "react";

export function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // أول ما السيكشن يدخل في الشاشة، بنحدث الـ state
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        // الأرقام دي بتخلي التغيير يحصل لما السيكشن يوصل لمنتصف الشاشة تقريباً
        rootMargin: "-20% 0px -70% 0px",
      },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, [sectionIds]);

  return activeSection;
}
*/}