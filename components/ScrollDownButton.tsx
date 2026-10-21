"use client";

import { ChevronDown } from "lucide-react";
import { scrollToNextSection } from "@/lib/actions/scrollToNextSection";

/** The bouncing chevron at the bottom of the hero. */
export default function ScrollDownButton({ targetId }: { targetId: string }) {
  return (
    <button
      onClick={() => scrollToNextSection(targetId)}
      className="animate-bounce"
      aria-label="Scroll down"
    >
      <ChevronDown strokeWidth={1.2} className="text-white h-12 w-18 md:h-13 md:w-13 lg:mb-4.75 cursor-pointer" />
    </button>
  );
}
