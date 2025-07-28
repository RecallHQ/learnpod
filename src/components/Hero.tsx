import React from "react";
import { motion } from "framer-motion";
import { Clock, BookOpen } from "lucide-react";

interface HeroProps {
  onCreatePod: () => void;
}

// Modern VideoIndex Logo Component
const VideoIndexLogo: React.FC<{}> = ({}) => {
  return (
    <img
      src="./logo.png"
      className="w-[150px] h-[150px] md:w-[170px] md:h-[170px] lg:w-[240px] lg:h-[200px]"
    />
  );
};
const Hero: React.FC<HeroProps> = ({ onCreatePod }) => {
  return (
    <section className="relative h-[55vh] md:h-[45vh] lg:h-[40vh] flex items-center justify-center overflow-hidden">
      {/* Animated Light Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        animate={{
          background: [
            "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #f3e8ff 50%, #fef3c7 75%, #ecfdf5 100%)",
            "linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 25%, #fef3c7 50%, #e0f2fe 75%, #f3e8ff 100%)",
            "linear-gradient(135deg, #f3e8ff 0%, #fef3c7 25%, #ecfdf5 50%, #f0f9ff 75%, #e0f2fe 100%)",
            "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #f3e8ff 50%, #fef3c7 75%, #ecfdf5 100%)",
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle Overlay Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="5"
                cy="5"
                r="0.5"
                fill="currentColor"
                className="text-blue-200"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full opacity-40"
            style={{
              left: `${10 + ((i * 8) % 80)}%`,
              top: `${15 + ((i * 12) % 70)}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[90rem] mx-auto px-[3%] md:px-[4%] lg:px-[5%] xl:px-[6%] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Main Content */}
          <motion.div
            className="text-center lg:text-left space-y-6 order-2 lg:order-1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Main Headline */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight whitespace-nowrap">
                <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                  AI-Powered Learning From Videos
                </span>
              </h1>

              <motion.p
                className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Transforming educational videos into interactive, AI-powered
                learning
              </motion.p>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {[
                { icon: BookOpen, text: "AI-Powered Analysis" },
                { icon: Clock, text: "Instant Responses" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-2 bg-white/40 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-200/50"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    transition: { duration: 0.2 },
                  }}
                >
                  <feature.icon className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Element */}
          <motion.div
            className="relative flex items-center justify-center order-1 lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Main Visual Container */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72">
              {/* Outer Glow Ring */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-200/40 via-indigo-200/40 to-purple-200/40 blur-3xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Central Brain Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="relative bg-white/80 backdrop-blur-sm rounded-full p-8 shadow-xl border border-gray-200/50"
                  animate={{
                    rotateY: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.3 },
                  }}
                >
                  <VideoIndexLogo />

                  {/* Pulsing Dots Around Icon */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"
                      style={{
                        left: `${50 + 45 * Math.cos((i * Math.PI * 2) / 8)}%`,
                        top: `${50 + 45 * Math.sin((i * Math.PI * 2) / 8)}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.25,
                      }}
                    />
                  ))}
                </motion.div>
              </div>

              {/* Orbiting Rings */}
              <svg className="absolute inset-0 w-full h-full">
                {[...Array(3)].map((_, i) => (
                  <motion.circle
                    key={i}
                    cx="50%"
                    cy="50%"
                    r={60 + i * 25}
                    fill="none"
                    stroke="url(#orbitalGradient)"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                    opacity="0.4"
                    initial={{ pathLength: 0 }}
                    animate={{
                      pathLength: 1,
                      rotate: i % 2 === 0 ? 360 : -360,
                    }}
                    transition={{
                      pathLength: { duration: 2, delay: i * 0.3 },
                      rotate: {
                        duration: 15 + i * 5,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }}
                  />
                ))}
                <defs>
                  <linearGradient id="orbitalGradient">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <motion.div
          className="w-5 h-8 border-2 border-gray-400/60 rounded-full flex justify-center bg-white/20 backdrop-blur-sm"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 bg-gray-500 rounded-full mt-1.5"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
