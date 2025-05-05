import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

interface Speaker {
  id: number;
  name: string;
  title: string;
  bio: string;
  topic: string;
  image: string;
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  const { t } = useTranslation();
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

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className="speaker-card group relative rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg"
    >
      <div className="aspect-w-3 aspect-h-4 relative">
        <img
          src={speaker.image}
          alt={speaker.name}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 transition-opacity opacity-100 group-hover:bg-black/40"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:-translate-y-1/2 group-hover:opacity-0">
        <h3 className="text-white text-xl font-poppins font-semibold">
          {speaker.name}
        </h3>
        <p className="text-gray-200">{speaker.title}</p>
      </div>

      <div className="absolute inset-0 bg-tedred/90 p-6 flex flex-col justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="text-white text-xl font-poppins font-semibold mb-2">
          {speaker.name}
        </h3>
        <p className="text-gray-200 mb-2">{speaker.title}</p>
        <div className="w-12 h-0.5 bg-white mb-4"></div>
        <p className="text-white text-sm mb-4">{speaker.bio}</p>
        <h4 className="text-white font-semibold mb-1">{t('speech_topic')}:</h4>
        <p className="text-white italic">"{speaker.topic}"</p>
      </div>
    </motion.div>
  );
}

export default function Speakers() {
  const { t } = useTranslation();
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const registerSection = document.getElementById("register");
              if (registerSection) {
                registerSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="inline-block bg-tedred hover:bg-red-700 text-white font-medium px-6 py-3 rounded-md transition-colors"
          >
            İndi qeydiyyatdan keç
          </motion.button>
        </div>
      </div>
    </section>
  );
}
