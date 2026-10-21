"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { scrollToNextSection } from "@/lib/actions/scrollToNextSection";
import { useInViewport } from "@/lib/hooks/useMotionPreferences";
import { cn } from "@/lib/utils";

/** The bouncing chevron at the bottom of the hero. The bounce is skipped under
 *  prefers-reduced-motion and paused while the chevron is scrolled away. */
export default function ScrollDownButton({ targetId }: { targetId: string }) {
  const [button, setButton] = useState<HTMLButtonElement | null>(null);
  const inViewport = useInViewport(button);

  return (
    <button
      ref={setButton}
      onClick={() => scrollToNextSection(targetId)}
      className={cn("motion-safe:animate-bounce", !inViewport && "[animation-play-state:paused]")}
      aria-label="Scroll down"
    >
      <ChevronDown strokeWidth={1.2} className="text-white h-12 w-18 md:h-13 md:w-13 lg:mb-4.75 cursor-pointer" />
    </button>
  );
}
