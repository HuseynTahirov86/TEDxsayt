import { Link } from "wouter";
import { Instagram, Linkedin, Youtube, Facebook, Mail, Phone, MapPin } from "lucide-react";
import tedxLogo from "@/assets/images/tedx-logo.png";
import { motion } from "framer-motion";

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-tedblack text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <motion.div 
            className="flex items-center mb-6 md:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={tedxLogo}
              alt=""
              className="h-8 mr-2"
            />
            <span className="font-poppins font-bold text-lg">
              Naxçıvan Dövlət Universiteti
            </span>
          </motion.div>

          <motion.div 
            className="flex space-x-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.a
              href="https://www.instagram.com/tedxnakhchivanstateuniversity?igsh=Mzd1bXY1eWtwazA4&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-tedred transition-colors"
              aria-label="Instagram"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Instagram className="h-5 w-5" />
            </motion.a>
            <motion.a
              href="https://az.linkedin.com/school/naxçıvan-dövlət-universiteti/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-tedred transition-colors"
              aria-label="LinkedIn"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin className="h-5 w-5" />
            </motion.a>
            <motion.a
              href="https://www.facebook.com/share/1EVCTH2CyK/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-tedred transition-colors"
              aria-label="Facebook"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Facebook className="h-5 w-5" />
            </motion.a>
            <motion.a
              href="https://www.youtube.com/user/TEDxTalks"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-tedred transition-colors"
              aria-label="YouTube"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Youtube className="h-5 w-5" />
            </motion.a>
          </motion.div>
        </div>

        <div className="border-t border-gray-800 pt-8 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="font-semibold text-lg mb-4">
                TEDx Naxçıvan Dövlət Universiteti
              </h4>
              <p className="text-gray-400 text-sm">
                TEDx, TED lisenziyası altında yerli icmalar tərəfindən müstəqil
                şəkildə təşkil edilən tədbirlərdir. Bu tədbir, TED konfrans
                formatında, yerli toplum üçün TED təcrübəsini yaratmaq məqsədi
                daşıyır.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="font-semibold text-lg mb-4">Əlaqələr</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-tedred" />
                  <a
                    href="mailto:huseyntahirov@ndu.edu.az"
                    className="hover:text-white transition-colors"
                  >
                    huseyntahirov@ndu.edu.az
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-tedred" />
                  <a
                    href="tel:+994605285505"
                    className="hover:text-white transition-colors"
                  >
                    +994 60 528 55 05
                  </a>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-tedred mt-1 flex-shrink-0" />
                  <span>
                    Naxçıvan Dövlət Universiteti, AZ7000 Naxçıvan, Azərbaycan
                  </span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="font-semibold text-lg mb-4">Naviqasiya</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <motion.button
                    onClick={() => scrollToSection("about")}
                    className="hover:text-white transition-colors flex items-center"
                    whileHover={{ x: 4 }}
                  >
                    <span className="text-tedred mr-1">›</span> Haqqında
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    onClick={() => scrollToSection("speakers")}
                    className="hover:text-white transition-colors flex items-center"
                    whileHover={{ x: 4 }}
                  >
                    <span className="text-tedred mr-1">›</span> Spikerlər
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    onClick={() => scrollToSection("program")}
                    className="hover:text-white transition-colors flex items-center"
                    whileHover={{ x: 4 }}
                  >
                    <span className="text-tedred mr-1">›</span> Proqram
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    onClick={() => scrollToSection("register")}
                    className="hover:text-white transition-colors flex items-center"
                    whileHover={{ x: 4 }}
                  >
                    <span className="text-tedred mr-1">›</span> Qeydiyyat
                  </motion.button>
                </li>
                <li>
                  <motion.button
                    onClick={() => scrollToSection("contact")}
                    className="hover:text-white transition-colors flex items-center"
                    whileHover={{ x: 4 }}
                  >
                    <span className="text-tedred mr-1">›</span> Əlaqə
                  </motion.button>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="border-t border-gray-800 pt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-400 text-sm mb-2">
            TEDx is independently organized under TED license
          </p>
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} TEDx Naxçıvan Dövlət Universiteti. Bütün hüquqlar qorunur.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}