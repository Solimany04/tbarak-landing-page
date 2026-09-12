import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { whatsappHref } from "@/lib/whatsapp";

/* Built from Figma node 2014:3772 ("Tabarak – Landing Page Design").
   The redesign drops the email form entirely: the section is now a heading,
   a subtitle and a single WhatsApp call-to-action beside the map card.

   Values below are the literal Figma values rather than theme tokens, by
   request. Two of them sit within 1/255 of an existing token — the section
   background #1C3535 vs `--primary` (#1D3535) and the accent #F68A4A vs
   `--accent` (#F58B4D) — so swapping to `bg-primary` / `bg-accent` is a
   one-word change if you ever want them back on the token system. */

/* The number lives in NEXT_PUBLIC_WHATSAPP_NUMBER and is normalised in
   lib/whatsapp.ts (digits only, country code included). Until it is set in the
   BUILD environment — on Vercel that means Project Settings → Environment
   Variables plus a redeploy — the button renders as a disabled-looking,
   non-navigating link. */

/* prime:whatsapp, exported from the Figma node. The 24×24.01 outer box and
   16×16.01 glyph are the designed geometry; `currentColor` lets the glyph
   flip to #1C3535 on hover along with the label. */
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24.01"
    viewBox="0 0 24 24.01"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path
      d="M17.6085 6.3215C16.875 5.58246 16.0018 4.99664 15.0399 4.5981C14.0779 4.19957 13.0463 3.99628 12.005 4.00005C10.613 4.00141 9.24575 4.36848 8.04024 5.06449C6.83472 5.76051 5.83322 6.76104 5.13605 7.96589C4.43888 9.17074 4.0705 10.5376 4.06781 11.9296C4.06511 13.3217 4.4282 14.6899 5.1207 15.8975L4 20.0101L8.20263 18.9094C9.36262 19.5562 10.6669 19.9003 11.995 19.91C14.106 19.9101 16.1315 19.0763 17.6308 17.5902C19.13 16.1041 19.9815 14.0859 20 11.975C19.993 10.9217 19.7781 9.88007 19.3677 8.90992C18.9573 7.93978 18.3595 7.06016 17.6085 6.3215ZM12.005 18.5391C10.8221 18.5389 9.66093 18.221 8.6429 17.6186L8.40275 17.4685L5.91119 18.1289L6.57161 15.6974L6.41151 15.4472C5.56023 14.073 5.24252 12.4343 5.51857 10.8416C5.79463 9.2488 6.64526 7.8126 7.90935 6.80503C9.17343 5.79746 10.7632 5.28851 12.3774 5.3746C13.9916 5.46068 15.5182 6.13581 16.6679 7.2721C17.9247 8.50106 18.6442 10.1774 18.6692 11.935C18.6533 13.692 17.9442 15.3717 16.6962 16.6085C15.4481 17.8453 13.7621 18.5392 12.005 18.5391ZM15.6173 13.596C15.4171 13.496 14.4465 13.0157 14.2664 12.9556C14.0863 12.8956 13.9462 12.8556 13.8161 13.0557C13.6204 13.324 13.4099 13.5812 13.1857 13.8262C13.0757 13.9663 12.9556 13.9763 12.7555 13.8262C11.6145 13.3753 10.6639 12.5448 10.0638 11.4747C9.85366 11.1245 10.2639 11.1445 10.6442 10.394C10.6722 10.3399 10.6869 10.2799 10.6869 10.2189C10.6869 10.158 10.6722 10.0979 10.6442 10.0438C10.6442 9.94377 10.1939 8.96315 10.0338 8.57291C9.87367 8.18267 9.71357 8.2427 9.58349 8.2327H9.19325C9.09202 8.23359 8.9922 8.25642 8.90064 8.29961C8.80909 8.34279 8.72798 8.40531 8.66291 8.48285C8.43892 8.70156 8.26415 8.96552 8.15027 9.25713C8.03639 9.54874 7.98601 9.86129 8.0025 10.1739C8.06407 10.9227 8.34611 11.6365 8.81301 12.2252C9.66609 13.5015 10.8346 14.5355 12.2051 15.2271C12.9241 15.6468 13.7596 15.8223 14.5866 15.7274C14.862 15.6727 15.1228 15.5607 15.3521 15.3987C15.5814 15.2366 15.774 15.0282 15.9174 14.7868C16.0515 14.4926 16.0934 14.1647 16.0375 13.8462C15.9475 13.7461 15.8174 13.6961 15.6173 13.596Z"
      fill="currentColor"
    />
  </svg>
);

const I_ContactSection = () => {
  const t = useTranslations("contact");
  const tCommon = useTranslations("common");

  const href = whatsappHref(tCommon("genericWhatsappMessage"));

  return (
    <section
      id="contact-section"
      className="relative bg-[#1C3535] scroll-mt-21"
    >
      {/* Ambient glows — 152px circles, #F68A4A at 60%, Figma layer blur 300.
          Positions are percentages of the 1440×701 frame so they track the
          section as it scales; logical `start` mirrors them for LTR. */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute w-38 h-38 rounded-full bg-[#F68A4A]/60 blur-[100px] start-[3.3%] top-[4.2%]" />
        <div className="absolute w-38 h-38 rounded-full bg-[#F68A4A]/60 blur-[100px] start-[32.4%] top-[58.4%]" />
      </div>

      {/* Figma: horizontal auto-layout, 64px padding, 106px gap, centered.
          DOM order is [copy, map] so RTL puts the copy on the right and the
          map on the left exactly as designed — and mirrors it in English. */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 xl:gap-[106px] px-4 py-12 lg:p-10 xl:p-16">
        {/* Copy + CTA — Figma "Form wrapper", 490×312, px-32 py-40, gap-64 */}
        <div className="flex flex-col items-center w-full max-w-[490px] shrink-0 px-8 py-10 gap-10 md:gap-16">
          {/* Figma "Form heading" — gap-8, centered */}
          <div className="flex flex-col items-center justify-center gap-2 w-full text-center">
            <h2 className="text-white font-semibold text-3xl md:text-5xl md:leading-[72px] tracking-[-0.02em]">
              {t("heading")}
            </h2>
            <p className="text-white/80 font-normal text-lg md:text-2xl md:leading-9 tracking-[-0.01em]">
              {t("subtitle")}
            </p>
          </div>

          {/* Figma "com Button" — fills the 426px content width, radius 30,
              px-32 py-14, gap-8. Hover variant 101:115 is a white fill with
              #1C3535 label and icon, 200ms ease-out. */}
          <Link href={href || "#"} target="_blank" rel="noopener noreferrer"
            className={`flex flex-row items-center justify-center gap-2 w-full rounded-[30px] bg-[#F68A4A] px-8 py-3.5 text-white transition-colors duration-200 ease-out hover:bg-white hover:text-[#1C3535] ${href ? "" : "pointer-events-none opacity-60"
              }`}
          >
            <WhatsAppIcon className="shrink-0" />
            <span className="font-normal text-[16px] leading-[22.4px] tracking-[-0.025em]">
              {tCommon("contactNow")}
            </span>
          </Link>
        </div>

        {/* Map card — Figma "Image box", 591×573 with 10px side padding.
            The PNG in /public is the Figma export, so the 32px corner radius
            and the bottom #1C3535 gradient are already baked into it. */}
        <Link href="https://maps.app.goo.gl/u6PWEFruWn1VbvgL8" target="_blank" rel="noopener noreferrer" className="relative w-full max-w-[591px] px-2.5 brightness-90 hover:brightness-110 transition-[filter] duration-400 ease-out">
          <Image
            src="/tbarak google maps location.png"
            alt={t("companyName")}
            width={571}
            height={573}
            className="w-full h-auto"
          />
          {/* Figma "Frame 10" — absolute, 466 wide, gap-6, aligned to the
              inline start (right in Arabic), 34px above the card's bottom. */}
          <div className="absolute bottom-[34px] start-[31px] end-[94px] flex flex-col items-start gap-1.5 text-start">
            <p className="text-white/70 font-medium text-[16px] leading-6 tracking-[-0.01em]">
              {t("addressNote")}
            </p>
            <p className="text-white/80 font-semibold text-[16px] leading-6 tracking-[-0.01em]">
              {t("companyName")}
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default I_ContactSection;
