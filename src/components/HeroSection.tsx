
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  const handleWatchDemo = () => {
    window.open(
      "https://youtu.be/6VFLKdfxA24?si=4pwCK03L_wdcJBDr",
      "_blank"
    );
  };

  return (
    <section className="relative flex items-center justify-center min-h-[90vh] sm:min-h-screen overflow-hidden bg-black">
      {/* Hero Background Image with Overlay */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
          }}
        >
          <motion.div
            className="w-full h-full"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
          />
        </div>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60 dark:bg-black/75"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 py-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl md:max-w-5xl mx-auto flex flex-col gap-0 sm:gap-2">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center justify-center self-center px-4 py-1 bg-neutral-800 dark:bg-neutral-900 rounded-full text-xs sm:text-sm font-bold text-white mb-6 sm:mb-8 border border-gray-400 dark:border-gray-700"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 shrink-0"></span>
            AI-Powered Fitness Platform
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-8 leading-tight tracking-tight break-words text-center"
            style={{ wordBreak: "break-word" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Smarter Fitness,
            <span className="block font-light text-gray-100 mt-1">
              Backed by AI
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 sm:mb-12 max-w-full sm:max-w-4xl mx-auto leading-relaxed font-light text-center px-1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Train smarter. Eat better. Track everything.
            <span className="block mt-2 sm:mt-4 text-sm xs:text-base sm:text-lg md:text-xl text-gray-300">
              Personalized workouts and nutrition plans powered by artificial intelligence.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full mb-10 sm:mb-20"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link to="/signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white hover:bg-gray-100 text-black px-8 xs:px-10 py-5 xs:py-6 text-base xs:text-lg font-semibold rounded-2xl group transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                Start Your Journey
                <ArrowRight className="ml-2 xs:ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={handleWatchDemo}
              className="w-full sm:w-auto border-2 border-white/50 hover:border-white backdrop-blur-sm px-8 xs:px-10 py-5 xs:py-6 text-base xs:text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 bg-white/10 hover:bg-white/20 text-white hover:text-white"
            >
              <Play className="mr-2 xs:mr-3 w-5 h-5" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 max-w-md sm:max-w-2xl mx-auto my-2"
          >
            <div className="text-center px-3 py-4 bg-black/20 dark:bg-white/5 rounded-xl">
              <div className="text-2xl xs:text-3xl md:text-4xl font-bold text-white mb-1">
                100K+
              </div>
              <div className="text-xs xs:text-sm md:text-base text-gray-300 font-medium">
                Active Users
              </div>
            </div>
            <div className="text-center px-3 py-4 bg-black/20 dark:bg-white/5 rounded-xl">
              <div className="text-2xl xs:text-3xl md:text-4xl font-bold text-white mb-1">
                50M+
              </div>
              <div className="text-xs xs:text-sm md:text-base text-gray-300 font-medium">
                Workouts Completed
              </div>
            </div>
            <div className="text-center px-3 py-4 bg-black/20 dark:bg-white/5 rounded-xl">
              <div className="text-2xl xs:text-3xl md:text-4xl font-bold text-white mb-1">
                4.9
              </div>
              <div className="text-xs xs:text-sm md:text-base text-gray-300 font-medium">
                App Store Rating
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
