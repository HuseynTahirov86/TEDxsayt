import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPin, Mail, Phone, Instagram, Linkedin, Facebook, Youtube, Check } from "lucide-react";
import { useContact } from "@/hooks/use-contact";

export default function Contact() {
  const { contactForm, isSubmitting, isSuccess, handleContact, resetForm } = useContact();

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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-poppins font-bold text-center mb-4">
          Əlaqə
        </h2>
        <p className="text-tedgray text-center max-w-2xl mx-auto mb-12">
          Suallarınız və əlavə məlumat üçün bizimlə əlaqə saxlaya bilərsiniz.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            ref={refLeft}
            initial="hidden"
            animate={controlsLeft}
            variants={variants}
          >
            <h3 className="text-xl font-poppins font-semibold mb-6">
              Əlaqə Məlumatları
            </h3>

            <div className="space-y-6">
              <div className="flex">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-tedlightgray text-tedred mr-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Ünvan</h4>
                  <p className="text-tedgray">
                    Naxçıvan Dövlət Universitetinin Konservatoriyası, AZ7000
                    Naxçıvan, Azərbaycan
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-tedlightgray text-tedred mr-4">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">E-poçt</h4>
                  <a
                    href="mailto:huseyntahirov@ndu.edu.az"
                    className="text-tedred hover:text-red-700 transition-colors"
                  >
                    huseyntahirov@ndu.edu.az
                  </a>
                </div>
              </div>

              <div className="flex">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-tedlightgray text-tedred mr-4">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Telefon</h4>
                  <a
                    href="tel:+994605285505"
                    className="text-tedgray hover:text-tedblack transition-colors"
                  >
                    +994 60 528 55 05
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Bizi izləyin</h4>
                <div className="flex space-x-4">
                  <motion.a
                    href="https://www.instagram.com/tedxnakhchivanstateuniversity?igsh=Mzd1bXY1eWtwazA4&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-tedlightgray text-tedblack hover:bg-tedred hover:text-white transition-colors"
                    aria-label="Instagram"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Instagram className="h-5 w-5" />
                  </motion.a>
                  <motion.a
                    href="https://az.linkedin.com/school/naxçıvan-dövlət-universiteti/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-tedlightgray text-tedblack hover:bg-tedred hover:text-white transition-colors"
                    aria-label="LinkedIn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Linkedin className="h-5 w-5" />
                  </motion.a>
                  <motion.a
                    href="https://www.facebook.com/share/1EVCTH2CyK/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-tedlightgray text-tedblack hover:bg-tedred hover:text-white transition-colors"
                    aria-label="Facebook"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Facebook className="h-5 w-5" />
                  </motion.a>
                  <motion.a
                    href="https://www.youtube.com/user/TEDxTalks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-tedlightgray text-tedblack hover:bg-tedred hover:text-white transition-colors"
                    aria-label="YouTube"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Youtube className="h-5 w-5" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            ref={refRight}
            initial="hidden"
            animate={controlsRight}
            variants={variants}
          >
            <div className="h-80 md:h-96 rounded-xl overflow-hidden mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3027.6958916156!2d45.39985911166313!3d39.211177131147466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMznCsDEyJzQwLjIiTiA0NcKwMjQnMDMuMSJF!5e0!3m2!1saz!2saz!4v1712507057452!5m2!1saz!2saz"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map showing Naxçıvan Dövlət Universiteti TEDx event location"
                className="hover:opacity-95 transition-opacity duration-300"
              ></iframe>
            </div>

            <form
              onSubmit={handleContact}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={(e) => {
                      resetForm({
                        ...contactForm,
                        name: e.target.value,
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-tedred focus:border-transparent transition-colors"
                    placeholder="Adınız"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={(e) => {
                      resetForm({
                        ...contactForm,
                        email: e.target.value,
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-tedred focus:border-transparent transition-colors"
                    placeholder="E-poçt"
                    required
                  />
                </div>
              </div>
              <div>
                <input
                  type="text"
                  name="subject"
                  value={contactForm.subject}
                  onChange={(e) => {
                    resetForm({
                      ...contactForm,
                      subject: e.target.value,
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-tedred focus:border-transparent transition-colors"
                  placeholder="Mövzu"
                  required
                />
              </div>
              <div>
                <textarea
                  name="message"
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => {
                    resetForm({
                      ...contactForm,
                      message: e.target.value,
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-tedred focus:border-transparent transition-colors"
                  placeholder="Mesajınız"
                  required
                ></textarea>
              </div>
              <div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative overflow-hidden bg-tedred text-white font-medium px-6 py-3 rounded-md shadow-md group hover:scale-105 transition-all duration-300 flex items-center"
                  whileHover={{ scale: 1.05, boxShadow: "0px 5px 20px rgba(239, 68, 68, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="absolute top-0 left-0 w-40 h-40 -mt-10 -ml-3 transition-all duration-700 bg-white opacity-10 rotate-45 group-hover:-translate-x-20 group-hover:-translate-y-20 ease-out"></span>
                  <span className="relative z-10">
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Göndərilir...
                      </>
                    ) : isSuccess ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Göndərildi!
                      </>
                    ) : (
                      "Göndər"
                    )}
                  </span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}