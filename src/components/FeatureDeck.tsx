import React, { forwardRef, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

type Feature = {
  title: string;
  subtitle: string;
};

const stackNudges = [-18, -6, 6, 18];
const stackRotations = [2, -1, 1, -2];

const features: Feature[] = [
  {
    title: "Conversational Video Search",
    subtitle: "Ask Anything. Get direct answers",
  },
  {
    title: "Timestamp grounded responses",
    subtitle: "Every answer links to the exact moment",
  },
  {
    title: "Context aware understanding",
    subtitle: "Understands topics, themes and multi-part questions",
  },
  {
    title: "Interactive Knowledge Layer",
    subtitle: "Transform static video archives into living knowledge systems",
  },
];

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
};

type FeatureCardProps = {
  feature: Feature;
  index: number;
  expansion: ReturnType<typeof useTransform>;
  stackOffset: number;
  isDesktop: boolean;
  prefersReducedMotion: boolean;
};

const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  (
    { feature, index, expansion, stackOffset, isDesktop, prefersReducedMotion },
    ref
  ) => {
    const x = useTransform(expansion, (value) => {
      if (!isDesktop || prefersReducedMotion) return 0;
      return stackOffset * (1 - value);
    });
    const rotate = useTransform(expansion, (value) => {
      if (!isDesktop || prefersReducedMotion) return 0;
      return (stackRotations[index] ?? 0) * (1 - value);
    });
    const scale = useTransform(expansion, (value) => {
      if (!isDesktop || prefersReducedMotion) return 1;
      return 0.96 + 0.04 * value;
    });

    return (
      <motion.div
        ref={ref}
        style={{ x, rotate, scale }}
        className="relative rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/80 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.7)] p-6 backdrop-blur"
      >
        <div className="h-2 w-10 rounded-full bg-gradient-to-r from-[#2EC4B6] via-[#60a5fa] to-[#f59e0b] mb-6" />
        <h3 className="text-xl font-semibold text-[var(--app-fg)] mb-3">
          {feature.title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          {feature.subtitle}
        </p>
      </motion.div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

const FeatureDeck: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [stackOffsets, setStackOffsets] = useState<number[]>(
    new Array(features.length).fill(0)
  );

  useLayoutEffect(() => {
    if (!gridRef.current || !isDesktop) return;

    const measure = () => {
      const containerWidth = gridRef.current?.clientWidth ?? 0;
      if (!containerWidth) return;

      const nextOffsets = cardRefs.current.map((card, index) => {
        if (!card) return 0;
        const cardCenterX = card.offsetLeft + card.offsetWidth / 2;
        const containerCenterX = containerWidth / 2;
        return containerCenterX - cardCenterX + (stackNudges[index] ?? 0);
      });

      setStackOffsets(nextOffsets);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isDesktop]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const expansion = useTransform(
    scrollYProgress,
    [0, 0.3, 0.4, 0.65, 1],
    [0, 1, 1, 0, 0]
  );

  return (
    <section
      ref={sectionRef}
      className="max-w-6xl mx-auto px-4 pb-24 pt-6"
      aria-label="Features"
    >
      <div className="relative">
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              feature={feature}
              index={index}
              expansion={expansion}
              stackOffset={stackOffsets[index] ?? 0}
              isDesktop={isDesktop}
              prefersReducedMotion={!!prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureDeck;
