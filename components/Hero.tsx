"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { ChevronDown } from "lucide-react";
import { scrollToNextSection } from "@/lib/actions/scrollToNextSection";
import { ParticlesBackground } from "@/components/ParticlesBackground";

export default function Hero() {
  return (
    <>
      <main className="relative h-124 md:h-154 lg:h-178 w-full overflow-hidden flex flex-col items-center justify-center">
        <Image
          src="/Hero.png"
          alt="background"
          // width={1000}
          // height={1000}
          fill
          priority
          className="object-cover -z-10"
        />
        {/* overlay for text readability */}
        {/* <div className="absolute inset-0 bg-black/40 -z-10" /> */}

        {/* Content */}
        <ParticlesBackground />
        <div className="container relative z-20 flex flex-col gap-2 items-center justify-center text-center text-white">
          <h1 className="text-5xl md:text-[64px] font-semibold w-fit">
            تبارك للأقمشة
          </h1>
          <h5 className="text-xl md:text-2xl font-medium">جودة تلمسها بيديك</h5>
          <p className="font-medium md:text-xl">
            نوفر لتجار الأقمشة والمصانع خامات عالية الجودة بتوريد ثابت وأسعار
            تنافسية.
          </p>
          <div className="flex items-center justify-center text-center gap-4 my-8">
            <Button
              variant="heroOutline"
              type="submit"
              size="hero"
              className="font-normal"
            >
              استكشف الآن
            </Button>
            <Button
              variant="heroSecondary"
              type="submit"
              size="hero"
              className=""
            >
              تواصل معنا
            </Button>
          </div>
          <div className="flex flex-row-reverse gap-16 w-full justify-center">
            <div className="flex flex-col gap-1.5">
              <h4 className="text-secondary text-2xl md:text-4xl font-semibold">
                30+
              </h4>
              <p className="font-normal md:text-2xl">سنوات الخبرة</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <h4 className="text-secondary text-2xl md:text-4xl font-semibold">
                25+
              </h4>
              <p className="font-normal md:text-2xl">عميل راضٍ</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <h4 className="text-secondary text-2xl md:text-4xl font-semibold">
                15+
              </h4>
              <p className="font-normal md:text-2xl">نوع قماش</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center absolute bottom-0 z-30">
          <button
            onClick={() => scrollToNextSection(`about-section`)}
            className="animate-bounce"
            aria-label="Scroll down"
          >
            <ChevronDown className="text-white h-9 w-12 md:h-12 md:w-18 lg:mb-[19px] cursor-pointer" />
          </button>
        </div>
        {/*       
      <div className="w-full max-w-md border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">
          FieldSet outside FieldGroup
        </h2>
        
      </div> */}
      </main>
      <section id="about-section" className="h-500"></section>
    </>
  );
}
