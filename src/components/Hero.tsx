import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import Header from "./Header";

interface HeroProps {
  onCreatePod: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Hero: React.FC<HeroProps> = ({
  onCreatePod,
  isDarkMode,
  onToggleTheme,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const [isHeroInView, setIsHeroInView] = React.useState(true);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroInView(entry.isIntersecting),
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[70vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      <div className="fixed inset-x-0 top-0 z-40">
        <Header
          isDarkMode={isDarkMode}
          onToggleTheme={onToggleTheme}
          variant={isHeroInView ? "overlay" : "solid"}
        />
      </div>
      <div className="pointer-events-none absolute -top-36 right-[-28%] h-[22rem] w-[42rem] sm:h-[28rem] sm:w-[54rem] lg:h-[34rem] lg:w-[76rem] rounded-full bg-gradient-to-br from-[#2EC4B6]/45 via-[#2EC4B6]/20 to-transparent blur-[90px] opacity-70" />
      <div className="relative z-10 max-w-5xl w-full text-center flex flex-col items-center">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-[var(--app-fg)]"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Search Inside Video
        </motion.h1>

        <motion.div
          className="relative mt-6 sm:mt-8 max-w-3xl"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <div className="absolute inset-0 -z-10 blur-3xl opacity-50 bg-gradient-to-r from-[#2EC4B6]/60 via-[#2EC4B6]/30 to-transparent rounded-full dark:from-[#2EC4B6]/70 dark:via-[#2EC4B6]/40 dark:opacity-60" />
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-[#2EC4B6] dark:text-[#7FE5DA] px-4 py-3">
            Ask questions and get precise, timestamp-linked answers from any
            long form video.
          </p>
        </motion.div>

        <motion.button
          type="button"
          onClick={onCreatePod}
          className="mt-8 sm:mt-10 px-10 sm:px-12 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-semibold text-slate-900 bg-[#2EC4B6]/45 border border-transparent shadow-[0_18px_40px_rgba(46,196,182,0.35)] backdrop-blur-2xl hover:bg-[#2EC4B6]/60 hover:shadow-[0_22px_50px_rgba(46,196,182,0.55)] hover:backdrop-blur-[26px] transition-all duration-300 dark:bg-[#2EC4B6]/90 dark:text-white dark:shadow-[0_18px_40px_rgba(46,196,182,0.5)] dark:hover:bg-[#2EC4B6]/100 dark:hover:shadow-[0_22px_50px_rgba(46,196,182,0.7)]"
          whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.02 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          Explore Pods
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
