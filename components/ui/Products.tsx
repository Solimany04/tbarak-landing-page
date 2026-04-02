"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from "./ProductCard";

const Products = () => {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const getDistance = (index) => {
    const len = productsList.length;
    const dist = Math.abs(index - current);
    return Math.min(dist, len - dist);
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
      productId: 2,
      productTitle: "قماش بيكا",
      productDesc:
        "بيكا يجمع بين المتانة والتهوية الجيدة بفضل نسيجه المميز، ما يجعله خيارًا مثاليًا للملابس المريحة والأنيقة.",
      productImage: "/Products/Picture 4.png",
    },
    {
      productId: 2,
      productTitle: "سمر ميلتون",
      productDesc:
        "سمر ميلتون يمنحك مظهرًا أنيقًا بفضل كثافته ونعومته، مع متانة تدعم الاستخدام الطويل.",
      productImage: "/Products/Picture 5.png",
    },
    {
      productId: 2,
      productTitle: "انترلوك",
      productDesc:
        "قماش إنترلوك يتميز بنعومته العالية وسماكته المتوسطة، مع مرونة مريحة وثبات جيد للشكل.",
      productImage: "/Products/Picture 3.png",
    },
  ];
  const size = ""
  return (
    <div className="border-black border w-full overflow-hidden">
      <h1 className=" font-semibold text-5xl mx-auto my-16 w-fit">
        منتجات <span className="text-secondary">تبارك</span>
      </h1>
      <Carousel
        orientation="horizontal"
        opts={{ align: "start", loop: true }}
        className="w-full max-w-[1336px] mx-auto"
      >
        <CarouselContent>
          {productsList.map((product, index) => {
            const distance = getDistance(index);

            const scale = distance === 0 ? "" :
                          distance === 1 ? "" : 
                          "";
                          return (
            <CarouselItem
              className={`pl-4 transition-all duration-500 ease-in-out lg:basis-1/5 md:basis-1/3 basis-1/2  ${scale}`}
              key={product.productId}
            >
              <ProductCard title={product.productTitle} desc={product.productDesc} image={product.productImage}/>
            </CarouselItem>)
          })}
        </CarouselContent>
        <CarouselPrevious className="rtl:rotate-180" />
        <CarouselNext className="rtl:rotate-180" />
      </Carousel>
    </div>
  );
};

export default Products;