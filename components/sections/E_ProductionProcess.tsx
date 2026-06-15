import Image from "next/image";
import React from "react";

const ProductionProcess = () => {
  return (
    <div className="w-full bg-linear-to-b from-white ">
      <div className=" mb-0">
        <h2 className="font-semibold text-3xl md:text-5xl text-center mb-16 pt-16">
          مراحل عمل <span className="text-accent">تبارك</span>
        </h2>
        <div className="flex flex-col gap-16 lg:gap-0 ">
          <div className="grid lg:grid-cols-3 md:grid-cols-2">
            <div className="lg:col-span-2 justify-center flex flex-col mb-4">
              <div className="flex items-center justify-between relative md:my-0 my-4 ">
                <h2 className="text-[40px] md:text-5xl lg:text-[64px] md:mx-8">
                  الخامة أولًا
                </h2>
                <h1 className="text-8xl md:text-9xl lg:text-[150px] md:absolute -top-18.5 text-primary/10 font-semibold ">
                  01
                </h1>
              </div>
              <p className="text-base/8 lg:text-xl md:ms-8 md:me-8">
                نعتمد على أجود أنواع الخيوط والألياف المختارة بعناية فائقة،
                لضمان أعلى مستويات الأداء والثبات في التصنيع والاستخدام طويل
                المدى.
              </p>
            </div>
            <Image
              className="lg:col-span-1 rounded-[40px] mx-auto"
              src="/2.png"
              width={500}
              height={500}
              alt="Weavary Machine Process"
            />
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2">
            <div className="lg:col-span-2 md:order-2 justify-center flex flex-col mb-4">
              <div className="flex items-center justify-between relative md:my-0 my-4">
                <h2 className="text-[40px] md:text-5xl lg:text-[64px] md:ms-8">
                  عملية النسج
                </h2>
                <h1 className="text-8xl md:text-9xl lg:text-[150px] md:absolute -top-18.5 text-primary/10 font-semibold md:ms-3">
                  02
                </h1>
              </div>
              <p className="text-base/8 lg:text-xl md:ms-8">
                نستخدم أحدث ماكينات النسيج الدائري جنبًا إلى جنب مع تقنيات
                مبتكرة لضمان إنتاج أقمشة عالية الجودة، تلبي أعلى معايير الراحة
                والمتانة والجمال.
              </p>
            </div>
            <Image
              className="lg:col-span-1 rounded-[40px] mx-auto"
              src="/3.png"
              width={500}
              height={500}
              alt="Weavary Machine Process"
            />
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2">
            <div className="lg:col-span-2 justify-center flex flex-col mb-4">
              <div className="flex items-center justify-between relative md:my-0 my-4">
                <h2 className="text-[40px] md:text-5xl lg:text-[64px] md:mx-8">
                  فحص الجودة
                </h2>
                <h1 className="text-8xl md:text-9xl lg:text-[150px] md:absolute -top-18.5 text-primary/10 font-semibold ">
                  03
                </h1>
              </div>
              <p className="text-base/8 lg:text-xl md:ms-8 md:me-8">
                تمر كل قطعة لدينا بعملية تدقيق وفحص دقيق، لضمان تقديم منتجات
                تلتزم بأعلى معايير الجودة وتفي بتوقعات عملائنا.
              </p>
            </div>
            <Image
              className="lg:col-span-1 rounded-[40px] mx-auto"
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
