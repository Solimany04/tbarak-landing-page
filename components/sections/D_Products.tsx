"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import ProductCard from "../ProductCard";
import Image from "next/image";

const Products = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  // const items = Array.from({ length: 5 });

  React.useEffect(() => {
    if (!api) return;

    setCurrentIndex(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const getSlidePosition = (index: number) => {
    const total = productsList.length;

    const diff = (index - currentIndex + total) % total;

    if (diff === 0) return "active"; // Center
    if (diff === 1) return "next"; // Right 1
    if (diff === 2) return "second_next"; // Right 2
    if (diff === total - 1) return "prev"; // Left 1
    if (diff === total - 2) return "second_prev"; // Left 2
    return "hidden"; // All others
  };
  const productsList = [
    {
      productId: 1,
      productTitle: "برسولا قطن",
      productDesc:
        "قطن براسولا عالي الجودة بملمس ناعم ولمعان طبيعي، مثالي لتصنيع الملابس و يتميز بثبات الألوان.",
      productImage: "/Products/Picture 1.png",
    },
    {
      productId: 2,
      productTitle: "سينجل ليكرا قطن",
      productDesc:
        "قماش سينجل ليكرا خفيف ومرن، يجمع بين الراحة والانسيابية، مثالي للملابس اليومية والرياضية.",
      productImage: "/Products/Picture 2.png",
    },
    {
      productId: 3,
      productTitle: "قماش بيكا",
      productDesc:
        "بيكا يجمع بين المتانة والتهوية الجيدة بفضل نسيجه المميز، ما يجعله خيارًا مثاليًا للملابس المريحة والأنيقة.",
      productImage: "/Products/Picture 3.png",
    },
    {
      productId: 4,
      productTitle: "سمر ميلتون",
      productDesc:
        "سمر ميلتون يمنحك مظهرًا أنيقًا بفضل كثافته ونعومته، مع متانة تدعم الاستخدام الطويل.",
      productImage: "/Products/Picture 4.png",
    },
    {
      productId: 5,
      productTitle: "انترلوك",
      productDesc:
        "قماش إنترلوك يتميز بنعومته العالية وسماكته المتوسطة، مع مرونة مريحة وثبات جيد للشكل.",
      productImage: "/Products/Picture 5.png",
    },
    {
      productId: 6,
      productTitle: "انترلوك 2",
      productDesc:
        "قماش إنترلوك يتميز بنعومته العالية وسماكته المتوسطة، مع مرونة مريحة وثبات جيد للشكل.",
      productImage: "/Products/Picture 6.png",
    },
    {
      productId: 7,
      productTitle: "انترلوك 3",
      productDesc:
        "قماش إنترلوك يتميز بنعومته العالية وسماكته المتوسطة، مع مرونة مريحة وثبات جيد للشكل.",
      productImage: "/Products/Picture 7.png",
    },
    {
      productId: 8,
      productTitle: "انترلوك 4",
      productDesc:
        "قماش إنترلوك يتميز بنعومته العالية وسماكته المتوسطة، مع مرونة مريحة وثبات جيد للشكل.",
      productImage: "/Products/Picture 8.png",
    },
    {
      productId: 9,
      productTitle: "انترلوك 5",
      productDesc:
        "قماش إنترلوك يتميز بنعومته العالية وسماكته المتوسطة، مع مرونة مريحة وثبات جيد للشكل.",
      productImage: "/Products/Picture 9.png",
    },
    {
      productId: 10,
      productTitle: "انترلوك 6",
      productDesc:
        "قماش إنترلوك يتميز بنعومته العالية وسماكته المتوسطة، مع مرونة مريحة وثبات جيد للشكل.",
      productImage: "/Products/Picture 10.png",
    },
  ];
  const size = "";
  return (
    <div className=" w-full overflow-hidden">
      <h1 className=" font-semibold text-5xl mx-auto my-16 w-fit">
        منتجات <span className="text-secondary">تبارك</span>
      </h1>
      <Carousel
        orientation="horizontal"
        opts={{ align: "center", loop: true, direction: "rtl" }}
        className="w-full max-w-[1336px] mx-auto h-[707px]"
        setApi={setApi}
      >
        <CarouselContent className="-ms-2.5 h-[472px] ">
          {productsList.map((product, index) => {
            const position = getSlidePosition(index);
            const positionStyles = {
              active:
                "w-[292px] h-[479px] md:w-[324px] md:h-[472px] origin-center shrink-0",
              next: " w-[234px] h-[384px] md:w-[270px] md:h-[394px] origin-center shrink-0",
              second_next: "w-[216px] h-[315px] origin-center shrink-0",
              prev: "w-[234px] h-[384px] md:w-[270px] md:h-[394px] origin-center shrink-0 ",
              second_prev: "w-[216px] h-[315px] origin-center shrink-0 ",
              hidden:
                "w-[216px] h-[315px] shrink-0 opacity-0 h-[50%] z-0 pointer-events-none origin-center",
            };
            return (
              <CarouselItem
                key={product.productId}
                className=" basis-auto ps-2.5 h-full flex items-center justify-center"
              >
                <div
                  className={`transition-all duration-500 ease-in-out will-change-auto ${positionStyles[position]}`}
                >
                  <ProductCard
                    title={product.productTitle}
                    desc={product.productDesc}
                    image={product.productImage}
                    size="h-full w-full"
                  />
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="start-auto end-auto left-1/2 translate-x-[180px] -translate-y-1/2 z-10  rtl:rotate-180" />
        <CarouselNext className="start-auto end-auto left-1/2 -translate-x-[180px] -translate-y-1/2 z-10  rtl:rotate-180" />
      </Carousel>
    </div>
  );
};

export default Products;
