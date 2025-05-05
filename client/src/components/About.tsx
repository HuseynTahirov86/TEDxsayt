import { useEffect, useState, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Clock, 
  Users, 
  Globe, 
  ChevronRight, 
  Info, 
  Sparkles,
  Lightbulb,
  BarChart,
  ZoomIn
} from "lucide-react";

// Fact Card that flips on hover
const FlipCard = ({ title, content, icon, index }: { 
  title: string; 
  content: string; 
  icon: React.ReactNode;
  index: number;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="relative h-36 w-full"
      style={{ perspective: "1000px" }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          type: "spring",
          stiffness: 100,
          damping: 12,
          delay: 0.2 * index 
        }
      }}
      whileHover={{ scale: 1.03 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <motion.div 
        className="absolute inset-0 z-10 w-full h-full"
        style={{ 
          transformStyle: "preserve-3d",
          transform: isHovered ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.6s"
        }}
      >
        {/* Front side */}
        <motion.div 
          className="absolute inset-0 rounded-xl bg-white p-6 shadow-md flex flex-col justify-center overflow-hidden w-full h-full"
          style={{ 
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden"
          }}
          animate={{
            boxShadow: isHovered ? "0 10px 30px rgba(0, 0, 0, 0.1)" : "0 4px 6px rgba(0, 0, 0, 0.05)"
          }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-tedred/5 to-transparent opacity-0"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          <div className="flex items-center mb-3 relative z-10">
            <motion.div 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-tedred/10 text-tedred mr-4 overflow-hidden"
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                backgroundColor: isHovered ? "rgba(230, 43, 30, 0.2)" : "rgba(230, 43, 30, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <motion.div
                animate={{ 
                  scale: isHovered ? [1, 1.2, 1] : 1,
                  rotate: isHovered ? [0, 5, -5, 0] : 0
                }}
                transition={{ 
                  duration: 0.8, 
                  repeat: isHovered ? Infinity : 0, 
                  repeatType: "reverse" 
                }}
              >
                {icon}
              </motion.div>
            </motion.div>
            
            <motion.h3 
              className="text-lg font-semibold relative"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              {title}
              <motion.div 
                className="absolute -bottom-1 left-0 h-0.5 bg-tedred/30 w-0"
                animate={{ width: isHovered ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.h3>
          </div>
          
          <motion.div 
            className="flex items-center text-sm text-tedgray space-x-1 relative z-10"
            animate={{ 
              opacity: isHovered ? 1 : 0.7,
              y: isHovered ? 0 : 5
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ 
                scale: isHovered ? [1, 1.2, 1] : 1,
                rotate: isHovered ? [0, 10, -10, 0] : 0
              }}
              transition={{ 
                duration: 0.8, 
                repeat: isHovered ? Infinity : 0, 
                repeatType: "reverse" 
              }}
            >
              <Info size={14} className="text-tedred/70" />
            </motion.div>
            <span>Ətraflı məlumata baxmaq üçün kartın üzərində dayanın</span>
          </motion.div>
          
          {/* Shine effect on hover */}
          <motion.div 
            className="absolute top-0 left-0 w-[120%] h-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full"
            animate={{ 
              translateX: isHovered ? ["-100%", "200%"] : "-100%"
            }}
            transition={{ 
              duration: 1.5, 
              ease: "easeInOut", 
              repeat: isHovered ? Infinity : 0, 
              repeatDelay: 2
            }}
          />
        </motion.div>
        
        {/* Back side */}
        <motion.div 
          className="absolute inset-0 rounded-xl bg-tedred p-6 shadow-md flex flex-col justify-center text-white overflow-hidden w-full h-full"
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)" 
          }}
          animate={{
            boxShadow: isHovered ? "0 10px 30px rgba(230, 43, 30, 0.5)" : "0 4px 6px rgba(230, 43, 30, 0.3)"
          }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          <motion.h3 
            className="text-lg font-semibold mb-2 relative z-10"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            {title}
          </motion.h3>
          
          <motion.p 
            className="text-sm relative z-10 font-medium text-white"
            animate={{ scale: isHovered ? 1.02 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            {content}
          </motion.p>
          
          <motion.div 
            className="absolute bottom-3 right-3"
            animate={{ 
              x: isHovered ? 5 : 0,
              scale: isHovered ? 1.2 : 1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <ChevronRight size={16} />
          </motion.div>
          
          {/* Light particles */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div 
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                top: `${10 + (i * 15)}%`,
                left: `${80 - (i * 10)}%`,
              }}
              animate={{ 
                opacity: isHovered ? [0, 0.8, 0] : 0,
                scale: isHovered ? [0, 1.5, 0] : 0,
              }}
              transition={{ 
                duration: 2, 
                delay: i * 0.2, 
                repeat: isHovered ? Infinity : 0,
                repeatDelay: 0.5
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Animated Stat Component
const AnimatedStat = ({ 
  icon, 
  value, 
  label, 
  index = 0 
}: { 
  icon: React.ReactNode; 
  value: string; 
  label: string; 
  index?: number;
}) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  return (
    <motion.div 
      ref={ref}
      className="flex items-center group"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { 
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: 0.2 * index }
      } : {}}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    >
      <motion.div 
        className="w-12 h-12 flex items-center justify-center rounded-full bg-tedred text-white mr-4 relative overflow-hidden"
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 0 15px rgba(230, 43, 30, 0.4)"
        }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-tedred/80 to-tedred"></div>
        
        {/* Animated icon with subtle movement */}
        <motion.div 
          className="relative z-10"
          animate={inView ? {
            scale: [1, 1.2, 1],
          } : {}}
          transition={{ duration: 1.5, delay: 0.3 * index, ease: "easeInOut" }}
        >
          {icon}
        </motion.div>
      </motion.div>
      <div>
        <motion.h4 
          className="font-semibold text-lg"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1, transition: { duration: 0.4, delay: 0.3 * index + 0.2 } } : {}}
        >
          {value}
        </motion.h4>
        <motion.p 
          className="text-sm text-tedgray"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1, transition: { duration: 0.4, delay: 0.3 * index + 0.3 } } : {}}
        >
          {label}
        </motion.p>
      </div>
    </motion.div>
  );
};

// Highlighted text component
const HighlightedText = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="relative inline-block group">
      <span className="relative z-10 font-semibold">{children}</span>
      <motion.span 
        className="absolute bottom-0 left-0 w-full h-2 bg-tedred/20 -z-0"
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      />
      <motion.span 
        className="absolute bottom-0 left-0 w-0 h-2 bg-tedred/30 -z-0 group-hover:w-full transition-all duration-300"
      />
    </span>
  );
};

export default function About() {
  // Animation controls for left and right sections
  const controlsLeft = useAnimation();
  const controlsRight = useAnimation();
  const [refLeft, inViewLeft] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [refRight, inViewRight] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  // Animation controls for fade in facts
  const [refFacts, inViewFacts] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  // For image parallax effect
  const imageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (imageRef.current) {
        const scrollPos = window.scrollY;
        const translateY = scrollPos * 0.05; // Adjust the parallax intensity
        imageRef.current.style.transform = `translateY(${translateY}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (inViewLeft) {
      controlsLeft.start("visible");
    }
    if (inViewRight) {
      controlsRight.start("visible");
    }
  }, [controlsLeft, controlsRight, inViewLeft, inViewRight]);

  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        staggerChildren: 0.2
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const tedFacts = [
    {
      title: "Qlobal Təsir",
      content: "TEDx tədbirləri dünya üzrə milyonlarla insana çatır və fərqli mədəniyyətlər arasında fikir mübadiləsini təşviq edir.",
      icon: <Globe className="h-5 w-5" />
    },
    {
      title: "İnnovativ Platformalar",
      content: "TEDx tədbirləri yeni texnologiyaların, təhsilin və dizayn yanaşmalarının müzakirə edildiyi innovativ platformalardır.",
      icon: <Lightbulb className="h-5 w-5" />
    },
    {
      title: "Dərin Təsir",
      content: "TEDx çıxışları insanların dünyagörüşünü dəyişmək və mühüm sosial dəyişikliklərə ilham vermək gücünə malikdir.",
      icon: <BarChart className="h-5 w-5" />
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-tedlightgray to-white relative overflow-hidden">
      {/* Animated background decorations */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-tedred/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-tedred/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold mb-4 relative inline-block"
            whileInView={{ 
              textShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 20px rgba(0,0,0,0.1)", "0px 0px 0px rgba(0,0,0,0)"]
            }}
            transition={{ duration: 2, repeat: 0 }}
            viewport={{ once: true }}
          >
            TED və <span className="text-tedred">TEDx</span> nədir?
            <motion.div 
              className="absolute -bottom-3 left-0 h-1 bg-tedred/50 rounded-full" 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            />
          </motion.h2>
          <motion.p 
            className="text-tedgray max-w-2xl mx-auto mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Dünyada yayılmağa layiq ideyaların paylaşıldığı ən populyar platformalardan biri
          </motion.p>
        </motion.div>
      
        <div className="flex flex-col lg:flex-row gap-12">
          <motion.div
            ref={refLeft}
            initial="hidden"
            animate={controlsLeft}
            variants={variants}
            className="lg:w-1/2"
          >
            <motion.div variants={childVariants}>
              <p className="text-tedgray mb-6 text-lg">
                TED (<HighlightedText>Technology, Entertainment, Design</HighlightedText>) 1984-cü ildən etibarən
                "yayılmağa dəyər ideyalar" (ideas worth spreading) fəlsəfəsi
                altında fəaliyyət göstərən qlobal konfranslar silsiləsidir.
              </p>
              <p className="text-tedgray mb-8">
                TEDx isə müstəqil təşkilatlar tərəfindən TED-in lisenziyası
                altında təşkil edilən yerli tədbirlərdir. Bu tədbirlər TED
                formatında olsa da, yerli icmalar və təşkilatçılar tərəfindən
                müstəqil şəkildə təşkil edilir.
              </p>
            </motion.div>

            <motion.div 
              variants={childVariants}
              className="bg-white p-6 rounded-xl shadow-md mb-8 border-l-4 border-tedred relative overflow-hidden hover-scale shine-effect group"
            >
              {/* Animated decoration */}
              <div className="absolute -right-10 -top-10 w-20 h-20 bg-tedred/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
              
              <h3 className="text-xl font-poppins font-semibold mb-3 relative inline-block">
                TEDx Naxçıvan Dövlət Universiteti
                <motion.div 
                  className="absolute -bottom-1 left-0 h-0.5 bg-tedred"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  viewport={{ once: true }}
                />
              </h3>
              <p className="text-tedgray">
                Bu il ilk dəfə təşkil olunan TEDx Naxçıvan Dövlət Universiteti
                tədbirinin əsas mövzusu{" "}
                <span className="font-semibold text-tedred">
                  "İnnovasiya və Yaradıcılıq vasitəsilə Regional İnkişaf"
                </span>{" "}
                olacaq. Tədbirimiz gənc istedadların, yerli sahibkarların və
                təhsil liderlərinin ideyalarını paylaşacaqları bir platform
                olacaq.
              </p>
            </motion.div>

            <motion.div 
              variants={childVariants}
              className="flex flex-col sm:flex-row justify-between gap-4"
            >
              <AnimatedStat 
                icon={<Clock className="h-5 w-5" />}
                value="18+ çıxış"
                label="inspirasiyaverici danışıqlar"
                index={0}
              />

              <AnimatedStat 
                icon={<Users className="h-5 w-5" />}
                value="300+ iştirakçı"
                label="canlı auditoriya"
                index={1}
              />

              <AnimatedStat 
                icon={<Globe className="h-5 w-5" />}
                value="2000+ izləyici"
                label="online yayım"
                index={2}
              />
            </motion.div>
            
            {/* Interactive TEDx facts */}
            <motion.div 
              className="mt-10 space-y-4"
              ref={refFacts}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                  staggerChildren: 0.2,
                  delayChildren: 0.3
                }
              }}
              viewport={{ once: true, amount: 0.3 }}
            >
              {tedFacts.map((fact, index) => (
                <FlipCard 
                  key={index}
                  title={fact.title}
                  content={fact.content}
                  icon={fact.icon}
                  index={index}
                />
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            ref={refRight}
            initial="hidden"
            animate={controlsRight}
            variants={rightVariants}
            className="lg:w-1/2"
          >
            <div className="h-full rounded-xl overflow-hidden shadow-lg relative group">
              {/* Image with parallax effect */}
              <div ref={imageRef} className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out">
                <img
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                  alt="Conference hall with audience"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Gradient overlay with parallax in opposite direction */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8"
                whileHover={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5), transparent)" }}
              >
                <div className="max-w-md">
                  <motion.h3 
                    className="text-white text-2xl font-poppins font-semibold mb-4 relative inline-block"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                  >
                    Global TEDx Facts
                    <motion.div 
                      className="absolute -bottom-2 left-0 h-0.5 bg-tedred" 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.7, delay: 1 }}
                    />
                  </motion.h3>
                  
                  <div className="flex flex-col gap-3 text-white/90">
                    <motion.div 
                      className="flex items-center group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-tedred mr-3 group-hover:scale-150 transition-transform duration-300"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      />
                      <p className="group-hover:translate-x-1 transition-transform duration-300">Dünyada hər il 3000+ TEDx tədbiri keçirilir</p>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-tedred mr-3 group-hover:scale-150 transition-transform duration-300"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
                      />
                      <p className="group-hover:translate-x-1 transition-transform duration-300">TEDx çıxışları 150+ dildə və 190+ ölkədə izlənir</p>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                    >
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-tedred mr-3 group-hover:scale-150 transition-transform duration-300"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.6 }}
                      />
                      <p className="group-hover:translate-x-1 transition-transform duration-300">
                        TEDx video materialları YouTube-da milyardlarla baxış
                        toplayır
                      </p>
                    </motion.div>
                  </div>
                  
                  {/* Call to action with animation */}
                  <motion.button
                    className="mt-6 bg-tedred/90 hover:bg-tedred text-white py-2 px-4 rounded-md flex items-center group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                  >
                    <span>Daha ətraflı məlumat</span>
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChevronRight size={16} />
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>
              
              {/* Zoom-in indicator on hover */}
              <motion.div 
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.2 }}
              >
                <ZoomIn className="h-4 w-4 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
