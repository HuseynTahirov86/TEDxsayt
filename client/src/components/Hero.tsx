import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock, Calendar, MapPin, Sparkles, ExternalLink, MoveRight, Flame } from "lucide-react";

// Animated letter component for text effects
const AnimatedLetter = ({ letter, delay = 0 }: { letter: string; delay?: number }) => {
  return (
    <motion.span
      className="inline-block origin-bottom"
      initial={{ opacity: 0, y: 20, rotateZ: 10 }}
      animate={{ opacity: 1, y: 0, rotateZ: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        type: "spring",
        damping: 12
      }}
    >
      {letter}
    </motion.span>
  );
};

// Animated Text component that splits text into letters
const AnimatedText = ({ text, className = "", staggerDelay = 0.03 }: { 
  text: string; 
  className?: string;
  staggerDelay?: number;
}) => {
  return (
    <span className={className}>
      {text.split("").map((letter, i) => (
        <AnimatedLetter key={i} letter={letter} delay={i * staggerDelay} />
      ))}
    </span>
  );
};

// Animated number for countdown with enhanced effects
const AnimatedNumber = ({ value }: { value: number }) => {
  const prevValue = useRef(value);
  
  useEffect(() => {
    prevValue.current = value;
  }, [value]);
  
  return (
    <div className="relative h-full overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -10, opacity: 0, scale: 1.1 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 10, opacity: 0, scale: 0.9 }}
          transition={{ 
            duration: 0.35, 
            ease: [0.22, 1, 0.36, 1],
            scale: { duration: 0.2 }
          }}
          className="block"
        >
          {value.toString().padStart(2, '0')}
        </motion.span>
      </AnimatePresence>
      
      {/* Digital effect flicker */}
      <div className="absolute inset-0 w-full h-full bg-tedred/10 opacity-0 animate-digital-flicker pointer-events-none"></div>
      
      {/* Pulse glow effect on number change */}
      <motion.div 
        key={`glow-${value}`}
        className="absolute inset-0 bg-white/20 rounded-md opacity-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
};

// Enhanced Countdown Timer component
function CountdownTimer() {
  // Target date: June 16, 2025
  const targetDate = new Date('2025-06-16T10:00:00');
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };
    
    calculateTimeLeft(); // Calculate immediately on mount
    
    const timer = setInterval(calculateTimeLeft, 1000); // Update every second
    
    return () => clearInterval(timer); // Cleanup on unmount
  }, [controls]);
  
  // Enhanced time unit display component
  const TimeUnit = ({ value, label, index }: { value: number, label: string, index: number }) => {
    const variants = {
      hidden: { opacity: 0, y: 20, scale: 0.9 },
      visible: {
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: { 
          duration: 0.7,
          delay: 0.2 + (index * 0.1),
          type: "spring",
          stiffness: 200,
          damping: 20
        }
      }
    };
    
    return (
      <motion.div 
        className="flex flex-col items-center mx-1.5 md:mx-3"
        variants={variants}
      >
        <div className="bg-tedred relative text-white text-xl md:text-3xl xl:text-4xl font-bold rounded-lg px-2 md:px-4 py-3 min-w-[55px] md:min-w-[80px] xl:min-w-[100px] flex items-center justify-center shadow-lg overflow-hidden group">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Dynamic glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-tedred/80 to-tedred opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Animated border */}
          <div className="absolute inset-0 p-px pointer-events-none">
            <div className="h-full w-full rounded-lg opacity-20 group-hover:opacity-100 transition-opacity duration-300" 
              style={{ 
                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.3) 55%, rgba(255,255,255,0) 100%)' 
              }}
            ></div>
          </div>
          
          <AnimatedNumber value={value} />
        </div>
        <motion.span 
          className="text-[10px] md:text-xs mt-2 tracking-wider uppercase text-gray-300 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
        >
          {label}
        </motion.span>
      </motion.div>
    );
  };
  
  // Separator variants
  const separatorVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: 0.35 + (i * 0.25)
      }
    })
  };
  
  return (
    <motion.div 
      className="flex justify-center items-center mt-8 mb-8"
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1, 
          transition: { 
            staggerChildren: 0.1,
            delayChildren: 0.3
          }
        }
      }}
    >
      <div className="relative p-6 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 shadow-[0_0_25px_rgba(0,0,0,0.2)]">
        {/* Main background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-tedred/10 to-black/10 rounded-xl opacity-50"></div>
        
        {/* Animated pulsing glow */}
        <motion.div 
          className="absolute inset-0 rounded-xl bg-tedred/5"
          animate={{ 
            boxShadow: [
              "0 0 5px rgba(230, 43, 30, 0)",
              "0 0 15px rgba(230, 43, 30, 0.3)",
              "0 0 5px rgba(230, 43, 30, 0)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        
        <div className="flex flex-row items-center relative z-10">
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -10 },
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { delay: 0.1, duration: 0.6 } 
              }
            }}
            className="hidden md:flex items-center mr-4 bg-tedred/20 p-2 rounded-full"
          >
            <Clock className="text-tedred h-6 w-6 animate-pulse-strong" />
          </motion.div>
          
          <TimeUnit value={timeLeft.days} label="Gün" index={0} />
          
          <motion.span 
            className="text-tedred text-2xl font-bold"
            custom={0}
            variants={separatorVariants}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [0.98, 1, 0.98]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >:</motion.span>
          
          <TimeUnit value={timeLeft.hours} label="Saat" index={1} />
          
          <motion.span 
            className="text-tedred text-2xl font-bold"
            custom={1}
            variants={separatorVariants}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [0.98, 1, 0.98]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
          >:</motion.span>
          
          <TimeUnit value={timeLeft.minutes} label="Dəqiqə" index={2} />
          
          <motion.span 
            className="text-tedred text-2xl font-bold"
            custom={2}
            variants={separatorVariants}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [0.98, 1, 0.98]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >:</motion.span>
          
          <TimeUnit value={timeLeft.seconds} label="Saniyə" index={3} />
        </div>
      </div>
    </motion.div>
  );
}

// Animated background particle
const Particle = ({ 
  delay = 0, 
  duration = 15, 
  size = 3, 
  color = "white",
  blur = "sm",
  initialPosition = { top: "50%", left: "50%" },
  movement = { x: 5, y: 5 }
}: {
  delay?: number;
  duration?: number;
  size?: number;
  color?: string;
  blur?: string;
  initialPosition?: { top: string; left: string };
  movement?: { x: number; y: number };
}) => {
  const colorClass = color === "red" ? "bg-tedred/40" : "bg-white/30";
  const blurClass = `blur-${blur}`;
  
  return (
    <motion.div 
      className={`absolute h-${size} w-${size} rounded-full ${colorClass} ${blurClass}`}
      initial={{ 
        top: initialPosition.top, 
        left: initialPosition.left, 
        opacity: 0 
      }}
      animate={{ 
        top: [
          initialPosition.top, 
          `calc(${initialPosition.top} + ${movement.y}%)`, 
          initialPosition.top
        ],
        left: [
          initialPosition.left, 
          `calc(${initialPosition.left} + ${movement.x}%)`, 
          initialPosition.left
        ],
        opacity: [0, 0.8, 0]
      }}
      transition={{ 
        duration: duration, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: delay,
        times: [0, 0.5, 1]
      }}
    />
  );
};

export default function Hero() {
  // Animation controls
  const controls = useAnimation();
  
  // Hook to create parallax effect on scroll
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);
  
  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Start main animations
    controls.start("visible");
  }, [controls]);

  // Staggered content animation variants
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
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center text-white parallax bg-tedblack overflow-hidden"
    >
      {/* Background with parallax effect */}
      <motion.div 
        className="absolute inset-0 z-0" 
        style={{ y: y1 }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* Overlay gradients for depth and improved text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90 z-10"></div>
        
        {/* Dynamic red gradient accent */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-tedred/30 via-transparent to-transparent mix-blend-overlay z-10"
          animate={{ 
            opacity: [0.5, 0.7, 0.5],
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        
        {/* Background image with subtle scale animation */}
        <motion.div
          className="w-full h-full"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
            alt="University Auditorium"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </motion.div>

      {/* Enhanced animated particles effect */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
        {/* Dynamic floating particles */}
        {Array.from({ length: 12 }).map((_, i) => {
          const size = Math.floor(Math.random() * 3) + 1;
          const isRed = i % 3 === 0;
          const delay = i * 0.7;
          const duration = 15 + (i % 5);
          const top = `${10 + (i * 7)}%`;
          const left = `${5 + (i * 8)}%`;
          const moveX = -5 + (i % 5) * 3;
          const moveY = -5 + (i % 7) * 2;
          
          return (
            <Particle 
              key={i}
              delay={delay}
              duration={duration}
              size={size}
              color={isRed ? "red" : "white"}
              blur={size === 1 ? "sm" : "md"}
              initialPosition={{ top, left }}
              movement={{ x: moveX, y: moveY }}
            />
          );
        })}
      </div>
      
      {/* Dynamic light glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-tedred/10 rounded-full filter blur-[80px]"
          animate={{ 
            opacity: [0.2, 0.3, 0.2],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content container with inverse parallax movement */}
      <motion.div 
        className="container mx-auto px-4 relative z-10 text-center"
        style={{ y: y2, opacity, scale }}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Main Content */}
        <motion.div
          className="flex flex-col items-center mb-8"
          variants={itemVariants}
        >
          <h1 className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-5 relative">
            <div className="relative">
              <motion.div
                className="absolute -inset-1 rounded-lg bg-gradient-to-r from-tedred/20 to-transparent blur-xl opacity-80"
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              
              <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 relative inline-block"
                animate={{
                  textShadow: [
                    "0 0 5px rgba(255,255,255,0.3)", 
                    "0 0 15px rgba(255,255,255,0.5)", 
                    "0 0 5px rgba(255,255,255,0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <AnimatedText text="TEDx" staggerDelay={0.05} />
              </motion.span>
              
              <motion.span 
                className="font-normal text-xl md:text-2xl lg:text-3xl block mt-2 relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <AnimatedText 
                  text="Naxçıvan Dövlət Universiteti" 
                  className="font-light tracking-wide" 
                  staggerDelay={0.03} 
                />
              </motion.span>
              
              {/* Animated accent line */}
              <motion.div 
                className="h-1 bg-tedred/80 w-0 mx-auto mt-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "60%" }}
                transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
              />
            </div>
          </h1>
          
          <motion.div 
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm mb-6 relative overflow-hidden group"
            variants={itemVariants}
            whileHover={{ 
              boxShadow: "0 0 20px rgba(255,255,255,0.2)",
              backgroundColor: "rgba(255,255,255,0.15)",
              scale: 1.02
            }}
          >
            {/* Subtle animated light effect */}
            <div className="absolute -inset-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100">
              <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-r from-transparent to-white/20 skew-x-[30deg] translate-x-40 transition-transform duration-1000 group-hover:translate-x-[-10rem]"></div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-base md:text-lg relative z-10">
              <motion.div 
                className="flex items-center"
                variants={itemVariants}
              >
                <Calendar className="w-5 h-5 mr-2 text-tedred" />
                <span className="font-medium">16 İyun, 2025</span>
              </motion.div>
              
              <motion.div 
                className="hidden md:block w-2 h-2 rounded-full bg-tedred"
                variants={itemVariants}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              ></motion.div>
              
              <motion.div 
                className="flex items-center"
                variants={itemVariants}
              >
                <MapPin className="w-5 h-5 mr-2 text-tedred" />
                <span className="font-medium">Naxçıvan Dövlət Universiteti</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* TEDx Tagline */}
        <motion.div
          className="mb-6 relative"
          variants={itemVariants}
        >
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-tedred/30 to-transparent blur-xl opacity-30"></div>
          <motion.div 
            className="relative z-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.p
              className="text-2xl md:text-3xl font-light max-w-2xl mx-auto"
              animate={{ 
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.01, 1],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="relative inline-block">
                <Sparkles className="text-tedred/80 absolute -top-6 -left-6 h-5 w-5 opacity-70" />
                İdeyalar yayılmağa layiqdir
                <Sparkles className="text-tedred/80 absolute -bottom-6 -right-6 h-5 w-5 opacity-70" />
              </span>
            </motion.p>
            
            {/* Hidden accent details that appear on animation */}
            <motion.div
              className="flex justify-center mt-3 opacity-0"
              animate={{ opacity: [0, 0.7, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <span className="text-xs text-tedred/70 tracking-widest">INNOVATION • CREATIVITY • IMPACT</span>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Countdown Timer */}
        <motion.div variants={itemVariants}>
          <CountdownTimer />
        </motion.div>

        {/* Registration Button */}
        <motion.div
          variants={itemVariants}
          className="mt-6"
        >
          <motion.button
            onClick={() => {
              const registerSection = document.getElementById("register");
              if (registerSection) {
                registerSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="group relative overflow-hidden bg-tedred text-white px-8 py-4 rounded-lg font-medium text-lg shadow-[0_5px_25px_rgba(239,68,68,0.3)] flex items-center"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0px 5px 25px rgba(239, 68, 68, 0.5)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Button shine effect */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="w-[120%] h-[220%] absolute -top-[60%] -left-[10%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-[25deg] transform -translate-x-[120%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
            </div>
            
            {/* Button accent light */}
            <motion.div 
              className="absolute inset-0 rounded-lg opacity-0 bg-gradient-to-r from-tedred/80 to-tedred/90"
              animate={{
                boxShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 10px rgba(255,255,255,0.3)", "0 0 0px rgba(255,255,255,0)"]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <span className="mr-2 relative z-10">İndi qeydiyyatdan keçin</span>
            
            <motion.div
              className="relative z-10"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <MoveRight className="h-5 w-5" />
            </motion.div>
          </motion.button>
        </motion.div>
        
        {/* Small "hot" indicator for registration */}
        <motion.div
          className="mt-3 flex items-center justify-center gap-1 opacity-70"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <Flame className="h-3 w-3 text-tedred" />
          <span className="text-xs">Yerlər məhduddur, tez qeydiyyatdan keç</span>
        </motion.div>
      </motion.div>

      {/* Scroll down indicator */}
      <motion.div
        className="absolute bottom-8 w-full text-center z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.button
          onClick={scrollToAbout}
          className="inline-flex flex-col items-center text-white group"
          aria-label="Scroll down"
          whileHover={{ scale: 1.1 }}
        >
          <motion.span 
            className="text-xs font-medium tracking-wider uppercase mb-1 opacity-70 group-hover:opacity-100 transition-opacity"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Kəşf et
          </motion.span>
          
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <motion.div 
              className="absolute -inset-1 rounded-full blur-sm bg-tedred/30 opacity-50 group-hover:opacity-100 transition-opacity"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>
            
            <ChevronDown className="h-8 w-8 relative z-10" />
          </motion.div>
        </motion.button>
      </motion.div>
    </section>
  );
}
