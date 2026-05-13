import About from "@/components/sections/C_About";
import ContactSection from "@/components/sections/H_ContactSection";
import FeedbackSection from "@/components/sections/G_FeedbackSection";
import Hero from "@/components/sections/B_Hero";
import J_FooterSection from "@/components/sections/J_FooterSection";
import Navbar from "@/components/sections/A_Navbar";
import ProductionProcess from "@/components/sections/E_ProductionProcess";
import Products from "@/components/sections/D_Products";
import WhySection from "@/components/sections/F_WhySection";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About/>
      <Products/>
      <ProductionProcess/>
      <WhySection/>
      <FeedbackSection/>
      <ContactSection/>
      <J_FooterSection/>
      {/* <ProductsSection/> */}
      {/* <Button size="lg">Click me</Button> */}
      {/* <WhatsAppButton/> */}
    </div>
  );
}
