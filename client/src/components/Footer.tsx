import { Link } from "wouter";
import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import tedxLogo from "@/assets/images/tedx-logo.png";

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
          <div className="flex items-center mb-6 md:mb-0">
            <img
              src={tedxLogo}
              alt="TEDx Logo"
              className="h-8 mr-2"
            />
            <span className="font-poppins font-bold text-lg">
              Nakhchivan State University
            </span>
          </div>

          <div className="flex space-x-6">
            <a
              href="#"
              className="hover:text-tedred transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="hover:text-tedred transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="hover:text-tedred transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="hover:text-tedred transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-4">
                TEDx Nakhchivan State University
              </h4>
              <p className="text-gray-400 text-sm">
                TEDx, TED lisenziyası altında yerli icmalar tərəfindən müstəqil
                şəkildə təşkil edilən tədbirlərdir. Bu tədbir, TED konfrans
                formatında, yerli toplum üçün TED təcrübəsini yaratmaq məqsədi
                daşıyır.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Əlaqələr</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a
                    href="mailto:info@tedxnakhchivansu.com"
                    className="hover:text-white transition-colors"
                  >
                    info@tedxnakhchivansu.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+994501234567"
                    className="hover:text-white transition-colors"
                  >
                    +994 50 123 45 67
                  </a>
                </li>
                <li>
                  Naxçıvan Dövlət Universiteti, AZ7000 Naxçıvan, Azərbaycan
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Naviqasiya</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="hover:text-white transition-colors"
                  >
                    Haqqında
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("speakers")}
                    className="hover:text-white transition-colors"
                  >
                    Spikerlər
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("program")}
                    className="hover:text-white transition-colors"
                  >
                    Proqram
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("register")}
                    className="hover:text-white transition-colors"
                  >
                    Qeydiyyat
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="hover:text-white transition-colors"
                  >
                    Əlaqə
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-400 text-sm mb-2">
            TEDx is independently organized under TED license
          </p>
          <p className="text-gray-500 text-xs">
            &copy; 2025 TEDx Nakhchivan State University. Bütün hüquqlar
            qorunur.
          </p>
        </div>
      </div>
    </footer>
  );
}
