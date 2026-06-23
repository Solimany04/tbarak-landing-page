import Image from "next/image";
import React from "react";
import { Logo } from "../Logo";
import Link from "next/link";
import { MapPin, Mail } from 'lucide-react';
import { Facebook, Linkedin, Instagram, Google } from "react-bootstrap-icons";
import NaviagtionButton from "../NaviagtionButton";

const J_FooterSection = () => {
  return (
    <div className="flex flex-col w-full scroll-mt-21" id="footer-section">
      <div className="grid grid-cols-6 w-full pb-9 pt-24 md:ps-16 px-4">

        {/* Links */}
        <div className="md:col-span-3 col-span-6 flex md:flex-col gap-6 md:pb-0 pb-8 justify-between">
            <Link href="/" className="relative w-30 h-15 bg-primary "style={{maskImage: "url(/vector.svg)",maskRepeat: "no-repeat",maskSize: "contain",}}>
                    <Image src="/vector.svg" alt="icon" fill className="opacity-0" />
            </Link>
            <div className="flex flex-col gap-6">
            <Link href="" className="w-fit"><MapPin className="inline me-2"/>محافظة القاهرة / وسط البلد.</Link>
            <Link href="" className="w-fit"><Mail className="inline me-2"/>contact@tbarak.com</Link>
            {/* Social Icons */}
              <div className="flex gap-2">
                  <Link href="" className="bg-secondary/10 text-secondary p-2.5 rounded-full"><Linkedin/></Link>
                  <Link href="" className="bg-secondary/10 text-secondary p-2.5 rounded-full"><Facebook /></Link>
                  <Link href="" className="bg-secondary/10 text-secondary p-2.5 rounded-full"><Instagram/></Link>
                  <Link href="/" className="bg-secondary/10 text-secondary p-2.5 rounded-full"><Google/></Link>
              </div>
            </div>
        </div>

        {/* Left Side List */}
        <div className="md:col-span-3 col-span-6 flex justify-around ">
          <div className="md:col-span-1 col-span-2 flex flex-col gap-6 ">
            <NaviagtionButton navID="products-section" variant={"clean"} size={undefined} content={`المنتجات`} classes="flex cursor-pointer font-bold text-primary hover:text-secondary"></NaviagtionButton>
            <NaviagtionButton navID="products-section" variant={"clean"} size={undefined} content={`سينجل ليكرا قطن`} classes="flex cursor-pointer hover:text-secondary"></NaviagtionButton>
            <NaviagtionButton navID="products-section" variant={"clean"} size={undefined} content={`براسولا قطن `} classes="flex cursor-pointer hover:text-secondary"></NaviagtionButton>
            <NaviagtionButton navID="products-section" variant={"clean"} size={undefined} content={`سمر ميلتون`} classes="flex cursor-pointer hover:text-secondary"></NaviagtionButton>
            <NaviagtionButton navID="products-section" variant={"clean"} size={undefined} content={`قماش بيكا`} classes="flex cursor-pointer hover:text-secondary"></NaviagtionButton></div>
          <div className="md:col-span-1 col-span-2 flex flex-col gap-6">
            <p className="font-bold text-primary">الخدمات</p>
            <p className="">بيع بالجملة</p>
            <p className="">عينات مجانية</p>
            <p className="">الشحن لأي مكان</p>
            <p className="">أسعار منافسة</p></div>
          <div className="md:col-span-1 col-span-2 flex flex-col gap-6">
            <h5 className="font-bold text-primary">المزيد</h5>
            <Link href="" className="hover:text-secondary">الدعم</Link>
            <Link href="" className="hover:text-secondary">اتصل بنا</Link></div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex justify-around border-t border-gray-400">
        <p className="m-7 text-[15px] text-[#929292] font-normal">© 2025 تبارك - جميع الحقوق محفوظة</p>
      </div>
    </div>
  );
};

export default J_FooterSection;
