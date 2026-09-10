import Image from "next/image";
import React from "react";
import { Logo } from "../Logo";
import Link from "next/link";
import { MapPin, Mail } from 'lucide-react';
import { useTranslations } from "next-intl";
import NaviagtionButton from "../NaviagtionButton";

const SocialIcon = ({ name, size = 16 }: { name: string; size?: number }) => {
  return <Link href="" className="bg-secondary/10 text-secondary p-2.5 rounded-full inline-flex">
    <Image
      src={`/Icons/${name}.svg`}
      width={size}
      height={size}
      alt={`${name} logo`}
      style={{ width: size, height: size }}
    />
  </Link>
};

const J_FooterSection = () => {
  const t = useTranslations("footer");
  const t2 = useTranslations("common");
  return (
    <div className="flex flex-col w-full scroll-mt-21" id="footer-section">
      <div className="grid grid-cols-6 w-full pb-9 pt-24 md:ps-16 px-4">

        {/* Links */}
        <div className="md:col-span-3 col-span-6 flex md:flex-col gap-6 md:pb-0 pb-8 justify-between">
          <Link href="/" className="relative w-30 h-15 bg-primary " style={{ maskImage: "url(/vector.svg)", maskRepeat: "no-repeat", maskSize: "contain", }}>
            <Image src="/vector.svg" alt="icon" fill className="opacity-0" />
          </Link>
          <div className="flex flex-col gap-6">
            <Link href="" className="w-fit"><MapPin className="inline me-2" />{t("address")}</Link>
            <Link href="" className="w-fit"><Mail className="inline me-2" />contact@tbarak.com</Link>
            {/* Social Icons */}
            <div className="flex gap-2">
              <SocialIcon name="Facebook" />
              <SocialIcon name="Instagram" />
              <SocialIcon name="Google" />
              <SocialIcon name="LinkedIn" />
            </div>
          </div>
        </div>

        {/* Left Side List */}
        <div className="md:col-span-3 col-span-6 flex justify-around ">
          <div className="md:col-span-1 col-span-2 flex flex-col gap-6 ">
            <NaviagtionButton navID="products-section" variant={"clean"} size={undefined} content={t("products")} classes="flex cursor-pointer font-bold text-primary hover:text-secondary"></NaviagtionButton>
            <NaviagtionButton navID="products-section" productId="2" variant={"clean"} size={undefined} content={t("pSingle")} classes="flex cursor-pointer hover:text-secondary"></NaviagtionButton>
            <NaviagtionButton navID="products-section" productId="1" variant={"clean"} size={undefined} content={t("pPrasola")} classes="flex cursor-pointer hover:text-secondary"></NaviagtionButton>
            <NaviagtionButton navID="products-section" productId="4" variant={"clean"} size={undefined} content={t("pSummer")} classes="flex cursor-pointer hover:text-secondary"></NaviagtionButton>
            <NaviagtionButton navID="products-section" productId="3" variant={"clean"} size={undefined} content={t("pPika")} classes="flex cursor-pointer hover:text-secondary"></NaviagtionButton></div>
          <div className="md:col-span-1 col-span-2 flex flex-col gap-6">
            <p className="font-bold text-primary">{t("servicesTitle")}</p>
            <p className="">{t("sWholesale")}</p>
            <p className="">{t("sSamples")}</p>
            <p className="">{t("sShipping")}</p>
            <p className="">{t("sPrices")}</p></div>
          <div className="md:col-span-1 col-span-2 flex flex-col gap-6">
            <h5 className="font-bold text-primary">{t("moreTitle")}</h5>
            <Link href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${t2("supportWhatsappMessage")}`} className="hover:text-secondary" target="_blank">
              {t("support")}
            </Link>
            <Link href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`} className="hover:text-secondary">
              {t("contactUs")}
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex justify-around border-t border-gray-400">
        <p className="m-7 text-[15px] text-[#929292] font-normal">{t("rights")}</p>
      </div>
    </div>
  );
};

export default J_FooterSection;
