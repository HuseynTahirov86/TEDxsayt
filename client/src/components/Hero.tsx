import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock, Calendar, MapPin } from "lucide-react";

// Animated number for countdown with enhanced effects
const AnimatedNumber = ({ value }: { value: number }) => {
  const prevValue = useRef(value);
  
  useEffect(() => {
    prevValue.current = value;
  }, [value]);
  
  return (
    <div className="relative h-full overflow-hidden">
      <AnimatePresence initial={false}>
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

  useEffect(() => {
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
  }, []);
  
  // Enhanced time unit display component
  const TimeUnit = ({ value, label }: { value: number, label: string }) => {    
    return (
      <div className="flex flex-col items-center mx-1.5 md:mx-3">
        <div className="bg-tedred relative text-white text-xl md:text-3xl xl:text-4xl font-bold rounded-lg px-2 md:px-4 py-3 min-w-[55px] md:min-w-[80px] xl:min-w-[100px] flex items-center justify-center shadow-lg overflow-hidden group">
          {/* Subtle animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <AnimatedNumber value={value} />
        </div>
        <span className="text-[10px] md:text-xs mt-2 tracking-wider uppercase text-gray-300 font-medium">{label}</span>
      </div>
    );
  };
  
  return (
    <motion.div 
      className="flex justify-center items-center mt-8 mb-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="relative p-6 rounded-xl bg-black/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-tedred/10 to-black/10 rounded-xl opacity-50"></div>
        <div className="flex flex-row items-center relative z-10">
          <Clock className="text-tedred mr-3 h-6 w-6 hidden md:block animate-pulse-strong" />
          <TimeUnit value={timeLeft.days} label="Gün" />
          <span className="text-tedred text-2xl font-bold animate-fade-in-out">:</span>
          <TimeUnit value={timeLeft.hours} label="Saat" />
          <span className="text-tedred text-2xl font-bold animate-fade-in-out">:</span>
          <TimeUnit value={timeLeft.minutes} label="Dəqiqə" />
          <span className="text-tedred text-2xl font-bold animate-fade-in-out">:</span>
          <TimeUnit value={timeLeft.seconds} label="Saniyə" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  // Hook to create parallax effect on scroll
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  
  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
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
      >
        {/* Overlay gradients for depth and improved text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90 z-10"></div>
        
        {/* Subtle red gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-tr from-tedred/30 via-transparent to-transparent mix-blend-overlay z-10 opacity-60"></div>
        
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
          alt="University Auditorium"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Enhanced animated particles effect (more dynamic) */}
      <div className="absolute inset-0 z-5 opacity-30 pointer-events-none overflow-hidden">
        {/* Static particles */}
        <div className="absolute h-2 w-2 rounded-full bg-white top-1/4 left-1/4 animate-pulse-strong"></div>
        <div className="absolute h-1 w-1 rounded-full bg-white top-1/3 left-1/2 animate-ping" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
        <div className="absolute h-1.5 w-1.5 rounded-full bg-tedred top-2/3 left-1/3 animate-ping" style={{ animationDelay: '0.5s', animationDuration: '4s' }}></div>
        <div className="absolute h-2 w-2 rounded-full bg-white top-1/2 right-1/4 animate-pulse-strong" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute h-1 w-1 rounded-full bg-tedred top-1/4 right-1/3 animate-ping" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
        
        {/* Floating particles */}
        <motion.div 
          className="absolute h-3 w-3 rounded-full bg-tedred/40 blur-sm"
          initial={{ top: "20%", left: "30%" }}
          animate={{ top: ["20%", "25%", "20%"], left: ["30%", "32%", "30%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute h-2 w-2 rounded-full bg-white/30 blur-sm"
          initial={{ top: "50%", left: "70%" }}
          animate={{ top: ["50%", "53%", "50%"], left: ["70%", "68%", "70%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute h-4 w-4 rounded-full bg-tedred/20 blur-sm"
          initial={{ top: "80%", left: "20%" }}
          animate={{ top: ["80%", "78%", "80%"], left: ["20%", "22%", "20%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Shooting star effect - occasional */}
        <motion.div 
          className="absolute h-px w-20 bg-white rotate-[30deg] opacity-0 blur-[1px]"
          initial={{ top: "10%", left: "0%", opacity: 0 }}
          animate={{ 
            left: ["0%", "100%"],
            top: ["10%", "30%"],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 15,
            ease: "easeOut",
            times: [0, 0.5, 1]
          }}
        />
        
        <motion.div 
          className="absolute h-px w-16 bg-white rotate-[20deg] opacity-0 blur-[1px]"
          initial={{ top: "40%", left: "0%", opacity: 0 }}
          animate={{ 
            left: ["0%", "100%"],
            top: ["40%", "60%"],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            repeatDelay: 20,
            ease: "easeOut",
            times: [0, 0.5, 1],
            delay: 5
          }}
        />
      </div>

      {/* Content container with inverse parallax movement */}
      <motion.div 
        className="container mx-auto px-4 relative z-10 text-center"
        style={{ y: y2, opacity }}
      >

        
        {/* Main Content */}
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h1 className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-5">
            <motion.span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 relative inline-block"
              animate={{
                textShadow: ["0 0 5px rgba(255,255,255,0.1)", "0 0 10px rgba(255,255,255,0.3)", "0 0 5px rgba(255,255,255,0.1)"]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="absolute -inset-1 bg-gradient-to-r from-tedred/30 to-white/10 filter blur-xl opacity-20 animate-pulse-strong"></span>
              TEDx
            </motion.span>
            <motion.span 
              className="font-normal text-base md:text-2xl lg:text-3xl block md:mt-2 relative inline-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Naxçıvan Dövlət Universiteti
            </motion.span>
          </h1>
          
          <motion.div 
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm mb-6 relative overflow-hidden group"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ 
              boxShadow: "0 0 20px rgba(255,255,255,0.2)",
              backgroundColor: "rgba(255,255,255,0.15)"
            }}
          >
            {/* Subtle animated light effect on hover */}
            <div className="absolute -inset-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100">
              <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-r from-transparent to-white/20 skew-x-[30deg] translate-x-40 transition-transform duration-1000 group-hover:translate-x-[-10rem]"></div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-base md:text-lg relative z-10">
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <Calendar className="w-5 h-5 mr-2 text-tedred animate-pulse-strong" />
                <span className="font-medium">16 İyun, 2025</span>
              </motion.div>
              
              <motion.div 
                className="hidden md:block w-2 h-2 rounded-full bg-tedred"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              ></motion.div>
              
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <MapPin className="w-5 h-5 mr-2 text-tedred animate-pulse-strong" />
                <span className="font-medium">Naxçıvan Dövlət Universiteti</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* TEDx Tagline - enhanced animation */}
        <motion.div
          className="mb-6 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-tedred/30 to-transparent blur-xl opacity-30"></div>
          <motion.p
            className="text-2xl md:text-3xl font-light max-w-2xl mx-auto relative z-10"
            animate={{ 
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.01, 1],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            İdeyalar yayılmağa layiqdir
          </motion.p>
        </motion.div>
        
        {/* Countdown Timer */}
        <CountdownTimer />

        {/* Registration Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            onClick={() => {
              const registerSection = document.getElementById("register");
              if (registerSection) {
                registerSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="relative inline-flex items-center px-8 py-4 overflow-hidden text-lg font-medium text-white bg-tedred rounded-md shadow-lg group hover:scale-105 transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0px 5px 20px rgba(239, 68, 68, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-white opacity-10 rotate-45 group-hover:-translate-x-20 group-hover:-translate-y-20 ease-out"></span>
            <span className="relative">İndi qeydiyyatdan keçin</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll down indicator */}
      <motion.div
        className="absolute bottom-8 w-full text-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.button
          onClick={scrollToAbout}
          className="inline-flex flex-col items-center text-white group"
          aria-label="Scroll down"
          whileHover={{ scale: 1.1 }}
        >
          <span className="text-xs font-medium tracking-wider uppercase mb-1 opacity-70 group-hover:opacity-100 transition-opacity">Kəşf et</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute -inset-1 rounded-full blur-sm bg-tedred/30 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <ChevronDown className="h-8 w-8 relative z-10" />
          </motion.div>
        </motion.button>
      </motion.div>
    </section>
  );
}
