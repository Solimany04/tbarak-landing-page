import { ChevronDown } from "lucide-react";

export const scrollToNextSection = (destination:string) => {
    // نقوم بتحديد السكشن الذي نريد النزول إليه عن طريق الـ ID
    const nextSection = document.getElementById(destination);
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };