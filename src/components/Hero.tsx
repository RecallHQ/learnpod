import React from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Header from "./Header";
import UserFeedbackModal from "./UserFeedbackModal";

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
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);
  const headlineWords = ["Search", "Inside", "Video"];

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const easedX = useSpring(pointerX, { stiffness: 80, damping: 18, mass: 0.6 });
  const easedY = useSpring(pointerY, { stiffness: 80, damping: 18, mass: 0.6 });
  const orbX = useTransform(easedX, [0, 1], [-32, 32]);
  const orbY = useTransform(easedY, [0, 1], [-20, 20]);
  const orbXInverse = useTransform(orbX, (v) => v * -0.8);

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

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    pointerX.set(Math.max(0, Math.min(1, x)));
    pointerY.set(Math.max(0, Math.min(1, y)));
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[70vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        pointerX.set(0.5);
        pointerY.set(0.5);
      }}
    >
      <div className="fixed inset-x-0 top-0 z-40">
        <Header
          isDarkMode={isDarkMode}
          onToggleTheme={onToggleTheme}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
          variant={isHeroInView ? "overlay" : "solid"}
        />
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "repeating-linear-gradient(90deg, rgba(46,196,182,0.08) 0px, rgba(46,196,182,0.08) 1px, transparent 1px, transparent 70px)",
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : { backgroundPositionX: ["0px", "70px"], opacity: [0.35, 0.45, 0.35] }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 14, repeat: Infinity, ease: "linear" }
        }
      />

      <motion.div
        className="pointer-events-none absolute -top-36 right-[-28%] h-[22rem] w-[42rem] sm:h-[28rem] sm:w-[54rem] lg:h-[34rem] lg:w-[76rem] rounded-full bg-gradient-to-br from-[#2EC4B6]/45 via-[#2EC4B6]/20 to-transparent blur-[90px] opacity-70"
        style={{ x: prefersReducedMotion ? 0 : orbX, y: prefersReducedMotion ? 0 : orbY }}
        animate={
          prefersReducedMotion
            ? undefined
            : {
              scale: [1, 1.04, 1],
              opacity: [0.62, 0.78, 0.62],
            }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : {
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }
        }
      />

      <motion.div
        className="pointer-events-none absolute -bottom-28 left-[-18%] h-[18rem] w-[26rem] sm:h-[22rem] sm:w-[34rem] rounded-full bg-gradient-to-tr from-[#2EC4B6]/30 via-[#2EC4B6]/10 to-transparent blur-[88px] opacity-70"
        style={{ x: prefersReducedMotion ? 0 : orbXInverse }}
        animate={prefersReducedMotion ? undefined : { scale: [1, 1.03, 1] }}
        transition={prefersReducedMotion ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-5xl w-full text-center flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-[var(--app-fg)]">
          {headlineWords.map((word, index) => (
            <motion.span
              key={word}
              className="inline-block mr-4 last:mr-0"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 26, filter: "blur(6px)" }}
              animate={prefersReducedMotion ? false : { opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: index * 0.1,
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.div
          className="relative mt-6 sm:mt-8 max-w-3xl"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 -z-10 blur-3xl opacity-50 bg-gradient-to-r from-[#2EC4B6]/60 via-[#2EC4B6]/30 to-transparent rounded-full dark:from-[#2EC4B6]/70 dark:via-[#2EC4B6]/40 dark:opacity-60"
            animate={prefersReducedMotion ? undefined : { opacity: [0.48, 0.66, 0.48] }}
            transition={prefersReducedMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-[#2EC4B6] dark:text-[#7FE5DA] px-4 py-3">
            Ask questions and get precise, timestamp-linked answers from any
            long form video.
          </p>
        </motion.div>

        <motion.button
          type="button"
          onClick={onCreatePod}
          className="group relative mt-8 sm:mt-10 px-10 sm:px-12 py-4 sm:py-5 rounded-2xl text-base sm:text-lg font-semibold text-slate-900 bg-[#2EC4B6]/45 border border-transparent shadow-[0_18px_40px_rgba(46,196,182,0.35)] backdrop-blur-2xl hover:bg-[#2EC4B6]/60 hover:shadow-[0_22px_50px_rgba(46,196,182,0.55)] hover:backdrop-blur-[26px] transition-all duration-300 dark:bg-[#2EC4B6]/90 dark:text-white dark:shadow-[0_18px_40px_rgba(46,196,182,0.5)] dark:hover:bg-[#2EC4B6]/100 dark:hover:shadow-[0_22px_50px_rgba(46,196,182,0.7)] overflow-hidden"
          whileHover={prefersReducedMotion ? undefined : { y: -3, scale: 1.025 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        >
          {!prefersReducedMotion && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ["-120%", "220%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
            />
          )}
          <span className="relative z-10">Explore Pods</span>
        </motion.button>


      </div>

      <UserFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={() => setIsFeedbackOpen(false)}
      />
    </section>
  );
};

export default Hero;
