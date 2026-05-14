import React from 'react'
import ContactForm from '../ContactForm'
import Image from 'next/image'

const ContactSection = () => {
  return (
      <div className='relative bg-primary'>
        <div className="absolute z-0 w-full h-full">
            <div className="bg-accent/40 w-38 h-38 rounded-full absolute blur-[100px] lg:start-20 lg:top-15 md:-start-10 md"></div>
            <div className="bg-accent/40 w-38 h-38 rounded-full absolute blur-[100px] lg:bottom-45 lg:start-1/3 md:bottom-4 md:start-1/3 bottom-1/2 end-0"></div>
        </div>
        <div className=" relative z-10 flex flex-col md:flex-row lg:py-24 md:p-10 p-4 lg:justify-around items-center w-full">
            {/* Halos */}

            {/* Right Side */}
            <div className="flex flex-col lg:max-w-116 w-full md:max-w-97  md:me-10.5 mt-8 md:mt-0 md:px-4">
                <h2 className="font-medium md:text-5xl text-3xl text-white lg:mb-6 mb-2 md:w-106">دعونا ننسج العلاقات</h2>
                <h4 className="font-normal text-white/80 md:text-2xl lg:mb-16 mb-8 line-clamp-1 -me-4">معًا نصنع قيمة أكبر، بالتواصل يبدأ الطريق.</h4>
                {/* lg:451x380 */}
                {/* md:355x352.83 */}
                <ContactForm/>
            </div>
            {/* Left Side */}
            <div className="relative h-fit my-8 md:my-0">
                <div className="absolute bottom-0 px-5 py-7.5">
                    <p className="text-white/70 mb-2.5">يمكنكم زيارتنا في العنوان الموضح أو التواصل معنا عبر القنوات المتاحة.</p>
                    <p className="text-white/80 font-semibold">تبارك للأقمشة والمنسوجات</p>
                </div>
                <Image width={571} height={573} alt='Google Maps Location' src="/tbarak google maps location.png"></Image>
            </div>
        </div>
    </div>
  )
}

export default ContactSection