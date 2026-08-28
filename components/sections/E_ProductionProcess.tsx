import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const ProductionProcess = () => {
  const t = useTranslations("process");
  return (
    <div className="w-full bg-linear-to-b from-white scroll-mt-16" id="process-section">
      <div className=" mb-0 lg:px-16 md:px-8 px-4">
        <h2 className="font-semibold text-3xl md:text-5xl text-center mb-16 pt-16">
          {t("heading")} <span className="text-accent">{t("brand")}</span>
        </h2>
        <div className="flex flex-col gap-16 lg:gap-0">
          <div className="grid lg:grid-cols-3 md:grid-cols-2">
            <div className="lg:col-span-2 justify-center flex flex-col mb-4">
              <div className="flex items-center justify-between relative md:my-12 my-4 ">
                <h2 className="text-[40px] md:text-5xl lg:text-[64px] md:mx-8">
                  {t("step1Title")}
                </h2>
                <h1 className="text-8xl md:text-9xl lg:text-[150px] md:absolute -top-18.5 text-primary/10 font-semibold ">
                  01
                </h1>
              </div>
              <p className="text-base/8 lg:text-xl md:ms-8 md:me-8">
                {t("step1Body")}
              </p>
            </div>
            <Image
              className="lg:col-span-1 rounded-[40px] ms-auto"
              src="/2.png"
              width={500}
              height={500}
              alt="Weavary Machine Process"
            />
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2">
            <div className="lg:col-span-2 md:order-2 justify-center flex flex-col mb-4">
              <div className="flex items-center justify-between relative md:my-12 my-4">
                <h2 className="text-[40px] md:text-5xl lg:text-[64px] md:ms-8">
                  {t("step2Title")}
                </h2>
                <h1 className="text-8xl md:text-9xl lg:text-[150px] md:absolute -top-18.5 text-primary/10 font-semibold md:ms-3">
                  02
                </h1>
              </div>
              <p className="text-base/8 lg:text-xl md:ms-8">
                {t("step2Body")}
              </p>
            </div>
            <Image
              className="lg:col-span-1 rounded-[40px] me-auto"
              src="/3.png"
              width={500}
              height={500}
              alt="Weavary Machine Process"
            />
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2">
            <div className="lg:col-span-2 justify-center flex flex-col mb-4">
              <div className="flex items-center justify-between relative md:my-12 my-4">
                <h2 className="text-[40px] md:text-5xl lg:text-[64px] md:mx-8">
                  {t("step3Title")}
                </h2>
                <h1 className="text-8xl md:text-9xl lg:text-[150px] md:absolute -top-18.5 text-primary/10 font-semibold ">
                  03
                </h1>
              </div>
              <p className="text-base/8 lg:text-xl md:ms-8 md:me-8">
                {t("step3Body")}
              </p>
            </div>
            <Image
              className="lg:col-span-1 rounded-[40px] ms-auto"
              src="/4.png"
              width={500}
              height={500}
              alt="Weavary Machine Process"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionProcess;
