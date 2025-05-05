import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPin, Mail, Phone, Instagram, Linkedin, Twitter, Youtube, Check } from "lucide-react";
import { useContact } from "@/hooks/use-contact";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { contactForm, isSubmitting, isSuccess, handleContact, resetForm } = useContact();
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
          {t('contact')}
        </h2>
        <p className="text-tedgray text-center max-w-2xl mx-auto mb-12">
          {t('contact_subtitle')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            ref={refLeft}
            initial="hidden"
            animate={controlsLeft}
            variants={variants}
          >
            <h3 className="text-xl font-poppins font-semibold mb-6">
              {t('contact_info')}
            </h3>

            <div className="space-y-6">
              <div className="flex">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-tedlightgray text-tedred mr-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{t('address')}</h4>
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
                  <h4 className="font-semibold mb-1">{t('email')}</h4>
                  <a
                    href="mailto:info@tedxnakhchivansu.com"
                    className="text-tedred hover:text-red-700 transition-colors"
                  >
                    info@tedxnakhchivansu.com
                  </a>
                </div>
              </div>

              <div className="flex">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-tedlightgray text-tedred mr-4">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{t('phone')}</h4>
                  <a
                    href="tel:+994501234567"
                    className="text-tedgray hover:text-tedblack transition-colors"
                  >
                    +994 50 123 45 67
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">{t('follow_us')}</h4>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-tedlightgray text-tedblack hover:bg-tedred hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-tedlightgray text-tedblack hover:bg-tedred hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-tedlightgray text-tedblack hover:bg-tedred hover:text-white transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-tedlightgray text-tedblack hover:bg-tedred hover:text-white transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
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
            <div className="h-80 md:h-96 rounded-xl overflow-hidden mb-8">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3068.382115335651!2d45.40681907577115!3d39.2083783269816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x401df1ff02a60e99%3A0xf19a359b4510ccbf!2zTsSDeHTEnXZhbiBEw7Z2bMmZdCBVbml2ZXJzaXRldGkgLyBOYWtoY2hpdmFuIFN0YXRlIFVuaXZlcnNpdHk!5e0!3m2!1sen!2s!4v1711032578966!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map showing Nakhchivan State University location"
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
                    placeholder={t('name')}
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
                    placeholder={t('email')}
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
                  placeholder={t('subject')}
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
                  placeholder={t('message')}
                  required
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-tedred hover:bg-red-700 text-white font-medium px-6 py-3 rounded-md transition-colors flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      {t('sending')}
                    </>
                  ) : isSuccess ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {t('sent')}
                    </>
                  ) : (
                    t('send_message')
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
