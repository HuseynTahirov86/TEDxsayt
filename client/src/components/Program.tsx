import { useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Clock, User, ChevronRight, Calendar, MapPin } from "lucide-react";

interface ProgramSession {
  id: string;
  name: string;
}

interface ProgramItem {
  id: number;
  time: string;
  title: string;
  description: string;
  speaker?: {
    name: string;
    title: string;
    image: string;
  };
  session: string;
}

// Timeline item component with enhanced visuals and animations
function ProgramTimelineItem({ item, index }: { item: ProgramItem; index: number }) {
  // Determine if the item is a break, lunch, etc. based on title keywords
  const isBreak = item.title.toLowerCase().includes('qeydiyyat') || 
                  item.title.toLowerCase().includes('fasilə') || 
                  item.title.toLowerCase().includes('nahar') ||
                  item.title.toLowerCase().includes('çay');
  
  // Different styling for break items
  const itemStyle = isBreak 
    ? "bg-gray-50 border border-gray-200" 
    : "bg-white shadow-md hover:shadow-lg";

  // Different styling for the timeline dot
  const dotStyle = isBreak
    ? "bg-gray-400"
    : "bg-tedred";

  // Create staggered animation for items
  const [itemRef, itemInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.div 
      ref={itemRef}
      initial={{ opacity: 0, y: 20 }}
      animate={itemInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex items-start mb-8 relative group"
    >
      {/* Time indicator */}
      <div className="flex-shrink-0 w-20 md:w-28 pt-1 text-right">
        <div className="flex items-center justify-end">
          <Clock className="w-4 h-4 mr-1 text-tedred hidden md:block" />
          <span className="text-tedred font-semibold whitespace-nowrap">{item.time}</span>
        </div>
      </div>
      
      {/* Timeline connector */}
      <div className="relative ml-4 mr-6 flex-shrink-0">
        {/* Vertical line */}
        <div className="h-full w-0.5 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 absolute left-0"></div>
        
        {/* Dot marker */}
        <motion.div 
          className={`h-4 w-4 rounded-full ${dotStyle} relative z-10 flex items-center justify-center`}
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {!isBreak && (
            <div className="h-2 w-2 rounded-full bg-white"></div>
          )}
        </motion.div>
      </div>
      
      {/* Content card */}
      <div className={cn(
        "flex-grow rounded-lg p-5 transition-all duration-300 transform",
        itemStyle,
        !isBreak && "group-hover:translate-x-1"
      )}>
        {/* Title with enhanced styling */}
        <h3 className={cn(
          "text-lg font-bold mb-2 flex items-center",
          isBreak ? "text-gray-600" : "text-tedblack"
        )}>
          {item.title}
          {!isBreak && (
            <motion.span 
              className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
            >
              <ChevronRight className="h-4 w-4 text-tedred" />
            </motion.span>
          )}
        </h3>
        
        {/* Speaker information with improved layout */}
        {item.speaker && (
          <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-md border-l-2 border-tedred">
            <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3 shadow-sm">
              <img 
                src={item.speaker.image} 
                alt={item.speaker.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-2 ring-tedred/20 rounded-full"></div>
            </div>
            <div>
              <p className="font-semibold text-sm flex items-center">
                <User className="w-3 h-3 mr-1 text-tedred opacity-70" />
                {item.speaker.name}
              </p>
              <p className="text-gray-500 text-xs mt-0.5">{item.speaker.title}</p>
            </div>
          </div>
        )}
        
        {/* Description with improved typography */}
        <p className={cn(
          "text-sm leading-relaxed",
          isBreak ? "text-gray-500" : "text-gray-600"
        )}>
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Program() {
  const [activeSession, setActiveSession] = useState("morning");
  const { data: sessions } = useQuery({
    queryKey: ["/api/program/sessions"],
    staleTime: Infinity,
  });

  const { data: programItems } = useQuery({
    queryKey: ["/api/program/items"],
    staleTime: Infinity,
  });

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
      transition: { duration: 0.6 },
    },
  };

  const filteredItems = programItems?.filter(
    (item: ProgramItem) => item.session === activeSession
  );

  return (
    <section id="program" className="py-20 bg-tedlightgray">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={headingVariants}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-poppins font-bold text-center mb-4">
            Proqram
          </h2>
          <p className="text-tedgray text-center max-w-2xl mx-auto">
            16 İyun 2025-ci ildə keçiriləcək TEDx Nakhchivan State University
            tədbirinin gündəlik cədvəli
          </p>
        </motion.div>

        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-lg overflow-hidden">
            {sessions?.map((session: ProgramSession) => (
              <button
                key={session.id}
                className={cn(
                  "px-6 py-3 font-medium transition-colors",
                  activeSession === session.id
                    ? "bg-tedred text-white"
                    : "bg-white text-tedblack hover:bg-gray-100"
                )}
                onClick={() => setActiveSession(session.id)}
              >
                {session.name}
              </button>
            ))}
          </div>
        </div>

        <div className="program-content">
          <div id={activeSession} className="timeline-connector pl-8 md:pl-0">
            {filteredItems?.map((item: ProgramItem) => (
              <ProgramTimelineItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
