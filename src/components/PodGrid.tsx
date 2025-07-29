import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import { Pod } from "../types";
import PodCard from "./PodCard";

interface PodGridProps {
  pods: Pod[];
  onPodClick: (pod: Pod) => void;
  onToggleFollow?: (podId: string) => void;
  onShare?: (pod: Pod) => void;
}

const PodGrid: React.FC<PodGridProps> = ({
  pods,
  onPodClick,
  onToggleFollow,
  onShare,
}) => {
  const [visiblePods, setVisiblePods] = useState<Pod[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [clickedPodId, setClickedPodId] = useState<string | null>(null);

  // Performance optimization: Detect reduced motion preference
  const prefersReducedMotion = useReducedMotion();

  const podsPerPage = 9; // 3x3 grid max

  // Memoize visible pods calculation
  const { currentVisiblePods, hasMore } = useMemo(() => {
    const startIndex = 0;
    const endIndex = currentPage * podsPerPage;
    const slicedPods = pods.slice(startIndex, endIndex);

    return {
      currentVisiblePods: slicedPods,
      hasMore: currentPage * podsPerPage < pods.length,
    };
  }, [pods, currentPage, podsPerPage]);

  // Update visible pods when pods change (no animation)
  useEffect(() => {
    setVisiblePods(currentVisiblePods);
  }, [currentVisiblePods]);

  // Memoized load more handler
  const loadMore = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  // Enhanced pod click handler with animation
  const handlePodClick = useCallback(
    (pod: Pod) => {
      setClickedPodId(pod.id);

      // Add a small delay to show the opening animation before navigating
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

  // Animation variants for cards
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20,
      scale: prefersReducedMotion ? 1 : 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0.2 : 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    clicked: {
      scale: prefersReducedMotion ? 1 : 1.05,
      rotateY: prefersReducedMotion ? 0 : 5,
      z: prefersReducedMotion ? 0 : 50,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence initial={false}>
          {visiblePods.map((pod, index) => (
            <motion.div
              key={pod.id}
              //variants={cardVariants}
              initial="hidden"
              animate={clickedPodId === pod.id ? "clicked" : "visible"}
              exit="hidden"
              style={{
                transformOrigin: "center center",
                transformStyle: "preserve-3d",
              }}
            >
              <PodCard
                pod={{
                  ...pod,
                  status: pod.status || "processing", // Default to processing
                }}
                onClick={handlePodClick}
                onToggleFollow={onToggleFollow}
                onShare={onShare}
                animationDelay={prefersReducedMotion ? 0 : index * 0.05}
                isClicked={clickedPodId === pod.id}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Button */}
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
                  ↓
                </motion.div>
              )}
            </span>
          </motion.button>
        </motion.div>
      )}

      {/* Enhanced Empty State */}
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

          {/* Animated dots with reduced motion support */}
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
    </div>
  );
};

export default PodGrid;
