import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ProductsSection from "@/components/ProductsSection";
import { Button } from "@/components/ui/button";
// import WhatsAppButton from "@/components/ui/WhatsAppButton";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <section id="about-section" className="h-500 bg-accent"></section>
      {/* <ProductsSection/> */}
      {/* <Button size="lg">Click me</Button> */}
      {/* <WhatsAppButton/> */}
    </div>
  );
}
