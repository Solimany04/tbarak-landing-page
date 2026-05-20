import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
  } from "@/components/ui/carousel";
import ProductCard from './ProductCard';
type CarouselUIProps = {
    productId: number,
    productTitle: string,
    productDesc: string,
    productImage: string
}


const CarouselUI = (productsList: Array<object>) => {

    
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
  return (
    <div>
      
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
  )
}

export default CarouselUI
