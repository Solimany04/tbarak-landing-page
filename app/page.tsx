import ProductsSection from "@/components/ProductsSection";
import { Button } from "@/components/ui/button";
// import WhatsAppButton from "@/components/ui/WhatsAppButton";
import Image from "next/image";

export default function Home() {
  return (
  <div>
    <ProductsSection/>
    <Button size="lg">Click me</Button>
    {/* <WhatsAppButton/> */}
  </div>
  );
}
