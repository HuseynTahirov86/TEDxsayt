import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center text-white parallax bg-tedblack overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
          alt="University Auditorium"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/TEDx_logo.svg/1200px-TEDx_logo.svg.png"
            alt="TEDx Logo"
            className="h-20 md:h-24 mb-4"
          />
          <h1 className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-4">
            TEDx<span className="font-normal">Nakhchivan State University</span>
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-lg md:text-xl">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-tedred"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <span>16 İyun 2025</span>
            </div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-tedred"></div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-tedred"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <span>Naxçıvan Dövlət Universitetinin Konservatoriyası</span>
            </div>
          </div>
        </motion.div>

        <motion.p
          className="text-2xl font-light mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          "Sərhədləri aşan ideyalar, gələcəyi formalaşdıran fikirlər"
        </motion.p>

        <motion.button
          onClick={() => {
            const registerSection = document.getElementById("register");
            if (registerSection) {
              registerSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="inline-block bg-tedred hover:bg-red-700 text-white font-medium px-8 py-3 rounded-md transition-all transform hover:scale-105 text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Qeydiyyatdan keç
        </motion.button>
      </div>

      <motion.div
        className="absolute bottom-8 w-full text-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button
          onClick={scrollToAbout}
          className="inline-block text-white"
          aria-label="Scroll down"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="h-8 w-8" />
          </motion.div>
        </button>
      </motion.div>
    </section>
  );
}
