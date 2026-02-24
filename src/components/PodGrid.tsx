import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Play } from "lucide-react";
import { Pod } from "../types";
import PodCard from "./PodCard";

interface PodGridProps {
  pods: Pod[];
  onPodClick: (pod: Pod) => void;
  onToggleFollow?: (podId: string) => void;
  onShare?: (pod: Pod) => void;
}

interface CardDepthState {
  rotateX: number;
  rotateY: number;
  scale: number;
  glowX: number;
  glowY: number;
}

const DEFAULT_CARD_DEPTH: CardDepthState = {
  rotateX: 0,
  rotateY: 0,
  scale: 1,
  glowX: 50,
  glowY: 50,
};

const PodGrid: React.FC<PodGridProps> = ({
  pods,
  onPodClick,
  onToggleFollow,
  onShare,
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [visiblePods, setVisiblePods] = useState<Pod[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [clickedPodId, setClickedPodId] = useState<string | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [canUseHover, setCanUseHover] = useState(false);
  const [gridPointer, setGridPointer] = useState({ x: 50, y: 50 });
  const [cardDepth, setCardDepth] = useState<Record<string, CardDepthState>>(
    {}
  );

  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const gridFloatY = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10]);

  const podsPerPage = 9;

  const { currentVisiblePods, hasMore } = useMemo(() => {
    const startIndex = 0;
    const endIndex = currentPage * podsPerPage;
    const slicedPods = pods.slice(startIndex, endIndex);

    return {
      currentVisiblePods: slicedPods,
      hasMore: currentPage * podsPerPage < pods.length,
    };
  }, [pods, currentPage, podsPerPage]);

  useEffect(() => {
    setVisiblePods(currentVisiblePods);
  }, [currentVisiblePods]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncHoverCapability = () => setCanUseHover(mediaQuery.matches);

    syncHoverCapability();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", syncHoverCapability);
    } else {
      mediaQuery.addListener(syncHoverCapability);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", syncHoverCapability);
      } else {
        mediaQuery.removeListener(syncHoverCapability);
      }
    };
  }, []);

  const loadMore = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const handlePodClick = useCallback(
    (pod: Pod) => {
      setClickedPodId(pod.id);

      setTimeout(
        () => {
          console.log("Navigating to pod:", pod.id);
          onPodClick(pod);
          setClickedPodId(null);
        },
        prefersReducedMotion ? 100 : 300
      );
    },
    [onPodClick, prefersReducedMotion]
  );

  const handleGridPointerMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !canUseHover) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      setGridPointer({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
      });
    },
    [canUseHover, prefersReducedMotion]
  );

  const resetCardDepth = useCallback((podId: string) => {
    setCardDepth((prev) => ({
      ...prev,
      [podId]: DEFAULT_CARD_DEPTH,
    }));
  }, []);

  const handleCardPointerMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, podId: string) => {
      if (prefersReducedMotion || !canUseHover) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const nx = (x / rect.width - 0.5) * 2;
      const ny = (y / rect.height - 0.5) * 2;
      const maxTilt = 2.4;

      setCardDepth((prev) => ({
        ...prev,
        [podId]: {
          rotateX: -ny * maxTilt,
          rotateY: nx * maxTilt,
          scale: 1.03,
          glowX: (x / rect.width) * 100,
          glowY: (y / rect.height) * 100,
        },
      }));
    },
    [canUseHover, prefersReducedMotion]
  );

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 16,
      scale: prefersReducedMotion ? 1 : 0.985,
      filter: prefersReducedMotion ? "blur(0px)" : "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: prefersReducedMotion ? 0.2 : 0.52,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      ref={sectionRef}
      className="max-w-6xl mx-auto px-4 py-8 relative isolate"
      onMouseMove={handleGridPointerMove}
      onMouseLeave={() => {
        setGridPointer({ x: 50, y: 50 });
        setActiveCardId(null);
      }}
      style={{ y: prefersReducedMotion ? 0 : gridFloatY }}
    >
      {!prefersReducedMotion && canUseHover && (
        <motion.div
          className="absolute inset-0 -z-10 pointer-events-none rounded-3xl"
          style={{
            background: `radial-gradient(560px circle at ${gridPointer.x}% ${gridPointer.y}%, rgba(45, 212, 191, 0.1), rgba(45, 212, 191, 0.03) 36%, rgba(45, 212, 191, 0) 72%)`,
          }}
          animate={{ opacity: activeCardId ? 1 : 0.85 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        />
      )}

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{
          opacity: 0,
          y: prefersReducedMotion ? 0 : 20,
          filter: prefersReducedMotion ? "blur(0px)" : "blur(8px)",
          scale: prefersReducedMotion ? 1 : 0.99,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          transition: {
            duration: prefersReducedMotion ? 0.2 : 0.6,
            ease: [0.22, 1, 0.36, 1],
            staggerChildren: prefersReducedMotion ? 0 : 0.06,
            delayChildren: prefersReducedMotion ? 0 : 0.08,
          },
        }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <AnimatePresence>
          {visiblePods.map((pod, index) => (
            <motion.div
              key={pod.id}
              variants={cardVariants}
              transition={{ delay: prefersReducedMotion ? 0 : index * 0.04 }}
              exit="hidden"
            >
              <motion.div
                className="relative rounded-2xl"
                tabIndex={0}
                onMouseEnter={() => setActiveCardId(pod.id)}
                onMouseLeave={() => {
                  resetCardDepth(pod.id);
                  if (activeCardId === pod.id) setActiveCardId(null);
                }}
                onMouseMove={(event) => handleCardPointerMove(event, pod.id)}
                onFocusCapture={() => setActiveCardId(pod.id)}
                onBlurCapture={(event) => {
                  const next = event.relatedTarget as Node | null;
                  if (!event.currentTarget.contains(next)) {
                    resetCardDepth(pod.id);
                    if (activeCardId === pod.id) setActiveCardId(null);
                  }
                }}
                animate={{
                  rotateX:
                    canUseHover && !prefersReducedMotion
                      ? (cardDepth[pod.id]?.rotateX ?? 0)
                      : 0,
                  rotateY:
                    canUseHover && !prefersReducedMotion
                      ? (cardDepth[pod.id]?.rotateY ?? 0)
                      : 0,
                  scale:
                    clickedPodId === pod.id
                      ? 1.035
                      : activeCardId && activeCardId !== pod.id
                        ? 0.98
                        : canUseHover && !prefersReducedMotion
                          ? (cardDepth[pod.id]?.scale ?? 1)
                          : 1,
                  opacity: activeCardId && activeCardId !== pod.id ? 0.7 : 1,
                  boxShadow:
                    clickedPodId === pod.id
                      ? "0 22px 52px -24px rgba(15, 23, 42, 0.42)"
                      : activeCardId === pod.id
                        ? `${(cardDepth[pod.id]?.rotateY ?? 0) * 1.8}px ${16 + Math.abs((cardDepth[pod.id]?.rotateX ?? 0) * 1.3)}px 40px -22px rgba(15, 23, 42, 0.34)`
                        : "0 12px 30px -20px rgba(15, 23, 42, 0.22)",
                }}
                transition={{
                  duration: prefersReducedMotion ? 0.12 : 0.28,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: 1200,
                }}
              >
                <PodCard
                  pod={{
                    ...pod,
                    status: pod.status || "processing",
                  }}
                  onClick={handlePodClick}
                  onToggleFollow={onToggleFollow}
                  onShare={onShare}
                  animationDelay={prefersReducedMotion ? 0 : index * 0.05}
                  isClicked={clickedPodId === pod.id}
                />

                {!prefersReducedMotion && canUseHover && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: `radial-gradient(200px circle at ${cardDepth[pod.id]?.glowX ?? 50}% ${cardDepth[pod.id]?.glowY ?? 50}%, rgba(255,255,255,0.34), rgba(255,255,255,0.12) 32%, rgba(255,255,255,0) 70%)`,
                    }}
                    animate={{ opacity: activeCardId === pod.id ? 0.56 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                )}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {hasMore && (
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.5 }}
        >
          <motion.button
            onClick={loadMore}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
            whileHover={
              prefersReducedMotion
                ? undefined
                : {
                    scale: 1.05,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }
            }
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <span className="relative z-10 flex items-center">
              Load More Pods
              {!prefersReducedMotion && (
                <motion.div
                  className="ml-2"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  v
                </motion.div>
              )}
            </span>
          </motion.button>
        </motion.div>
      )}

      {pods.length === 0 && (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0.2 : 0.6,
            ease: "easeOut",
          }}
        >
          <motion.div
            className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0],
                  }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          >
            <Play className="w-12 h-12 text-blue-600" />
          </motion.div>

          <motion.h3
            className="text-2xl font-bold text-gray-700 mb-3"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: prefersReducedMotion ? 0 : 0.2,
              duration: prefersReducedMotion ? 0.2 : 0.5,
            }}
          >
            No pods found
          </motion.h3>

          <motion.p
            className="text-gray-500 text-lg"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: prefersReducedMotion ? 0 : 0.4,
              duration: prefersReducedMotion ? 0.2 : 0.5,
            }}
          >
            Try adjusting your search or create your first pod!
          </motion.p>

          {!prefersReducedMotion && (
            <motion.div
              className="flex justify-center space-x-2 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PodGrid;
