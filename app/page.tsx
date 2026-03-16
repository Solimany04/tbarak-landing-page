import About from "@/components/ui/About";
import Hero from "@/components/ui/Hero";
import Navbar from "@/components/ui/Navbar";
import Products from "@/components/ui/Products";
import ProductsSection from "@/components/ui/ProductsSection";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About/>
      <Products/>
      <section id="about-section" className="h-500 bg-accent"></section>
      {/* <ProductsSection/> */}
      {/* <Button size="lg">Click me</Button> */}
      {/* <WhatsAppButton/> */}
    </div>
  );
}
