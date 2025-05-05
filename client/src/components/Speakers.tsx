import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";

interface Speaker {
  id: number;
  name: string;
  title: string;
  bio: string;
  topic: string;
  image: string;
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
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

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  // Diagonal overlay color based on index (cycling through options)
  const getOverlayClass = (id: number) => {
    const options = [
      "from-tedred/70 to-transparent", // Red overlay
      "from-black/70 to-transparent",  // Black overlay
      "from-gray-400/70 to-transparent", // Gray overlay
    ];
    return options[(id - 1) % options.length];
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className="speaker-card relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      {/* Main container with diagonal design */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {/* Speaker Image */}
        <img
          src={speaker.image}
          alt={speaker.name}
          className="w-full h-full object-cover object-center"
        />
        
        {/* Diagonal Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getOverlayClass(speaker.id)}`}></div>
        
        {/* TEDx Logo */}
        <div className="absolute top-4 left-4 text-white text-sm font-bold">
          TEDx<span className="font-normal">NDU</span>
        </div>
        
        {/* Speaker Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-poppins font-bold text-tedred">
            {speaker.name}
          </h3>
          <p className="text-white text-sm mt-1 font-light leading-tight">
            {speaker.title}
          </p>
        </div>
      </div>
      
      {/* Modal/popup could be added here in the future for bio details */}
    </motion.div>
  );
}

export default function Speakers() {
  const { data: speakers, isLoading } = useQuery({
    queryKey: ["/api/speakers"],
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

  return (
    <section id="speakers" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={headingVariants}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-poppins font-bold text-center mb-4">
            Spikerlər
          </h2>
          <p className="text-tedgray text-center max-w-2xl mx-auto">
            Müxtəlif sahələrdən olan fərqli spikerlər ilhamverici ideyalarını
            bizimlə bölüşəcəklər.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-tedred"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {speakers?.map((speaker: Speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-tedgray mb-4">
            Yeni spikerlər haqqında məlumatlar tezliklə əlavə olunacaq
          </p>
          <motion.button
            onClick={() => {
              const registerSection = document.getElementById("register");
              if (registerSection) {
                registerSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="relative overflow-hidden inline-block bg-tedred text-white font-medium px-6 py-3 rounded-md shadow-md group hover:scale-105 transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0px 5px 20px rgba(239, 68, 68, 0.5)" }}
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
