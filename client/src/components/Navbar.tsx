import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import tedxLogo from "@/assets/images/tedx-logo.png";

// Menu item with animation and indicator
const NavItem = ({ 
  label, 
  sectionId, 
  isActive = false, 
  onClick,
  isScrolled = false
}: { 
  label: string;
  sectionId: string;
  isActive?: boolean;
  onClick: (id: string) => void;
  isScrolled?: boolean;
}) => {
  return (
    <motion.button
      onClick={() => onClick(sectionId)}
      className={cn(
        "relative font-medium px-1 py-2 mx-3 group",
        isScrolled ? "text-gray-800" : "text-white"
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Active indicator line */}
      <div className="absolute -bottom-1 left-0 right-0 h-0.5">
        <div className={cn(
          "h-full bg-tedred transform-gpu transition-transform duration-300 origin-left",
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )}></div>
      </div>
      
      {/* Text with gradient hover effect */}
      <span className={cn(
        "transition-colors duration-300",
        isActive 
          ? "text-tedred" 
          : isScrolled 
            ? "text-gray-800 group-hover:text-tedred" 
            : "text-white group-hover:text-tedred"
      )}>
        {label}
      </span>
    </motion.button>
  );
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const navRef = useRef<HTMLElement>(null);
  const prevScrollY = useRef(0);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Handle scroll events for navbar appearance and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // For showing/hiding navbar background
      setIsScrolled(currentScrollY > 50);
      
      // For adding slide-up and slide-down effects
      if (navRef.current) {
        if (currentScrollY > prevScrollY.current && currentScrollY > 300) {
          // Scrolling down & past 300px - add slide-up class
          navRef.current.classList.add('translate-y-[-100%]');
        } else {
          // Scrolling up or at top - remove slide-up class
          navRef.current.classList.remove('translate-y-[-100%]');
        }
      }
      
      prevScrollY.current = currentScrollY;
      
      // For active section tracking
      const sections = ['hero', 'about', 'speakers', 'program', 'sponsors', 'register', 'contact'];
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop - 150;
          if (currentScrollY >= sectionTop) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Smooth scroll to section
  const scrollToSection = (id: string) => {
    closeMobileMenu();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  // Navigation items
  const navItems = [
    { label: "Haqqında", id: "about" },
    { label: "Spikerlər", id: "speakers" },
    { label: "Proqram", id: "program" },
    { label: "Sponsorlar", id: "sponsors" },
    { label: "Əlaqə", id: "contact" },
  ];

  // Navbar animations
  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    open: { opacity: 1, height: 'auto', transition: { duration: 0.3 } }
  };

  return (
    <motion.nav
      id="navbar"
      ref={navRef}
      className={cn(
        "sticky-nav fixed w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/20 py-2 backdrop-blur-sm shadow-sm" 
          : "bg-gradient-to-b from-black/80 to-transparent py-4"
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative overflow-hidden">
              <img
                src={tedxLogo}
                alt="TEDx Logo"
                className="h-10 mr-2 transition-transform duration-300 group-hover:scale-105"
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-tedred/30 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.7 }}
              />
            </div>
            <span className={cn(
              "font-poppins font-bold text-lg tracking-tight hidden sm:inline-block transition-opacity duration-300 group-hover:opacity-90",
              isScrolled ? "text-gray-800" : "text-white"
            )}>
              Naxçıvan Dövlət Universiteti
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                label={item.label}
                sectionId={item.id}
                isActive={activeSection === item.id}
                onClick={scrollToSection}
                isScrolled={isScrolled}
              />
            ))}
          </div>

          {/* Desktop Registration Button */}
          <div className="hidden md:block">
            <motion.button
              onClick={() => scrollToSection("register")}
              className="relative overflow-hidden bg-tedred hover:bg-red-600 text-white font-medium px-6 py-2.5 rounded-md transition-colors shadow-md group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Animated highlight effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              
              <span className="relative z-10 font-medium tracking-wide">Qeydiyyat</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            id="mobileMenuButton"
            onClick={toggleMobileMenu}
            className={cn(
              "md:hidden p-1 rounded-md focus:outline-none",
              isScrolled ? "text-gray-800" : "text-white"
            )}
            aria-label="Menu"
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobileMenu"
            className="md:hidden bg-black/95 backdrop-blur-md text-white overflow-hidden"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "py-3 px-4 font-medium rounded-md transition-colors",
                    activeSection === item.id 
                      ? "bg-tedred/20 text-tedred" 
                      : "hover:bg-gray-800/50 hover:text-tedred"
                  )}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.button>
              ))}
              
              <motion.button
                onClick={() => scrollToSection("register")}
                className="bg-tedred hover:bg-red-700 text-white text-center font-medium py-3 px-4 rounded-md transition-colors mt-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Qeydiyyat
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
