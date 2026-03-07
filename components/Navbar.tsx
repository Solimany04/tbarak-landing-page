"use client";
import { Whatsapp, HouseHeart, ArrowRight } from "react-bootstrap-icons";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { useScroll } from "@/lib/hooks/useScroll";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const activeLang = <div><span className="fi fi-sa mr-1 rounded" />AR</div>
  const activeSection = useActiveSection([
    "hero",
    "about",
    "services",
    "contact",
  ]);

  const navLinks = [
    { id: "contact", label: "تواصل معنا" },
    { id: "services", label: "المميزات" },
    { id: "products", label: "المنتجات" },
    { id: "process", label: "مراحل العمل" },
    { id: "about", label: "من نحن" },
    { id: "hero", label: "الصفحة الرئيسية" },
  ];

  const isScrolled = useScroll(140);

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full h-[67px] md:h-[84px] flex items-center justify-between ",
        isScrolled ? "bg-primary text-primary-foreground" : "bg-gradient-to-b from-black/40 to-transparent",
      )}
    >
      {/* Contact Button */}
      <div className="hidden md:flex gap-8 md:gap-4 lg:ml-16 md:ml-8 items-center">
        <Button
          variant="navSecondary"
          className="lg:px-8 md:px-5 py-6 font-normal flex flex-row-reverse"
        >
          <span>
            <Whatsapp className="inline" />
          </span>
          تواصل الآن
        </Button>
        <button id="lang" className="cursor-pointer md:flex text-primary-foreground">
          {activeLang}
        </button>
      </div>
      {/* Navigation */}
      <ul className="hidden md:flex md:gap-4 lg:gap-8 lg:text-xl md:text-base">
        {navLinks.map((link) => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              className={cn(
                "rounded-md transition-colors",
                // هنا بنغير ستايل اللينك نفسه لو هو الـ Active Section
                activeSection === link.id
                  ? "underline underline-offset-[10px] text-secondary font-semibold" // الستايل في حالة إنه نشط
                  : "", // الستايل العادي
              )}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* <div id="navigation" className="flex gap-4 lg:gap-8 text-xl">
        <a href="" className="">
          تواصل معنا
        </a>
        <a href="" className="">
          المميزات
        </a>
        <a href="" className="">
          مراحل العمل
        </a>
        <a href="" className="">
          المنتجات
        </a>
        <a href="" className="">
          من نحن
        </a>
        <a href="" className="">
          الصفحة الرئيسية
        </a>
      </div> */}
      {/* LOGO */}
      <a
        href="http://"
        target="_blank"
        rel="noopener noreferrer"
        className="mr-4 md:mr-8 lg:mr-16 w-[68px] md:w-[80px] lg:w-[100px]"
      >
        <Image
          src="/vector.svg"
          alt="logo"
          width={200}
          height={200}
          className="w-full"
        />
      </a>
    </nav>
  );
};

export default Navbar;
