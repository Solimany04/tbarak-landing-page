import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { scrollToNextSection } from "@/lib/actions/scrollToNextSection";
import NaviagtionButton from "../NaviagtionButton";


const About = () => {
  return (
    <div className="w-full bg-white scroll-mt-21" id="about-section">
      <div className="flex flex-col-reverse md:flex-row pt-16 md:pt-24 mx-4 md:mx-8 lg:mx-auto w-fit pb-16 ">

        {/* Image Side */}
        <div className="flex flex-col lg:w-1/3 md:w-1/2 w-full h-full relative mt-4 md:mt-0">
          <Image
            src="/List.png"
            className="rounded-4xl"
            alt="raw_material"
            width={550}
            height={550}
          />
        </div>

        {/* Text Content Side */}
        <div className="flex flex-col lg:w-2/3 md:w-1/2 w-full md:ms-[26px] lg:ms-16 ">
          {/* Heading */}
          <h2 className="text-[32px] md:text-5xl font-semibold w-fit mx-auto md:me-auto md:mx-0 ">
            حول <span className="text-secondary">تبارك</span>
          </h2>
          {/* Paragraph */}
          <p className="lg:text-xl md:text-base mt-7 md:mt-8 lg:mt-[60px] ">
            شركة تبارك للغزل والنسيج نسعى لتقديم أجود انواع الخامات والنسيج
            بأفضل سعر ممكن
          </p>

          {/* List */}
          <ul className="mt-8">
            <li className="flex gap-4 lg:gap-7 border-t border-[#e9e9e9] md:py-4 py-5 lg:py-5">
              <p className="text- text-muted-foreground">01</p>
              <p className="text-base text-black">نوفّر لتجار الأقمشة والمصانع خامات موثوقة بجودة ثابتة وشحن منتظم.</p>
            </li>
            <li className="flex gap-4 lg:gap-7 border-t border-[#e9e9e9] md:py-4 lg:py-5 py-5">
              <p className="text- text-muted-foreground">02</p>
              <p className="text-base text-black">علاقاتنا مع الموردين مبنية على التزام طويل يضمن استقرار التوريد.</p>
            </li>
            <li className="flex gap-4 lg:gap-7 border-t border-[#e9e9e9] md:py-4 lg:py-5 py-5">
              <p className="text- text-muted-foreground">03</p>
              <p className="text-base text-black">نلتزم بتوفير المخزون المطلوب في أي وقت لضمان استمرارية الإنتاج لدى عملائنا.</p>
            </li>
            <li className="flex gap-4 lg:gap-7 border-t border-[#e9e9e9] md:pt-4 lg:pt-5 pt-5">
              <p className="text- text-muted-foreground">04</p>
              <p className="text-base text-black">نفهم احتياجات السوق المحلي، ونوفّر الحلول المناسبة بسرعة ومرونة.</p>
            </li>
          </ul>
          <NaviagtionButton variant={undefined} content="اعرف المزيد" navID="process-section" classes="hover:shadow-[inset_0_0_0_1px_black] px-8 w-fit py-[24px] text-base font-normal hover:bg-white hover:text-primary mt-8 md:mt-4 lg:mt-auto"></NaviagtionButton>
        </div>

      </div>
    </div>
  );
};

export default About;
