import Image from 'next/image'
import React from 'react'
import why1 from "@/public/Icons/why1.svg"
import why2 from "@/public/Icons/why2.svg"
import why3 from "@/public/Icons/why3.svg"
import why4 from "@/public/Icons/why4.svg"
import why5 from "@/public/Icons/why5.svg"

const WhySection = () => {
  return (
      <div className="flex flex-col md:mx-16 mx-4 mt-16 scroll-mt-16" id='why-section'>
        <div className='md:my-16 my-4'>
            <h2 className='text-center font-semibold md:text-5xl text-[32px]'>لماذا <span className='text-accent'>تبارك</span></h2>
        </div>
        <div className="grid grid-cols-6 gap-4 md:h-84 h-128">
            <div className="md:col-span-2 col-span-3 bg-white outline-1 outline-[#152727]/8 rounded-2xl flex flex-col items-center justify-center">
                {/* Icon */}
                  <Image src={why1} width={50} height={50} alt='Top quality award' />
                <h5 className="md:text-xl text-base">جودة عالية</h5>
                <p className="text-[10px] font-light">أقمشة تورد بعناية</p>
            </div>
            <div className="md:col-span-2 col-span-3 bg-white outline-1 outline-[#152727]/8 rounded-2xl flex flex-col items-center justify-center">
                {/* Icon */}
                  <Image src={why2} width={50} height={50} alt='Affordable pricing' />
                <h5 className="md:text-xl text-base">أسعار منافسة</h5>
                <p className="text-[10px] font-light">أفضل قيمة في السوق</p>
            </div>
            <div className="md:col-span-2 col-span-3 bg-white outline-1 outline-[#152727]/8 rounded-2xl flex flex-col items-center justify-center">
                {/* Icon */}
                  <Image src={why3} width={50} height={50} alt='Shipping worldwide' />
                <h5 className="md:text-xl text-base">الشحن لأي مكان</h5>
                <p className="text-[10px] font-light">توصيل لجميع المحافظات</p>
            </div>
            <div className="md:col-span-3 col-span-6  md:order-4 order-5 bg-white outline-1 outline-[#152727]/8 rounded-2xl flex flex-col items-center justify-center">
                {/* Icon */}
                  <Image src={why4} width={50} height={50} alt='Complete inventory' />
                <h5 className="md:text-xl text-base">نوفر لكم جميع الخامات</h5>
                <p className="text-[10px] font-light">تجد لدينا كل ما تريد من الأقمشة</p>
            </div>
            <div className="col-span-3 md:order-5 order-4 bg-white outline-1 outline-[#152727]/8 rounded-2xl flex flex-col items-center justify-center">
                {/* Icon */}
                  <Image src={why5} width={50} height={50} alt='Free samples' />
                <h5 className="md:text-xl text-base">عينات مجانية</h5>
                <p className="text-[10px] font-light">إرسال عينات لمعاينة المنتج قبل الطلب</p>
            </div>
        </div>
      </div>
  )
}

export default WhySection
