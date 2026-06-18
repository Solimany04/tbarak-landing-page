"use client";
import { Whatsapp } from "react-bootstrap-icons";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { useScroll } from "@/lib/hooks/useScroll";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { scrollToNextSection } from "@/lib/actions/scrollToNextSection";

const Navbar = () => {
  const activeLang = (
    <div>
      <span className="fi fi-sa me-1 rounded" />
      AR
    </div>
  );
  const activeSection = useActiveSection([
    "hero-section",
    "about-section",
    "products-section",
    "process-section",
    "why-section",
    "contact-section",
  ]);

  const navLinks = [
    { id: "contact-section", label: "تواصل معنا" },
    { id: "why-section", label: "المميزات" },
    { id: "process-section", label: "مراحل العمل" },
    { id: "products-section", label: "المنتجات" },
    { id: "about-section", label: "من نحن" },
    { id: "hero-section", label: "الصفحة الرئيسية" },
  ];

  const isScrolled = useScroll(100);

  return (
    <nav
      className={cn(
        "fixed top-0 z-100 w-full h-16.75 md:h-21 flex items-center justify-between ",
        isScrolled
          ? "bg-primary text-primary-foreground"
          : "bg-linear-to-b from-black/40 to-transparent",
      )}
    >
      {/* LOGO */}
      <a
        href="http://"
        target="_blank"
        rel="noopener noreferrer"
        className="me-auto md:me-0 ms-4 md:ms-8 lg:me-16 || w-auto max-w-17 md:w-auto md:max-w-20 lg:w-auto lg:max-w-25"
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
              onClick={() => scrollToNextSection(`${link.id}`)}
              href={`#${link.id}`}
              className={cn(
                "transition-colors md:px-2 lg:px-4",
                activeSection === link.id
                  ? "underline underline-offset-12 text-secondary font-medium"
                  : "navLink relative inline-block after:content-[''] font-light after:absolute after:-bottom-1.75 after:text-secondary after:start-4 after:w-0 after:h-0.5 after:bg-current after:transition-all after:duration-300 hover:after:w-9",
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
