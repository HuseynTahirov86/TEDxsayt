import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import tedxLogo from "@/assets/images/tedx-logo.png";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    closeMobileMenu();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      id="navbar"
      className={cn(
        "sticky-nav fixed w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-tedblack/95 py-2 shadow-md"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img
              src={tedxLogo}
              alt=""
              className="h-8 mr-2"
            />
            <span className="text-white font-poppins font-bold text-lg tracking-tight hidden sm:inline-block">
              Nakhchivan State University
            </span>
          </Link>

          <div className="hidden md:flex space-x-8 text-white font-medium">
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-tedred transition-colors"
            >
              Haqqında
            </button>
            <button
              onClick={() => scrollToSection("speakers")}
              className="hover:text-tedred transition-colors"
            >
              Spikerlər
            </button>
            <button
              onClick={() => scrollToSection("program")}
              className="hover:text-tedred transition-colors"
            >
              Proqram
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="hover:text-tedred transition-colors"
            >
              Əlaqə
            </button>
          </div>

          <button
            onClick={() => scrollToSection("register")}
            className="hidden md:block bg-tedred hover:bg-red-700 text-white font-medium px-6 py-2 rounded-md transition-colors"
          >
            Qeydiyyat
          </button>

          <button
            id="mobileMenuButton"
            onClick={toggleMobileMenu}
            className="md:hidden text-white"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobileMenu"
        className={cn(
          "md:hidden bg-tedblack text-white animate-fade-in transition-all duration-300",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <button
            onClick={() => scrollToSection("about")}
            className="py-2 hover:text-tedred transition-colors"
          >
            Haqqında
          </button>
          <button
            onClick={() => scrollToSection("speakers")}
            className="py-2 hover:text-tedred transition-colors"
          >
            Spikerlər
          </button>
          <button
            onClick={() => scrollToSection("program")}
            className="py-2 hover:text-tedred transition-colors"
          >
            Proqram
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="py-2 hover:text-tedred transition-colors"
          >
            Əlaqə
          </button>
          <button
            onClick={() => scrollToSection("register")}
            className="bg-tedred hover:bg-red-700 text-white text-center font-medium py-3 rounded-md transition-colors"
          >
            Qeydiyyat
          </button>
        </div>
      </div>
    </nav>
  );
}
