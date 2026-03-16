export const scrollToNextSection = (destination:string) => {
    const nextSection = document.getElementById(destination);
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };