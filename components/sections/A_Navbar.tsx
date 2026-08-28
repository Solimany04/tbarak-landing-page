"use client";
import { Whatsapp } from "react-bootstrap-icons";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { useScroll } from "@/lib/hooks/useScroll";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { scrollToNextSection } from "@/lib/actions/scrollToNextSection";
import Link from "next/link";
import LocaleSwitcher from "../LocaleSwitcher";

const Navbar = () => {
  const t = useTranslations("nav");
  const activeSection = useActiveSection([
    "hero-section",
    "about-section",
    "products-section",
    "process-section",
    "why-section",
    "contact-section",
  ]);

  const navLinks = [
    { id: "contact-section", label: t("contact") },
    { id: "why-section", label: t("why") },
    { id: "process-section", label: t("process") },
    { id: "products-section", label: t("products") },
    { id: "about-section", label: t("about") },
    { id: "hero-section", label: t("home") },
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
      <Link
        href="/"
        className="me-auto md:me-0 ms-4 md:ms-8 lg:me-16 || w-auto max-w-17 md:w-auto md:max-w-20 lg:w-auto lg:max-w-25"
      >
        <Image
          src="/vector.svg"
          alt="logo"
          width={200}
          height={200}
          className="w-full"
        />
      </Link>

      {/* Navigation */}
      <ul className="hidden md:flex flex-row-reverse lg:text-xl md:text-base">
        {navLinks.map((link) => (
          <li key={link.id}>
            <button
              type="button"
              onClick={() => scrollToNextSection(`${link.id}`)}
              className={cn(
                "transition-colors md:px-2 lg:px-4 cursor-pointer",
                activeSection === link.id
                  ? "underline underline-offset-12 text-secondary font-medium"
                  : "navLink relative inline-block after:content-[''] font-light after:absolute after:-bottom-1.75 after:text-secondary after:start-4 after:w-0 after:h-0.5 after:bg-current after:transition-all after:duration-300 hover:after:w-9",
              )}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
      {/* Contact Button */}
      <div className="hidden md:flex gap-8 md:gap-4 lg:me-16 md:me-8 items-center">
        <LocaleSwitcher />
        <Button
          variant="navSecondary"
          className="lg:px-8 md:px-5 py-6 font-normal flex flex-row-reverse"
        >
          {t("ctaNow")}
          <span>
            <Whatsapp className="inline" />
          </span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
