import { useEffect, useState, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import { X, Mic, ExternalLink, MessageSquare, ArrowRight } from "lucide-react";

interface Speaker {
  id: number;
  name: string;
  title: string;
  bio: string;
  topic: string;
  image: string;
}

// Speaker Detail Modal component
function SpeakerDetailModal({ 
  speaker, 
  isOpen, 
  onClose 
}: { 
  speaker: Speaker; 
  isOpen: boolean;
  onClose: () => void;
}) {
  // Trap focus in modal when open
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle ESC key press
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto'; // Restore body scroll
    };
  }, [isOpen, onClose]);

  // Animation variants
  const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { delay: 0.2, duration: 0.3 } 
    }
  };
  
  const modalVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      opacity: 0,
      y: 30,
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backgroundVariants}
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div 
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl relative z-10 w-full max-w-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
            
            <div className="flex flex-col md:flex-row">
              {/* Speaker image - desktop */}
              <div className="hidden md:block w-1/3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-tedred/30 to-transparent mix-blend-overlay"></div>
                <img 
                  src={speaker.image} 
                  alt={speaker.name}
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Speaker image - mobile */}
              <div className="block md:hidden w-full h-56 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
                <img 
                  src={speaker.image} 
                  alt={speaker.name}
                  className="w-full h-full object-cover object-center" 
                />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{speaker.name}</h3>
                  <p className="text-sm opacity-90">{speaker.title}</p>
                </div>
              </div>
              
              {/* Content */}
              <div className="w-full md:w-2/3 p-6 flex flex-col">
                {/* Only show on desktop */}
                <div className="hidden md:block mb-4">
                  <h3 className="text-2xl font-bold text-tedblack">{speaker.name}</h3>
                  <p className="text-tedgray font-medium">{speaker.title}</p>
                </div>
                
                <div className="mb-4 bg-gray-50 p-3 rounded border-l-4 border-tedred">
                  <div className="flex items-center text-sm mb-2">
                    <Mic className="w-4 h-4 text-tedred mr-2" />
                    <span className="font-medium">Danışıq Mövzusu:</span>
                  </div>
                  <p className="text-tedblack font-medium ml-6">"{speaker.topic}"</p>
                </div>
                
                <div className="prose prose-sm max-w-none flex-grow mb-4">
                  <h4 className="text-lg font-semibold mb-2">Bio</h4>
                  <p className="text-tedgray">
                    {speaker.bio}
                  </p>
                </div>
                
                {/* Action buttons */}
                <div className="flex justify-between mt-auto space-x-2">
                  <motion.button
                    className="flex-1 py-2 px-4 text-tedred bg-white border border-tedred/30 rounded-md flex items-center justify-center hover:bg-tedred/5 transition-colors text-sm"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    <span>Connect</span>
                  </motion.button>
                  
                  <motion.button 
                    onClick={onClose}
                    className="flex-1 py-2 px-4 text-white bg-tedred rounded-md flex items-center justify-center hover:bg-tedred/90 transition-colors text-sm"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span>More info</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SpeakerCard({ speaker, index, onOpenDetails }: { 
  speaker: Speaker;
  index: number;
  onOpenDetails: (speaker: Speaker) => void;
}) {
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

  // Different animation delays based on card position
  const getDelay = () => {
    return (index % 4) * 0.15; // Stagger effect for cards
  };

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: getDelay(),
        ease: [0.215, 0.61, 0.355, 1.0] // Cubic bezier for nice easing
      },
    },
  };

  // Diagonal overlay color based on index (cycling through options)
  const getOverlayClass = (id: number) => {
    const options = [
      "from-tedred/80 to-transparent", // Red overlay
      "from-black/70 to-transparent",  // Black overlay
      "from-gray-700/70 to-transparent", // Dark gray overlay
    ];
    return options[(id - 1) % options.length];
  };

  // Content animation on hover
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className="speaker-card relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer group"
      onClick={() => onOpenDetails(speaker)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
    >
      {/* Main container with diagonal design */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {/* Speaker Image */}
        <motion.div
          animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1.0] }}
          className="h-full w-full"
        >
          <img
            src={speaker.image}
            alt={speaker.name}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
        
        {/* Diagonal Overlay with animation */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${getOverlayClass(speaker.id)}`}
          animate={isHovered ? 
            { backgroundImage: `linear-gradient(to bottom right, rgba(239, 68, 68, 0.85), rgba(0, 0, 0, 0))` } : 
            { backgroundImage: `linear-gradient(to bottom right, rgba(239, 68, 68, 0.7), rgba(0, 0, 0, 0))` }
          }
          transition={{ duration: 0.5 }}
        ></motion.div>
        
        {/* TEDx Logo with animation */}
        <motion.div 
          className="absolute top-4 left-4 text-white text-sm font-bold tracking-wide flex items-center space-x-1"
          animate={isHovered ? { scale: 1.05, x: 2 } : { scale: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-tedred">TEDx</span>
          <span className="font-light text-white">NDU</span>
        </motion.div>
        
        {/* Speaker Info with animations */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <motion.h3 
            className="text-xl font-poppins font-bold"
            animate={isHovered ? { y: -5 } : { y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {speaker.name}
          </motion.h3>
          
          <motion.p 
            className="text-white/90 text-sm mt-1 font-light"
            animate={isHovered ? { y: -5, opacity: 0.9 } : { y: 0, opacity: 0.7 }}
            transition={{ duration: 0.3 }}
          >
            {speaker.title}
          </motion.p>
          
          {/* Topic preview that shows on hover */}
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={isHovered ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mt-3 pt-2 border-t border-white/20">
              <p className="text-xs text-white/80 mb-1">Mövzu:</p>
              <p className="text-sm font-medium">{speaker.topic}</p>
            </div>
          </motion.div>
        </div>
        
        {/* View details button - only visible on hover */}
        <motion.div 
          className="absolute right-4 bottom-4 bg-white/20 backdrop-blur-sm rounded-full p-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowRight className="h-4 w-4 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Speakers() {
  const { data: speakers, isLoading } = useQuery({
    queryKey: ["/api/speakers"],
    staleTime: Infinity,
  });
  
  // For showing speaker details
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleOpenSpeakerDetails = (speaker: Speaker) => {
    setSelectedSpeaker(speaker);
    setIsModalOpen(true);
  };

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
      width: "80px", 
      transition: { 
        duration: 0.6,
        ease: "easeOut" 
      } 
    }
  };

  return (
    <section id="speakers" className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-0 w-40 h-40 bg-tedred/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-60 h-60 bg-tedred/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={headingVariants}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-poppins font-bold relative inline-block"
          >
            <span className="relative">
              Spikerlər
              <motion.div 
                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 h-1 bg-tedred/80 rounded-full" 
                variants={lineVariants}
              ></motion.div>
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-tedgray text-center max-w-2xl mx-auto mt-8"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6, delay: 0.2 } 
              }
            }}
          >
            Müxtəlif sahələrdən olan fərqli spikerlər ilhamverici ideyalarını
            bizimlə bölüşəcəklər.
          </motion.p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-tedred/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-tedred rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {speakers?.map((speaker: Speaker, index: number) => (
              <SpeakerCard 
                key={speaker.id} 
                speaker={speaker} 
                index={index}
                onOpenDetails={handleOpenSpeakerDetails}
              />
            ))}
          </div>
        )}
        
        {/* Speaker details modal */}
        {selectedSpeaker && (
          <SpeakerDetailModal 
            speaker={selectedSpeaker}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        <div className="text-center mt-16">
          <motion.p 
            className="text-tedgray mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Yeni spikerlər haqqında məlumatlar tezliklə əlavə olunacaq
          </motion.p>
          
          <motion.button
            onClick={() => {
              const registerSection = document.getElementById("register");
              if (registerSection) {
                registerSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="relative overflow-hidden inline-block bg-tedred text-white font-medium px-6 py-3 rounded-md shadow-md group hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0px 5px 20px rgba(239, 68, 68, 0.5)" 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-white opacity-10 rotate-45 group-hover:-translate-x-20 group-hover:-translate-y-20 ease-out"></span>
            <span className="relative z-10">İndi qeydiyyatdan keç</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
