"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { ProductItem, CardStatus } from "../app/utils/types";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";
import { onFocusProduct } from "@/lib/actions/productCarouselNav";
import { useTranslations } from "next-intl";

interface ProductCarouselProps {
  items: ProductItem[];
  dir?: "rtl" | "ltr";
}

const OFFSET_BY_DISTANCE = { adjacent: 27, distant: 106 } as const;

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ items, dir = "rtl" }) => {
  const t = useTranslations("common");
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const isRtl = dir === "rtl";

  useEffect(() => {
    if (!api) return;
    const sync = () => setCurrentIndex(api.selectedScrollSnap());
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  useEffect(() => {
    if (!api) return;
    return onFocusProduct((productId) => {
      const index = items.findIndex((item) => item.productId === productId);
      if (index !== -1) api.scrollTo(index);
    });
  }, [api, items]);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  const carouselOpts = useMemo(
    () => ({ loop: true, align: "center" as const, direction: dir, watchDrag: false, duration: 25 }),
    [dir]
  );

  const getOffset = (index: number) => {
    const n = items.length;
    let diff = index - currentIndex;
    if (diff > n / 2) diff -= n;
    else if (diff < -n / 2) diff += n;
    return diff;
  };

  const getStatus = (diff: number): CardStatus =>
    diff === 0 ? "active" : Math.abs(diff) === 1 ? "adjacent" : "distant";

  return (
    <div className="w-full relative overflow-hidden" dir={dir}>
      <Carousel setApi={setApi} opts={carouselOpts} className="w-full max-w-[1350px] mx-auto">
        <CarouselContent className="-me-4 flex items-center h-[500px]">
          {items.map((item, index) => {
            const diff = getOffset(index);
            const status = getStatus(diff);
            const mag = status === "active" ? 0 : OFFSET_BY_DISTANCE[status];
            const offsetX = (isRtl ? 1 : -1) * Math.sign(diff) * mag;

            return (
              <CarouselItem
                key={item.productId}
                className="ps-0 flex justify-center items-center basis-[332px]"
              >
                <ProductCard item={item} status={status} offsetX={offsetX} />
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <button
          onClick={isRtl ? scrollNext : scrollPrev}
          aria-label={t("previous")}
          className={cn(
            "absolute top-[60%] md:top-[50%] -translate-y-1/2 z-30 flex items-center justify-center w-10.5 h-10.5 rounded-full bg-black/15 hover:bg-black/60 text-white backdrop-blur-[18px] transition-all duration-300",
            isRtl ? "right-[10%] md:right-[33.5%]" : "left-[10%] md:left-[33.5%]"
          )}
        >
          <ArrowRight className="size-8" />
        </button>
        <button
          onClick={isRtl ? scrollPrev : scrollNext}
          aria-label={t("next")}
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