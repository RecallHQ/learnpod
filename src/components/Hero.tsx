import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Hls from "hls.js";
import Header from "./Header";

interface HeroProps {
  onCreatePod: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenFeedback: () => void;
}

const Hero: React.FC<HeroProps> = ({
  onCreatePod,
  isDarkMode,
  onToggleTheme,
  onOpenFeedback,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [isHeroInView, setIsHeroInView] = React.useState(true);
  const hlsSource =
    "https://stream.mux.com/s8pMcOvMQXc4GD6AX4e1o01xFogFxipmuKltNfSYza0200.m3u8";

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

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsSource;
      void video.play().catch(() => undefined);
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(hlsSource);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        void video.play().catch(() => undefined);
      });
      return () => {
        hls.destroy();
      };
    }
  }, []);

  const handleSeeHowItWorks = () => {
    const target = document.getElementById("learnpod-action");
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const blurInTransition = (delay = 0) => ({
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1] as const,
    delay,
  });

  const BlurIn: React.FC<{
    delay?: number;
    className?: string;
    children: React.ReactNode;
  }> = ({ delay = 0, className, children }) => (
    <motion.div
      className={className}
      initial={
        prefersReducedMotion
          ? false
          : { opacity: 0, y: 20, filter: "blur(10px)" }
      }
      animate={
        prefersReducedMotion
          ? false
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      transition={blurInTransition(delay)}
    >
      {children}
    </motion.div>
  );

  const SplitText: React.FC<{
    text: string;
    className?: string;
    wordClassName?: string;
    delay?: number;
    stagger?: number;
  }> = ({ text, className, wordClassName, delay = 0, stagger = 0.08 }) => {
    const words = text.split(" ");
    return (
      <span className={className}>
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            className={`inline-block ${wordClassName ?? ""}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
            animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + index * stagger,
            }}
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </span>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-background flex items-center justify-center"
    >
      <div className="fixed inset-x-0 top-0 z-40">
        <Header
          isDarkMode={isDarkMode}
          onToggleTheme={onToggleTheme}
          onOpenFeedback={onOpenFeedback}
          variant={isHeroInView ? "overlay" : "solid"}
        />
      </div>

      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover origin-left scale-[1.2] ml-[200px]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-10" />

      <div className="relative z-20 w-full">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex flex-col items-center text-center gap-12">
            <div className="flex flex-col items-center gap-6">


              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium leading-tight lg:leading-[1.2] text-foreground">
                <SplitText text="Search" className="block" />
                <SplitText text="Inside Video" className="block" delay={0.08} />

              </h1>

              <BlurIn delay={0.4}>
                <p className="text-white/80 text-xl md:text-2xl font-normal leading-relaxed max-w-2xl">
                  Ask questions and get precise, timestamp-linked answers from
                  any long form video
                </p>
              </BlurIn>
            </div>

            <BlurIn delay={0.6}>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={onCreatePod}
                  className="inline-flex items-center gap-2 rounded-full liquid-glass-btn liquid-glass-btn--strong bg-foreground text-background px-7 py-4 text-base font-semibold"
                >
                  Explore Pods
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleSeeHowItWorks}
                  className="inline-flex items-center rounded-full liquid-glass-btn bg-white/20 text-white px-10 py-4 text-base font-semibold"
                >
                  See How It Works
                </button>
              </div>
            </BlurIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;