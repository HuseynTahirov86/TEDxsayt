import { Link } from "wouter";
import { 
  Instagram, Linkedin, Youtube, Facebook, Mail, 
  Phone, MapPin, ArrowUp, Heart, ExternalLink,
  ChevronRight, Calendar, Share2, Info
} from "lucide-react";
import tedxLogo from "@/assets/images/tedx-logo.png";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

// Social media link component with enhanced hover effect
const SocialLink = ({ 
  href, 
  icon, 
  label,
  delay = 0
}: { 
  href: string;
  icon: React.ReactNode;
  label: string;
  delay?: number;
}) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition-all duration-300 hover:bg-tedred"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + delay }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Animated glow effect */}
      <motion.div 
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
        animate={{ 
          boxShadow: [
            "0 0 0 rgba(230, 43, 30, 0)",
            "0 0 10px rgba(230, 43, 30, 0.7)",
            "0 0 0 rgba(230, 43, 30, 0)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Icon */}
      <div className="text-white group-hover:text-white">
        {icon}
      </div>
      
      {/* Tooltip */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {label}
      </div>
    </motion.a>
  );
};

// Footer navigation link with animation
const FooterNavLink = ({ 
  label, 
  sectionId, 
  index = 0, 
  onClick 
}: { 
  label: string;
  sectionId: string;
  index?: number;
  onClick: (id: string) => void;
}) => {
  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      className="overflow-hidden"
    >
      <motion.button
        onClick={() => onClick(sectionId)}
        className="group flex w-full items-center py-2 text-gray-400 transition-colors hover:text-white"
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div 
          className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-tedred/10 text-tedred"
          whileHover={{ 
            scale: 1.2, 
            backgroundColor: "rgba(239, 68, 68, 0.2)" 
          }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight size={12} />
        </motion.div>
        
        <span className="relative">
          {label}
          <motion.span 
            className="absolute -bottom-1 left-0 h-[1px] w-0 bg-tedred"
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </span>
      </motion.button>
    </motion.li>
  );
};

// Contact item with animation
const ContactItem = ({ 
  icon, 
  href, 
  text, 
  isMultiline = false,
  index = 0
}: { 
  icon: React.ReactNode;
  href?: string;
  text: string;
  isMultiline?: boolean;
  index?: number;
}) => {
  return (
    <motion.li 
      className={`flex ${isMultiline ? 'items-start' : 'items-center'} group`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
    >
      <motion.div 
        className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-tedred/10"
        whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
      >
        <motion.div 
          className="text-tedred"
          animate={{ 
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
        >
          {icon}
        </motion.div>
      </motion.div>
      
      {href ? (
        <motion.a
          href={href}
          className="text-gray-400 hover:text-white transition-colors"
          whileHover={{ x: 2 }}
        >
          {text}
        </motion.a>
      ) : (
        <span className="text-gray-400">{text}</span>
      )}
    </motion.li>
  );
};

// Back to top button component
const BackToTopButton = () => {
  const [showButton, setShowButton] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  
  return (
    <AnimatePresence>
      {showButton && (
        <motion.button
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-tedred text-white shadow-lg hover:bg-tedred/90"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ 
            y: -5,
            boxShadow: "0 10px 25px rgba(239, 68, 68, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
          
          {/* Animated ring */}
          <div className="absolute inset-0 rounded-full">
            <motion.div 
              className="absolute inset-0 rounded-full border border-white/30"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Main Footer component
export default function Footer() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const controls = useAnimation();
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const headingVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <>
      <BackToTopButton />
      
      <footer
        ref={ref}
        className="relative bg-tedblack text-white overflow-hidden"
      >
        {/* Background design elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-tedred/5 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-tedred/5 blur-3xl"></div>
        </div>
        
        {/* Top wave decoration */}
        <div className="relative h-16 bg-gradient-to-b from-gray-50 to-tedblack">
          <svg className="absolute bottom-0 w-full text-tedblack" viewBox="0 0 1440 80" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"></path>
          </svg>
        </div>
        
        {/* Main content */}
        <div className="container mx-auto px-4 py-12">
          <motion.div 
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            className="flex flex-col md:flex-row justify-between items-start mb-12"
          >
            {/* Logo and brand section */}
            <motion.div
              variants={containerVariants} 
              className="flex flex-col mb-8 md:mb-0 max-w-md"
            >
              <motion.div 
                className="flex items-center mb-4 hover-scale"
                variants={headingVariants}
              >
                <motion.img
                  src={tedxLogo}
                  alt="TEDx logo"
                  className="h-10 mr-3"
                  whileHover={{ rotate: [-1, 1, -1], transition: { duration: 0.3, repeat: 2 } }}
                />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-tedred leading-none">TEDx</span>
                  <span className="text-sm text-gray-400">Naxçıvan Dövlət Universiteti</span>
                </div>
              </motion.div>
              
              <motion.p 
                className="text-gray-400 text-sm mb-6"
                variants={headingVariants}
              >
                TEDx, TED lisenziyası altında yerli icmalar tərəfindən müstəqil şəkildə təşkil edilən tədbirlərdir. 
                Bu tədbir, TED konfrans formatında, yerli toplum üçün TED təcrübəsini yaratmaq məqsədi daşıyır.
              </motion.p>
              
              {/* Next event promo */}
              <motion.div 
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 mb-6 group"
                variants={headingVariants}
                whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
              >
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 text-tedred mr-2" />
                  <span className="font-medium text-sm">TEDx NDU 2025</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  İnnovasiya və Yaradıcılıq vasitəsilə Regional İnkişaf mövzusunda növbəti tədbir
                </p>
                <motion.button
                  className="text-xs flex items-center text-tedred hover:text-white transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <span>Daha ətraflı</span>
                  <ChevronRight className="h-3 w-3 ml-1" />
                </motion.button>
              </motion.div>
              
              {/* Social media links */}
              <motion.div
                variants={headingVariants}
                className="flex space-x-3"
              >
                <SocialLink 
                  href="https://www.instagram.com/tedxnakhchivanstateuniversity?igsh=Mzd1bXY1eWtwazA4&utm_source=qr" 
                  icon={<Instagram size={16} />} 
                  label="Instagram"
                  delay={0}
                />
                <SocialLink 
                  href="https://az.linkedin.com/school/naxçıvan-dövlət-universiteti/" 
                  icon={<Linkedin size={16} />} 
                  label="LinkedIn"
                  delay={0.1}
                />
                <SocialLink 
                  href="https://www.facebook.com/share/1EVCTH2CyK/?mibextid=wwXIfr" 
                  icon={<Facebook size={16} />} 
                  label="Facebook"
                  delay={0.2}
                />
                <SocialLink 
                  href="https://www.youtube.com/user/TEDxTalks" 
                  icon={<Youtube size={16} />} 
                  label="YouTube"
                  delay={0.3}
                />
                <SocialLink 
                  href="https://www.ted.com/tedx/events" 
                  icon={<ExternalLink size={16} />} 
                  label="TED.com"
                  delay={0.4}
                />
              </motion.div>
            </motion.div>
            
            {/* Navigation and Contact Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full md:w-auto">
              {/* Contact information */}
              <motion.div variants={containerVariants}>
                <motion.h4 
                  className="text-lg font-bold mb-5 relative inline-block"
                  variants={headingVariants}
                >
                  Əlaqələr
                  <motion.div 
                    className="absolute -bottom-1 left-0 h-0.5 bg-tedred"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                  />
                </motion.h4>
                
                <ul className="space-y-4">
                  <ContactItem 
                    icon={<Mail size={16} />}
                    href="mailto:huseyntahirov@ndu.edu.az"
                    text="huseyntahirov@ndu.edu.az"
                    index={0}
                  />
                  <ContactItem 
                    icon={<Phone size={16} />}
                    href="tel:+994605285505"
                    text="+994 60 528 55 05"
                    index={1}
                  />
                  <ContactItem 
                    icon={<MapPin size={16} />}
                    text="Naxçıvan Dövlət Universiteti, AZ7000 Naxçıvan, Azərbaycan"
                    isMultiline={true}
                    index={2}
                  />
                </ul>
                
                {/* Share and follow section */}
                <motion.div 
                  className="mt-6 pt-5 border-t border-gray-800 ml-auto md:ml-8"
                  variants={headingVariants}
                >
                  <motion.div className="flex items-center mb-3 justify-end">
                    <Share2 className="h-4 w-4 mr-2 text-tedred" />
                    <span className="text-sm font-medium">Yayım və İştirak</span>
                  </motion.div>
                  <ul className="text-xs text-gray-400 space-y-2">
                    <li className="flex items-center justify-end">
                      <span className="w-1.5 h-1.5 bg-tedred/50 rounded-full mr-2"></span>
                      <span>Canlı yayım: 16 İyun, 2025</span>
                    </li>
                    <li className="flex items-center justify-end">
                      <span className="w-1.5 h-1.5 bg-tedred/50 rounded-full mr-2"></span>
                      <span>Tam video: tədbirdən 2 həftə sonra</span>
                    </li>
                  </ul>
                </motion.div>
              </motion.div>
              
              {/* Navigation Links */}
              <motion.div variants={containerVariants}>
                <motion.h4 
                  className="text-lg font-bold mb-5 relative inline-block"
                  variants={headingVariants}
                >
                  Naviqasiya
                  <motion.div 
                    className="absolute -bottom-1 left-0 h-0.5 bg-tedred"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                  />
                </motion.h4>
                
                <ul className="space-y-1">
                  <FooterNavLink 
                    label="Haqqında" 
                    sectionId="about" 
                    index={0}
                    onClick={scrollToSection} 
                  />
                  <FooterNavLink 
                    label="Spikerlər" 
                    sectionId="speakers" 
                    index={1}
                    onClick={scrollToSection} 
                  />
                  <FooterNavLink 
                    label="Proqram" 
                    sectionId="program" 
                    index={2}
                    onClick={scrollToSection} 
                  />
                  <FooterNavLink 
                    label="Qeydiyyat" 
                    sectionId="register" 
                    index={3}
                    onClick={scrollToSection} 
                  />
                  <FooterNavLink 
                    label="Əlaqə" 
                    sectionId="contact" 
                    index={4}
                    onClick={scrollToSection} 
                  />
                </ul>
                
                {/* Newsletter prompt */}
                <motion.div 
                  className="mt-8 bg-gradient-to-br from-tedred/20 to-transparent p-4 rounded-lg"
                  variants={headingVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center mb-2">
                    <Info className="h-4 w-4 text-tedred mr-2" />
                    <span className="text-sm font-medium">TEDx Xəbərlər</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    Gələcək tədbirlər haqqında məlumat əldə etmək üçün bizimlə əlaqə saxlayın
                  </p>
                  <motion.button
                    className="text-xs flex items-center text-tedred hover:text-white transition-colors"
                    whileHover={{ x: 5 }}
                    onClick={() => scrollToSection("contact")}
                  >
                    <span>Əlaqəyə keçin</span>
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Footer bottom section */}
          <motion.div 
            className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { duration: 0.6, delay: 0.5 } 
              }
            }}
          >
            <p className="text-gray-500 text-xs mb-4 md:mb-0 text-center md:text-left">
              &copy; {new Date().getFullYear()} TEDx Naxçıvan Dövlət Universiteti. Bütün hüquqlar qorunur.
            </p>
            
            <div className="flex items-center text-gray-500 text-xs">
              <span className="mr-2">Made with</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  color: ["rgb(156, 163, 175)", "rgb(239, 68, 68)", "rgb(156, 163, 175)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="h-3 w-3" />
              </motion.div>
              <span className="ml-2">TEDx is independently organized under TED license</span>
            </div>
          </motion.div>
        </div>
      </footer>
    </>
  );
}