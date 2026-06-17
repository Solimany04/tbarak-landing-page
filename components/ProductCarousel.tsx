// ProductCarousel.tsx (تحديث)
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { ProductItem, CardStatus } from "../app/utils/types";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  items: ProductItem[];
  dir?: "rtl" | "ltr";
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ items, dir = "rtl" }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrentIndex(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  const getCardStatus = (index: number): CardStatus => {
    const total = items.length;
    if (index === currentIndex) return "active";
    const prevIndex = (currentIndex - 1 + total) % total;
    const nextIndex = (currentIndex + 1) % total;
    if (index === prevIndex || index === nextIndex) return "adjacent";
    return "distant";
  };

  const getRelativeOffset = (index: number): number => {
    const n = items.length;
    let diff = index - currentIndex;
    if (diff > n / 2) diff -= n;
    else if (diff < -n / 2) diff += n;
    return diff; // 0 = active, ±1 = adjacent, ±2 = distant
  };

  const scrollPrev = useCallback(() => {
    if (api) api.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    if (api) api.scrollNext();
  }, [api]);

  const isRtl = dir === "rtl";

  const carouselOpts = React.useMemo(
    () => ({ loop: true, align: "center" as const, direction: dir, watchDrag: false, duration: 25 }),
    [dir]
  );
  return (
    <div className="w-full relative overflow-hidden" dir={dir}>
      <Carousel
        setApi={setApi}
        opts={carouselOpts}
        className="w-full max-w-[1350px] mx-auto "
      >
        <CarouselContent className="-me-4 flex items-center h-[500px]">
          {items.map((item, index) => {
            const status = getCardStatus(index);
            const diff = getRelativeOffset(index);
            const mag = diff === 0 ? 0 : Math.abs(diff) === 1 ? 27 : 106;
            const offsetX = (isRtl ? 1 : -1) * Math.sign(diff) * mag;

            const isActive = status === "active";
            return (
              <CarouselItem
                key={item.productId}
                className={cn(" ps-0 flex justify-center items-center basis-[332px]",
                  // isActive ? "basis-[308px] md:basis-[334px]" : 
                  // status === "adjacent" ? "basis-[280px]" : 
                  // "basis-[310px] md:basis-[226px]"
                )}
              >
                <ProductCard item={item} status={status} offsetX={offsetX} />
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <button
          onClick={isRtl ? scrollNext : scrollPrev}
          className={cn(
            "absolute top-[60%] md:top-[50%] -translate-y-1/2 z-30 flex items-center justify-center w-10.5 h-10.5 rounded-full bg-black/15 hover:bg-black/60 text-white backdrop-blur-[18px] transition-all duration-300",
            isRtl ? "right-[10%] md:right-[33.5%]" : "left-[10%] md:left-[33.5%]"
          )}
        >
          <ArrowRight className="size-8" />
        </button>

        <button
          onClick={isRtl ? scrollPrev : scrollNext}
          className={cn(
            "absolute top-[60%] md:top-[50%] -translate-y-1/2 z-30 flex items-center justify-center w-10.5 h-10.5 rounded-full bg-black/15 hover:bg-black/60 text-white backdrop-blur-[18px] transition-all duration-300",
            isRtl ? "left-[10%] md:left-[33.5%]" : "right-[10%] md:right-[33.5%]"
          )}
        >
          <ArrowLeft className="size-8" />
        </button>
      </Carousel>
    </div>
  );
};