import { useEffect } from "react";
import { Lightbulb, Globe, MessagesSquare } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";

interface ReasonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Reason({ icon, title, description }: ReasonProps) {
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
      className="flex flex-col items-center text-center p-6"
    >
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-tedlightgray mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-poppins font-semibold mb-3">{title}</h3>
      <p className="text-tedgray">{description}</p>
    </motion.div>
  );
}

export default function WhyTedx() {
  const { t } = useTranslation();
  
  const reasons = [
    {
      icon: <Lightbulb className="h-8 w-8 text-tedred" />,
      title: t('idea_exchange'),
      description: t('idea_exchange_desc'),
    },
    {
      icon: <Globe className="h-8 w-8 text-tedred" />,
      title: t('global_network'),
      description: t('global_network_desc'),
    },
    {
      icon: <MessagesSquare className="h-8 w-8 text-tedred" />,
      title: t('diverse_perspectives'),
      description: t('diverse_perspectives_desc'),
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
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="why-tedx" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={headingVariants}
          className="text-2xl md:text-3xl lg:text-4xl font-poppins font-bold text-center mb-12"
        >
          {t('why')} <span className="text-tedred">TEDx</span>?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {reasons.map((reason, index) => (
            <Reason
              key={index}
              icon={reason.icon}
              title={reason.title}
              description={reason.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
