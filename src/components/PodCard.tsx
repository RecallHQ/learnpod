import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Play,
  Calendar,
  Eye,
  Users,
  Heart,
  CheckCircle,
  Clock,
  Upload,
  AlertCircle,
  Share2,
} from "lucide-react";
import { Pod } from "../types";
import { getPublicImageUrl } from "../utils/getMediaUrl";

interface PodCardProps {
  pod: Pod;
  onClick: (pod: Pod) => void;
  onToggleFollow?: (podId: string) => void;
  onShare?: (pod: Pod) => void;
  animationDelay?: number;
  isClicked?: boolean;
}

const PodCard: React.FC<PodCardProps> = memo(
  ({
    pod,
    onClick,
    onToggleFollow,
    onShare,
    animationDelay = 0,
    isClicked = false,
  }) => {
    const prefersReducedMotion = useReducedMotion();

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    const getStatusConfig = (status: Pod["status"]) => {
      if (!status) {
        return {
          icon: Clock,
          text: "Loading...",
          color: "bg-gray-500/90 text-white",
          dotColor: "bg-gray-400",
        };
      }
      const normalizedStatus = status.trim().toLowerCase();

      switch (normalizedStatus) {
        case "ready":
          return {
            icon: CheckCircle,
            text: "Ready",
            color: "bg-green-500/90 text-white",
            dotColor: "bg-green-400",
          };
        case "processing":
          return {
            icon: Clock,
            text: "Processing",
            color: "bg-yellow-500/90 text-white",
            dotColor: "bg-yellow-400",
          };
        case "error":
          return {
            icon: AlertCircle,
            text: "Error",
            color: "bg-red-500/90 text-white",
            dotColor: "bg-red-400",
          };
        default:
          console.warn("Unknown status:", status);
          return {
            icon: AlertCircle,
            text: "Loading...",
            color: "bg-gray-500/90 text-white",
            dotColor: "bg-gray-400",
          };
      }
    };

    // Performance optimization: Memoize click handler
    const handleClick = React.useCallback(() => {
      onClick(pod);
    }, [onClick, pod]);

    // Handle follow toggle
    // const handleFollowClick = React.useCallback(
    //   (e: React.MouseEvent) => {
    //     e.stopPropagation();
    //     onToggleFollow?.(pod.id);
    //   },
    //   [onToggleFollow, pod.id]
    // );

    // Handle share click
    const handleShareClick = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onShare?.(pod);
      },
      [onShare, pod]
    );

    // Enhanced animations for opening effect
    const getCardAnimations = () => {
      if (isClicked && !prefersReducedMotion) {
        return {
          scale: 1.1,
          rotateY: 10,
          z: 100,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        };
      }

      return prefersReducedMotion
        ? {}
        : {
            whileHover: {
              y: -8,
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
              },
            },
            whileTap: { scale: 0.98 },
          };
    };

    const statusConfig = getStatusConfig(pod.status);
    const StatusIcon = statusConfig.icon;

    return (
      <motion.div
        className={`group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 ${
          isClicked ? "z-50 relative" : ""
        } ${pod.status == "processing" && "cursor-not-allowed"}`}
        onClick={handleClick}
        style={{
          willChange: "transform",
          transformOrigin: "center center",
          transformStyle: "preserve-3d",
        }}
        // animate={getCardAnimations()}
        // {...(!prefersReducedMotion && !isClicked ? {
        //   whileHover: {
        //     y: -8,
        //     scale: 1.02,
        //     boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        //     transition: {
        //       type: "spring",
        //       stiffness: 300,
        //       damping: 20,
        //     },
        //   },
        //   whileTap: { scale: 0.98 }
        // } : {})}
      >
        {/* Thumbnail Container */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
          {pod.status == "processing" ? (
            <motion.img
              src="./placeholder.jpg"
              alt={pod.title}
              className="w-full h-full object-cover"
              loading="lazy"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          ) : (
            <motion.img
              src={getPublicImageUrl(pod.image)}
              alt={pod.title}
              className="w-full h-full object-cover"
              loading="lazy"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          )}

          {/* Gradient Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
            initial={{ opacity: 0.3 }}
            whileHover={prefersReducedMotion ? undefined : { opacity: 0.5 }}
            transition={{ duration: 0.3 }}
          />

          {/* Play Button Overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={
              prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-xl"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.1 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Play className="w-8 h-8 text-blue-600 ml-1" />
            </motion.div>
          </motion.div>

          {/* Status Badge */}
          {statusConfig && (
            <motion.div
              className="absolute top-4 left-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: animationDelay + 0.2, duration: 0.4 }}
            >
              <div
                className={`flex items-center px-3 py-1 ${statusConfig.color} backdrop-blur-sm text-sm font-medium rounded-full shadow-lg`}
              >
                <statusConfig.icon className="w-3 h-3 mr-1" />
                {statusConfig.text}
              </div>
            </motion.div>
          )}

          {/* Follow Button */}
          <motion.div
            className="absolute top-4 right-4 flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Share Button */}
            <motion.button
              onClick={handleShareClick}
              className="flex items-center px-2 py-1 backdrop-blur-sm text-xs font-medium rounded-full shadow-lg transition-all duration-200 bg-white/90 text-gray-700 hover:bg-blue-50/90 hover:text-blue-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-3 h-3" />
            </motion.button>

            {/* Follow Button */}
            {/* <motion.button
            onClick={handleFollowClick}
            className={`flex items-center px-3 py-1 backdrop-blur-sm text-xs font-medium rounded-full shadow-lg transition-all duration-200 ${
              pod.isFollowing 
                ? 'bg-red-500/90 text-white hover:bg-red-600/90' 
                : 'bg-white/90 text-gray-700 hover:bg-blue-50/90 hover:text-blue-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className={`w-3 h-3 mr-1 ${pod.isFollowing ? 'fill-current' : ''}`} />
            {pod.isFollowing ? 'Following' : 'Follow'}
          </motion.button> */}
          </motion.div>
        </div>

        {/* Content Section */}
        <motion.div
          className="p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: animationDelay + 0.1, duration: 0.4 }}
        >
          {/* Title */}
          <motion.h3
            className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {pod.title}
          </motion.h3>

          {/* Description */}
          {/* <motion.p
          className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed"
          initial={{ opacity: 0.8 }}
          whileHover={prefersReducedMotion ? undefined : { opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {pod.description}
        </motion.p> */}

          <div className="flex items-center text-xs flex-wrap gap-2">
            {pod.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100/80 px-4 py-1 rounded-lg">
                {tag}
              </span>
            ))}
          </div>

          {/* Meta Information */}
          <motion.div
            className="flex items-center justify-between text-xs text-gray-500 space-y-2"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay + 0.3, duration: 0.4 }}
          >
            <div className="flex items-center justify-between w-full">
              {/* <div className="flex items-center group-hover:text-blue-600 transition-colors duration-200">
              <Calendar className="w-3 h-3 mr-1" />
              <span className="font-medium">{formatDate(pod.createdAt)}</span>
            </div> */}

              <div className="flex items-center space-x-3">
                {/* Followers Count */}
                {/* <div className="flex items-center text-gray-500">
                <Users className="w-3 h-3 mr-1" />
                <span className="font-medium">{pod.followers}</span>
              </div> */}

                {/* Interactions Count */}
                <div className="flex items-center text-gray-500 py-4">
                  <Eye className="w-3 h-3 mr-1" />
                  <span className="font-medium">{pod.views} Views</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Hover Glow Effect */}
        {!prefersReducedMotion && (
          <motion.div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 pointer-events-none ${
              isClicked ? "opacity-20" : ""
            }`}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Opening Animation Overlay */}
        {isClicked && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    );
  }
);

PodCard.displayName = "PodCard";

export default PodCard;
