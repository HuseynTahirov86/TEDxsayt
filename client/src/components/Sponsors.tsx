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
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface Sponsor {
  id: number;
  name: string;
  logo: string;
  website?: string;
  level: string;
  order: number;
  createdAt: string;
}

interface DefaultSponsor {
  Icon: React.ElementType;
  name: string;
}

export default function Sponsors() {
  // Fetch sponsors from API
  const { data: sponsors, isLoading } = useQuery<Sponsor[]>({
    queryKey: ["/api/sponsors"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Default sponsors if none in database
  const defaultSponsors: DefaultSponsor[] = [
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
            TEDx Naxçıvan Dövlət Universiteti tədbirini dəstəkləyən qurumlar və sponsorlarar.
          </p>
        </motion.div>

        {/* Animated grid for sponsor logos grouped by level */}
        <div className="my-10 bg-white shadow-sm rounded-lg py-8 px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-tedred" />
            </div>
          ) : sponsors && sponsors.length > 0 ? (
            <div className="space-y-12">
              {/* Group sponsors by level and display each group */}
              {["platinum", "gold", "silver", "bronze", "partner", "media"].map(level => {
                const levelSponsors = sponsors.filter(s => s.level === level);
                if (levelSponsors.length === 0) return null;
                
                // Determine level title
                const levelTitle = {
                  platinum: "Platinum Sponsorlar",
                  gold: "Qızıl Sponsorlar",
                  silver: "Gümüş Sponsorlar",
                  bronze: "Bürünc Sponsorlar",
                  partner: "Tərəfdaşlar",
                  media: "Media Tərəfdaşları"
                }[level];
                
                // Determine image size based on level and count
                const getSizeClass = () => {
                  // Base size depends on level importance
                  const baseSize = {
                    platinum: "w-40 h-40",
                    gold: "w-32 h-32",
                    silver: "w-28 h-28",
                    bronze: "w-24 h-24",
                    partner: "w-24 h-24",
                    media: "w-24 h-24"
                  }[level];
                  
                  // If there's only one, make it larger
                  if (levelSponsors.length === 1) {
                    return {
                      platinum: "w-64 h-64",
                      gold: "w-48 h-48",
                      silver: "w-40 h-40",
                      bronze: "w-36 h-36",
                      partner: "w-36 h-36",
                      media: "w-36 h-36"
                    }[level];
                  }
                  
                  // If there are two, make them medium sized
                  if (levelSponsors.length === 2) {
                    return {
                      platinum: "w-52 h-52",
                      gold: "w-40 h-40",
                      silver: "w-36 h-36",
                      bronze: "w-32 h-32",
                      partner: "w-32 h-32",
                      media: "w-32 h-32"
                    }[level];
                  }
                  
                  return baseSize;
                };
                
                // Determine grid columns based on count
                const getGridClass = () => {
                  if (levelSponsors.length === 1) return "grid-cols-1";
                  if (levelSponsors.length === 2) return "grid-cols-2";
                  if (levelSponsors.length === 3) return "grid-cols-3";
                  return "grid-cols-2 md:grid-cols-4"; // 4 or more
                };
                
                return (
                  <div key={level} className="pt-6 first:pt-0">
                    <h3 className="text-xl font-semibold text-center mb-6">{levelTitle}</h3>
                    <div className={`grid ${getGridClass()} gap-8 justify-items-center`}>
                      {levelSponsors.sort((a, b) => a.order - b.order).map((sponsor, index) => (
                        <motion.div 
                          key={`sponsor-${sponsor.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="flex flex-col items-center justify-center text-center p-4 relative group"
                        >
                          {sponsor.website ? (
                            <motion.a 
                              href={sponsor.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`${getSizeClass()} flex items-center justify-center bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 p-4`}
                              whileHover={{ 
                                y: -8, 
                                scale: 1.05,
                                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)" 
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <motion.img 
                                src={sponsor.logo} 
                                alt={sponsor.name} 
                                className="max-w-full max-h-full object-contain"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              />
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-tedred/10 to-transparent opacity-0 transition-opacity duration-300"
                                whileHover={{ opacity: 1 }}
                              />
                            </motion.a>
                          ) : (
                            <motion.div 
                              className={`${getSizeClass()} flex items-center justify-center bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 p-4`}
                              whileHover={{ 
                                y: -8, 
                                scale: 1.05,
                                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)" 
                              }}
                            >
                              <motion.img 
                                src={sponsor.logo} 
                                alt={sponsor.name} 
                                className="max-w-full max-h-full object-contain"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              />
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-tedred/10 to-transparent opacity-0 transition-opacity duration-300"
                                whileHover={{ opacity: 1 }}
                              />
                            </motion.div>
                          )}
                          <motion.p
                            className="mt-3 text-sm font-medium text-gray-600 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                            whileInView={{ opacity: 0 }}
                            whileHover={{ opacity: 1, y: 0 }}
                          >
                            {sponsor.name}
                          </motion.p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6">
              {defaultSponsors.map((sponsor, index) => (
                <motion.div 
                  key={`default-sponsor-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center justify-center text-center p-4 relative group cursor-pointer"
                >
                  <motion.div 
                    className="w-24 h-24 bg-white rounded-lg shadow-sm flex items-center justify-center relative overflow-hidden"
                    whileHover={{ 
                      y: -8, 
                      scale: 1.05,
                      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)" 
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-tedred/10 to-transparent opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5, color: "#ef4444" }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <sponsor.Icon size={44} className="text-gray-600 group-hover:text-tedred transition-all duration-300" />
                    </motion.div>
                  </motion.div>
                  <motion.p 
                    className="mt-3 text-sm font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ y: 10, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                  >
                    {sponsor.name}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        {/* Become a sponsor CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          viewport={{ once: true }}
          className="text-center mt-12 p-8 bg-gradient-to-r from-white via-gray-50 to-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative"
        >
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-tedred/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-tedred/5 rounded-full blur-3xl"></div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.h3 
              className="text-2xl md:text-3xl font-bold mb-4 relative inline-block"
              whileInView={{ 
                borderBottom: ["4px solid rgba(239, 68, 68, 0)", "4px solid rgba(239, 68, 68, 1)"],
                transition: { delay: 0.5, duration: 0.8 }
              }}
            >
              Sponsor olmaq istəyirsiniz?
            </motion.h3>
            <motion.p 
              className="text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
            >
              TEDx Naxçıvan Dövlət Universiteti tədbirini dəstəkləyərək innovativ ideyaların və 
              ilham verici mühazirələrin bir parçası olun.
            </motion.p>
            
            <motion.div
              className="flex items-center justify-center flex-wrap gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  const contactSection = document.getElementById("contact");
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="relative overflow-hidden inline-flex items-center bg-tedred text-white font-medium px-8 py-3 rounded-md shadow-md group hover:scale-105 transition-all duration-300"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0px 5px 20px rgba(239, 68, 68, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-white opacity-10 rotate-45 group-hover:-translate-x-60 group-hover:-translate-y-40 ease-out"></span>
                <span className="relative z-10">Sponsor olun</span>
              </motion.a>
              
              <motion.a
                href="#program"
                onClick={(e) => {
                  e.preventDefault();
                  const programSection = document.getElementById("program");
                  if (programSection) {
                    programSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="relative overflow-hidden inline-flex items-center bg-white text-tedgray border border-gray-200 font-medium px-8 py-3 rounded-md shadow-sm group hover:border-tedred/30 transition-all duration-300"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.05)",
                  color: "#ef4444"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Tədbirə baxın</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}