import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

// Countdown Timer component
function CountdownTimer() {
  const { t } = useTranslation();
  // Target date: October 15, 2025
  const targetDate = new Date('2025-10-15T10:00:00');
  
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
  
  // Simple time unit display component without animation
  const TimeUnit = ({ value, label }: { value: number, label: string }) => {    
    return (
      <div className="flex flex-col items-center mx-1 md:mx-2">
        <div className="bg-tedred text-white text-xl md:text-3xl font-bold rounded-lg px-2 md:px-4 py-2 min-w-[50px] md:min-w-[80px] flex items-center justify-center">
          <span>{value.toString().padStart(2, '0')}</span>
        </div>
        <span className="text-[10px] md:text-xs mt-1 uppercase text-gray-300">{label}</span>
      </div>
    );
  };
  
  return (
    <div className="flex justify-center items-center mt-8 mb-8">
      <div className="flex flex-row items-center">
        <Clock className="text-tedred mr-3 h-6 w-6 hidden md:block" />
        <TimeUnit value={timeLeft.days} label={t('days')} />
        <span className="text-tedred text-2xl font-bold">:</span>
        <TimeUnit value={timeLeft.hours} label={t('hours')} />
        <span className="text-tedred text-2xl font-bold">:</span>
        <TimeUnit value={timeLeft.minutes} label={t('minutes')} />
        <span className="text-tedred text-2xl font-bold">:</span>
        <TimeUnit value={timeLeft.seconds} label={t('seconds')} />
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useTranslation();
  
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
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
          alt="University Auditorium"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >

          <h1 className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-4">
            TEDx<span className="font-normal">Nakhchivan State University</span>
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-lg md:text-xl">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-tedred"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <span>{t('hero_date')}</span>
            </div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-tedred"></div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-tedred"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <span>{t('hero_location')}</span>
            </div>
          </div>
        </motion.div>

        <motion.p
          className="text-2xl font-light mb-6 max-w-2xl mx-auto"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {t('hero_subtitle')}
        </motion.p>
        
        {/* Countdown Timer */}
        <CountdownTimer />

        <motion.button
          onClick={() => {
            const registerSection = document.getElementById("register");
            if (registerSection) {
              registerSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="inline-block bg-tedred hover:bg-red-700 text-white font-medium px-8 py-3 rounded-md transition-all transform hover:scale-105 text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t('hero_register_button')}
        </motion.button>
      </div>

      <motion.div
        className="absolute bottom-8 w-full text-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button
          onClick={scrollToAbout}
          className="inline-block text-white"
          aria-label="Scroll down"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="h-8 w-8" />
          </motion.div>
        </button>
      </motion.div>
    </section>
  );
}
