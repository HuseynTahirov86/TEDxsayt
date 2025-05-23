import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyTedx from "@/components/WhyTedx";
import About from "@/components/About";
import Speakers from "@/components/Speakers";
import Program from "@/components/Program";
import Register from "@/components/Register";
import Contact from "@/components/Contact";
import Sponsors from "@/components/Sponsors";
import Footer from "@/components/Footer";
import { useAnimation } from "@/hooks/use-animation";

export default function Home() {
  const { setupScrollAnimation } = useAnimation();

  useEffect(() => {
    setupScrollAnimation();
    // Set page title and meta description
    document.title = "TEDx Naxçıvan Dövlət Universiteti | June 16, 2025";
    
    // Add favicon
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = "https://www.ted.com/favicon.ico";
    }
  }, [setupScrollAnimation]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <WhyTedx />
      <About />
      <Speakers />
      <Program />
      <Sponsors />
      <Register />
      <Contact />
      <Footer />
    </div>
  );
}
