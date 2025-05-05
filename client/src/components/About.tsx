import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Clock, Users, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  const controlsLeft = useAnimation();
  const controlsRight = useAnimation();
  const [refLeft, inViewLeft] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });
  const [refRight, inViewRight] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inViewLeft) {
      controlsLeft.start("visible");
    }
    if (inViewRight) {
      controlsRight.start("visible");
    }
  }, [controlsLeft, controlsRight, inViewLeft, inViewRight]);

  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section id="about" className="py-20 bg-tedlightgray">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          <motion.div
            ref={refLeft}
            initial="hidden"
            animate={controlsLeft}
            variants={variants}
            className="lg:w-1/2"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-poppins font-bold mb-6">
              TED və TEDx nədir?
            </h2>
            <p className="text-tedgray mb-6">
              TED (Technology, Entertainment, Design) 1984-cü ildən etibarən
              "yayılmağa dəyər ideyalar" (ideas worth spreading) fəlsəfəsi
              altında fəaliyyət göstərən qlobal konfranslar silsiləsidir.
            </p>
            <p className="text-tedgray mb-6">
              TEDx isə müstəqil təşkilatlar tərəfindən TED-in lisenziyası
              altında təşkil edilən yerli tədbirlərdir. Bu tədbirlər TED
              formatında olsa da, yerli icmalar və təşkilatçılar tərəfindən
              müstəqil şəkildə təşkil edilir.
            </p>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-xl font-poppins font-semibold mb-3">
                TEDx Nakhchivan State University
              </h3>
              <p className="text-tedgray">
                Bu il ilk dəfə təşkil olunan TEDx Nakhchivan State University
                tədbirinin əsas mövzusu{" "}
                <span className="font-semibold">
                  "İnnovasiya və Yaradıcılıq vasitəsilə Regional İnkişaf"
                </span>{" "}
                olacaq. Tədbirimiz gənc istedadların, yerli sahibkarların və
                təhsil liderlərinin ideyalarını paylaşacaqları bir platform
                olacaq.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-tedred text-white mr-4">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">18-dən çox</h4>
                  <p className="text-sm text-tedgray">çıxış</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-tedred text-white mr-4">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">300+ iştirakçı</h4>
                  <p className="text-sm text-tedgray">iştirakçılar</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-tedred text-white mr-4">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">2000+</h4>
                  <p className="text-sm text-tedgray">online izləyici</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            ref={refRight}
            initial="hidden"
            animate={controlsRight}
            variants={rightVariants}
            className="lg:w-1/2"
          >
            <div className="relative h-full rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
                alt="Conference hall with audience"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                <div className="max-w-md">
                  <h3 className="text-white text-2xl font-poppins font-semibold mb-2">
                    Global TEDx Facts
                  </h3>
                  <div className="flex flex-col gap-2 text-white">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-tedred mr-2"></div>
                      <p>Dünyada hər il 3000+ TEDx tədbiri keçirilir</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-tedred mr-2"></div>
                      <p>TEDx çıxışları 150+ dildə və 190+ ölkədə izlənir</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-tedred mr-2"></div>
                      <p>
                        TEDx video materialları YouTube-da milyardlarla baxış
                        toplayır
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
