import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

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

function ProgramTimelineItem({ item }: { item: ProgramItem }) {
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
      className="mb-12 md:max-w-4xl md:mx-auto"
    >
      <div className="flex items-start">
        <div className="relative">
          <div className="absolute md:static top-0 left-0 transform -translate-x-8 md:transform-none">
            <div className="w-7 h-7 bg-tedred rounded-full flex items-center justify-center shadow-red">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="hidden md:block text-center mb-2 font-semibold">
            {item.time}
          </div>
        </div>
        <div className="flex-1 md:ml-8 bg-white rounded-lg shadow-sm p-6">
          <div className="md:hidden text-tedred font-semibold mb-2">
            {item.time}
          </div>
          <h3 className="text-xl font-poppins font-semibold mb-2">
            {item.title}
          </h3>
          <p className="text-tedgray mb-3">{item.description}</p>
          {item.speaker && (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                <img
                  src={item.speaker.image}
                  alt={item.speaker.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-sm">{item.speaker.name}</h4>
                <p className="text-xs text-tedgray">{item.speaker.title}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Program() {
  const { t } = useTranslation();
  const [activeSession, setActiveSession] = useState("morning");
  const { data: sessions = [] } = useQuery<ProgramSession[]>({
    queryKey: ["/api/program/sessions"],
    staleTime: Infinity,
  });

  const { data: programItems = [] } = useQuery<ProgramItem[]>({
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

  const filteredItems = Array.isArray(programItems) ? programItems.filter(
    (item: ProgramItem) => item.session === activeSession
  ) : [];

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
            {t('program_title')}
          </h2>
          <p className="text-tedgray text-center max-w-2xl mx-auto">
            {t('program_subtitle')}
          </p>
        </motion.div>

        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-lg overflow-hidden">
            {Array.isArray(sessions) && sessions.map((session: ProgramSession) => (
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
            {Array.isArray(filteredItems) && filteredItems.map((item: ProgramItem) => (
              <ProgramTimelineItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
