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

  // Different animation for each card
  const getVariants = (index: number) => {
    const variants = [
      {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.7, delay: 0.1 * index },
        },
      },
      {
        hidden: { opacity: 0, x: -50, rotateY: 45 },
        visible: {
          opacity: 1,
          x: 0,
          rotateY: 0,
          transition: { duration: 0.7, delay: 0.1 * index },
        },
      },
      {
        hidden: { opacity: 0, x: 50, rotateY: -45 },
        visible: {
          opacity: 1,
          x: 0,
          rotateY: 0,
          transition: { duration: 0.7, delay: 0.1 * index },
        },
      },
    ];
    return variants[index % 3];
  };

  const variants = getVariants(index);

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
      className="flex flex-col items-center text-center p-6 rounded-lg hover-float shine-effect bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
      whileHover={{ 
        y: -5,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
        transition: { duration: 0.3 }
      }}
    >
      <motion.div 
        className="w-20 h-20 flex items-center justify-center rounded-full bg-tedlightgray mb-6 relative overflow-hidden group"
        variants={iconVariants}
      >
        {/* Pulsing background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-tedred/10 to-transparent rounded-full transform scale-0 group-hover:scale-150 transition-transform duration-700"></div>
        
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
      
      <motion.div variants={textVariants}>
        <h3 className="text-xl font-poppins font-semibold mb-3 relative">
          {title}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-tedred transition-all duration-300 group-hover:w-full"></div>
        </h3>
        <p className="text-tedgray">{description}</p>
      </motion.div>
      
      {/* Animated decoration elements */}
      <div className="absolute -z-10 opacity-10 right-4 top-4">
        <motion.div 
          animate={{ 
            rotate: [0, 5, 0, -5, 0],
            scale: [1, 1.1, 1, 0.9, 1] 
          }}
          transition={{ duration: 7, repeat: Infinity }}
          className="text-tedred"
        >
          <Sparkles size={20} />
        </motion.div>
      </div>
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
          
          <motion.div 
            className="w-20 h-1 bg-tedred rounded-full mt-6"
            initial={{ opacity: 0, width: 0 }}
            animate={inView ? { opacity: 1, width: 80 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          ></motion.div>
          
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
