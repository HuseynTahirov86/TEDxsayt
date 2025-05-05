import { motion } from "framer-motion";
import {
  FaBuilding,
  FaUniversity,
  FaLaptop,
  FaGraduationCap,
  FaHandshake,
  FaMedal,
  FaBriefcase,
  FaGlobe
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Sponsors() {
  const { t } = useTranslation();
  
  // Example sponsor logos with generic icons
  const sponsorLogos = [
    { Icon: FaUniversity, name: "Naxçıvan Dövlət Universiteti" },
    { Icon: FaBuilding, name: "Naxçıvan Şəhər İcra Hakimiyyəti" },
    { Icon: FaLaptop, name: "TechAzərbaycan" },
    { Icon: FaGraduationCap, name: "Təhsil Nazirliyi" },
    { Icon: FaHandshake, name: "İnnovasiya Mərkəzi" },
    { Icon: FaMedal, name: "Gənclər Fondu" },
    { Icon: FaBriefcase, name: "İş Adamları Assosiasiyası" },
    { Icon: FaGlobe, name: "Beynəlxalq Əməkdaşlıq Mərkəzi" },
  ];

  return (
    <section id="sponsors" className="py-16 bg-gradient-to-b from-gray-100 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tərəfdaşlarımız
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            TEDx Nakhchivan State University tədbirini dəstəkləyən qurumlar və sponsorlar.
          </p>
        </motion.div>

        {/* Animated grid for sponsor logos instead of marquee */}
        <div className="my-10 bg-white shadow-sm rounded-lg py-8 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {sponsorLogos.map((sponsor, index) => (
              <motion.div 
                key={`sponsor-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center justify-center text-center p-4"
              >
                <sponsor.Icon size={60} className="text-gray-600 hover:text-tedred transition-colors mb-3" />
                <p className="text-sm text-gray-700 font-medium">{sponsor.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Become a sponsor CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12 p-8 bg-white rounded-lg shadow-md border border-gray-100"
        >
          <h3 className="text-2xl font-bold mb-4">Sponsor olmaq istəyirsiniz?</h3>
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
            TEDx Nakhchivan State University tədbirini dəstəkləyərək innovativ ideyaların və 
            ilham verici mühazirələrin bir parçası olun.
          </p>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const contactSection = document.getElementById("contact");
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="inline-block bg-tedred hover:bg-red-700 text-white font-medium px-8 py-3 rounded-md transition-all transform hover:scale-105"
          >
            Sponsor olun
          </a>
        </motion.div>
      </div>
    </section>
  );
}