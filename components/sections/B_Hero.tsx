"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { ChevronDown} from "lucide-react";
import { scrollToNextSection } from "@/lib/actions/scrollToNextSection";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import NaviagtionButton from "../NaviagtionButton";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <>
    {/* height classes: h-124 md:h-154 lg:h-fit  min-h-[calc(100vh-50px)]*/}
      <main id="hero-section" className="relative min-h-178 w-full flex flex-col items-center justify-center">
        <Image
          src="/Hero.webp"
          alt="background"
          width={1920}
          height={712}
          style={{
            height: "100%",
            width: "100%",
          }}
          className="object-cover absolute -z-10"
        />
        <ParticlesBackground />

        {/* Content */}
        <div
          id="content"
          className="relative flex flex-col items-center justify-center text-center text-white"
        >
          <h1 className="text-5xl md:text-[64px] font-medium w-fit mb-6">
            {t("title")}
          </h1>
          <h5 className="text-xl md:text-2xl font-normal mb-5">{t("subtitle")}</h5>
          <p className="font-normal md:text-xl mb-10">
            {t("body")}
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center text-center gap-4 mb-[44px]">
            <Button
              variant="heroSecondary"
              type="submit"
              size="hero"
              className="font-normal"
            >
              {t("contact")}
            </Button>
            <NaviagtionButton
              content={t("explore")}
              variant="heroOutline"
              classes=""
              navID="products-section"
              size="hero"
            ></NaviagtionButton>
          </div>
          <div className="flex gap-16 w-full justify-center">
            <div className="flex flex-col gap-1.5">
              <h4 className="text-secondary text-2xl md:text-4xl font-semibold">
                30+
              </h4>
              <p className="font-normal md:text-2xl">{t("yearsLabel")}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <h4 className="text-secondary text-2xl md:text-4xl font-semibold">
                25+
              </h4>
              <p className="font-normal md:text-2xl">{t("clientsLabel")}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <h4 className="text-secondary text-2xl md:text-4xl font-semibold">
                15+
              </h4>
              <p className="font-normal md:text-2xl">{t("fabricsLabel")}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center absolute bottom-0">
          <button
            onClick={() => scrollToNextSection(`about-section`)}
            className="animate-bounce"
            aria-label="Scroll down"
          >
            <ChevronDown strokeWidth={1.2} className="text-white h-12 w-18 md:h-13 md:w-13 lg:mb-4.75 cursor-pointer" />
          </button>
        </div>

      </main>
    </>
  );
}
