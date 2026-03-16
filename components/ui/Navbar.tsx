"use client";
import { Whatsapp } from "react-bootstrap-icons";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { useScroll } from "@/lib/hooks/useScroll";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Button } from "./button";

const Navbar = () => {
  const activeLang = (
    <div>
      <span className="fi fi-sa me-1 rounded" />
      AR
    </div>
  );
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

  const isScrolled = useScroll(100);

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full h-[67px] md:h-[84px] flex items-center justify-between ",
        isScrolled
          ? "bg-primary text-primary-foreground"
          : "bg-gradient-to-b from-black/40 to-transparent",
      )}
    >
      {/* LOGO */}
      <a
        href="http://"
        target="_blank"
        rel="noopener noreferrer"
        className="me-auto md:me-0 ms-4 md:ms-8 lg:me-16 || w-auto max-w-[68px] md:w-auto md:max-w-[80px] lg:w-auto lg:max-w-[100px]"
      >
        <Image
          src="/vector.svg"
          alt="logo"
          width={200}
          height={200}
          className="w-full"
        />
      </a>

      {/* Navigation */}
      <ul className="hidden md:flex flex-row-reverse lg:text-xl md:text-base">
        {navLinks.map((link) => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              className={cn(
                "transition-colors md:px-2 lg:px-4",
                activeSection === link.id
                  ? "underline underline-offset-[12px] text-secondary font-semibold"
                  : "navLink relative inline-block after:content-[''] after:absolute after:-bottom-[7px] after:text-secondary after:start-4 after:w-0 after:h-[2px] after:bg-current after:transition-all after:duration-300 hover:after:w-[36px]",
              )}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      {/* Contact Button */}
      <div className="hidden md:flex gap-8 md:gap-4 lg:me-16 md:me-8 items-center">
        <button
          id="lang"
          className="cursor-pointer md:flex text-primary-foreground"
        >
          {activeLang}
        </button>
        <Button
          variant="navSecondary"
          className="lg:px-8 md:px-5 py-6 font-normal flex flex-row-reverse"
        >
          تواصل الآن
          <span>
            <Whatsapp className="inline" />
          </span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
