import { useEffect } from "react";
import { Lightbulb, Globe, MessagesSquare } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
          Nə üçün <span className="text-tedred">TEDx</span>?
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
