"use client";
import { Whatsapp } from "react-bootstrap-icons";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { useScroll } from "@/lib/hooks/useScroll";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { scrollToNextSection } from "@/lib/actions/scrollToNextSection";
import { Link } from "@/i18n/navigation";
import LocaleSwitcher from "../LocaleSwitcher";

const Navbar = () => {
  const t = useTranslations("nav");
  const t2 = useTranslations("common");
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

  // Mobile hamburger menu (Figma "Nav Bar Top" open state, < md only)
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const whatsappHref = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${t2("genericWhatsappMessage")}`;

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

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
        <Link href={whatsappHref} target="_blank">

          <Button

            variant="navSecondary"
            className="lg:px-8 md:px-5 py-6 font-normal flex flex-row-reverse"
          >
            {t("ctaNow")}
            <span>
              <Whatsapp className="inline" />
            </span>
          </Button>
        </Link>
      </div>

      {/* Mobile hamburger toggle */}
      <button
        type="button"
        aria-label={t("openMenu")}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => setMenuOpen(true)}
        className="md:hidden me-4 p-1 cursor-pointer"
      >
        <Menu className="size-6" strokeWidth={2} />
      </button>

      {/* Mobile menu panel */}
      {menuOpen && (
        <>
          {/* Click-outside backdrop (invisible, sits under the panel) */}
          <div
            aria-hidden
            onClick={closeMenu}
            className="md:hidden fixed inset-0"
          />
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            className="md:hidden fixed inset-x-0 top-0 flex flex-col items-center gap-2 p-4 pb-19 bg-linear-to-b from-[#989E90]/40 to-transparent backdrop-blur-[30px] text-foreground"
          >
            {/* Header row: logo + close */}
            <div className="w-full h-8.5 flex items-center justify-between">
              <Link
                href="/"
                onClick={closeMenu}
                className="w-auto max-w-17 drop-shadow-[0_0_6px_rgba(0,0,0,0.25)]"
              >
                <Image
                  src="/vector.svg"
                  alt="logo"
                  width={200}
                  height={200}
                  className="w-full"
                />
              </Link>
              <button
                type="button"
                aria-label={t("closeMenu")}
                onClick={closeMenu}
                className="p-1 cursor-pointer text-primary"
              >
                <X className="size-6" strokeWidth={2} />
              </button>
            </div>

            {/* Links */}
            <ul className="flex flex-col items-center gap-4">
              {[...navLinks].reverse().map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      scrollToNextSection(link.id);
                    }}
                    className={cn(
                      "text-xl leading-7.5 pb-1 border-b-[1.5px] cursor-pointer transition-colors",
                      activeSection === link.id
                        ? "text-foreground border-secondary"
                        : "text-muted-foreground border-transparent",
                    )}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href={whatsappHref}
              target="_blank"
              onClick={closeMenu}
              className="w-full"
            >
              <Button
                variant="navSecondary"
                className="w-full h-13 px-5 text-base font-normal gap-2"
              >
                {t("ctaNow")}
                <Whatsapp className="size-6" />
              </Button>
            </Link>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
