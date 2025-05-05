import { useEffect } from "react";
import { Lightbulb, Globe, MessagesSquare, BrainCircuit, Sparkles, Zap } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ReasonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

function Reason({ icon, title, description, index }: ReasonProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Same animation for all cards
  const variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, delay: 0.1 * index },
    },
  };

  // Different entrance animations for icons
  const iconVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 10,
        delay: 0.3 + (0.1 * index)
      } 
    }
  };

  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: 0.5 + (0.1 * index)
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 group"
      whileHover={{ 
        y: -5,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
        transition: { duration: 0.3 }
      }}
    >
      <motion.div 
        className="w-20 h-20 flex items-center justify-center rounded-full bg-tedlightgray mb-6 relative overflow-hidden"
        variants={iconVariants}
      >
        {/* Pulsing background effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-tedred/10 to-transparent rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Icon with shine effect */}
        <motion.div 
          className="relative z-10"
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        >
          {icon}
        </motion.div>
      </motion.div>
      
      <motion.div 
        variants={textVariants}
        className="w-full"
      >
        <h3 className="text-xl font-poppins font-semibold mb-3 relative inline-block">
          {title}
          <motion.div 
            className="absolute bottom-0 left-0 w-0 h-0.5 bg-tedred"
            initial={{ width: "0%" }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </h3>
        <p className="text-tedgray text-left md:text-center">{description}</p>
      </motion.div>
      
      {/* Animated decoration elements */}
      <motion.div 
        className="absolute -z-10 opacity-0 right-4 top-4 text-tedred"
        animate={{ 
          opacity: [0, 0.1, 0],
          rotate: [0, 5, 0, -5, 0],
          scale: [1, 1.1, 1, 0.9, 1] 
        }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        <Sparkles size={20} />
      </motion.div>
      
      {/* Shine effect */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        <motion.div 
          className="absolute top-0 -left-full w-[120%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[20deg]"
          animate={{ left: ["0%", "100%"] }}
          transition={{ 
            duration: 1.5, 
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 2
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function WhyTedx() {
  const reasons = [
    {
      icon: <Lightbulb className="h-8 w-8 text-tedred" />,
      title: "Fikir Mübadiləsi",
      description:
        "TEDx tədbirlərində müxtəlif sahələrdən olan insanlar öz unikal ideyalarını paylaşır və tamaşaçılara ilham verir.",
    },
    {
      icon: <Globe className="h-8 w-8 text-tedred" />,
      title: "Qlobal Şəbəkə",
      description:
        "TEDx tədbirləri dünyanın 170-dən çox ölkəsində keçirilir, bu da qlobal dialoqun bir hissəsi olmaq imkanı yaradır.",
    },
    {
      icon: <MessagesSquare className="h-8 w-8 text-tedred" />,
      title: "Fərqli Perspektivlər",
      description:
        "TEDx platforması fərqli yaş, təhsil və karyera sahiblərinə öz təcrübələrini bölüşmək imkanı yaradır.",
    },
  ];

  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      },
    },
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: { 
      width: "100px", 
      transition: { 
        duration: 0.8,
        ease: "easeOut" 
      } 
    }
  };

  return (
    <section id="why-tedx" className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-tedred/5 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-tedred/5 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={headingVariants}
          className="flex flex-col items-center mb-16"
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold text-center relative"
          >
            Nə üçün <span className="text-tedred relative">
              TEDx
              <motion.div 
                className="absolute -bottom-1 left-0 h-0.5 bg-tedred"
                variants={lineVariants}
              ></motion.div>
            </span>?
          </motion.h2>
          

          
          <motion.p 
            className="text-tedgray max-w-2xl text-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            TEDx, bir iştirakçı tərəfindən dəstəklənən kütləvi yığıncaqdır və TED Konfransı formatında cəmiyyətə təsir edən elmi, mədəni və sosial məsələlərin müzakirə olunduğu platformadır.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {reasons.map((reason, index) => (
            <Reason
              key={index}
              icon={reason.icon}
              title={reason.title}
              description={reason.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
