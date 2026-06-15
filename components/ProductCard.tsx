// ProductCard.tsx (تحديث)
import React from "react";
import { ProductItem, CardStatus } from "../app/utils/types";
import { cn } from "@/lib/utils";
import { InnerGallery } from "./InnerGallery";
import { Button } from "./ui/button";

interface ProductCardProps {
  item: ProductItem;
  status: CardStatus;
  offsetX?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, status, offsetX = 0 }) => {
  const isActive = status === "active";

  return (
    <div
      style={{ transform: `translateX(${offsetX}px)` }}
      className={cn(
        "bg-white rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col items-center transition-all duration-500 ease-in-out",
        isActive ? "md:w-[324px] w-[292px] md:h-[472px] h-[479px] z-20" :
          status === "adjacent" ? "md:w-[270px] w-[234px] md:h-[394px] h-[384px] z-10" :
            "w-[200px] md:w-[220px] md:h-[315px]  z-0"
      )}
    >

      <div
        className={cn(
          "w-full bg-[#fcfcfc] flex items-center justify-center relative overflow-hidden transition-all duration-500 ease-in-out",
          isActive ? "h-[360px] md:h-[288px]" :
            status === "adjacent" ? "h-[260px] md:h-[189px]" :
              "h-[180px] md:h-[89px]"
        )}
      >
        <InnerGallery images={item.productImage} isActive={isActive} />
      </div>

      <div className="p-5 w-full flex flex-col justify-between flex-grow min-h-[180px]">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2 leading-tight">
            {item.productTitle}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            {item.productDesc}
          </p>
        </div>

        <Button className="bottom-0 bg-[#1c2c2e] hover:bg-[#2a3f41] text-white text-sm font-light rounded-full transition-colors duration-300 w-fit">
          أحصل عليه الآن
        </Button>
      </div>
    </div>
  );
};