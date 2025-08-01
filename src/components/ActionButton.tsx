import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, MessageCircle } from "lucide-react";
import UserFeedbackModal from "./UserFeedbackModal";
import { UserFeedbackFormData } from "../types";

interface ActionButtonsProps {
  onCreatePod: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onCreatePod }) => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleFeedbackSubmit = (feedbackData: UserFeedbackFormData) => {
    console.log("Feedback submitted:", feedbackData);
    // Here you would typically send the feedback to your API
    setIsFeedbackModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-4 px-2">
        {/* Mobile Layout */}
        <div className="md:hidden flex gap-3">
          {/* Create Pod Button - Compact */}
          <motion.button
            onClick={onCreatePod}
            className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl min-w-[110px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5 mr-2" />
            <span className="text-sm">Create</span>
          </motion.button>

          {/* Feedback Button - Compact */}
          <motion.button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="flex items-center justify-center px-4 py-3 bg-gray-50/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl hover:bg-gray-100/80 transition-all duration-200 text-gray-700 min-w-[50px]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title="Send Feedback"
          >
            <MessageCircle className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex gap-4">
          {/* Create Pod Button */}

          <motion.button
            onClick={onCreatePod}
            className="group relative flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-3xl transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 100%",
              }}
            />
            <Plus className="relative z-10 w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-200" />
            <span className="relative z-10">Create Pod</span>
          </motion.button>

          {/* Feedback Button */}
          <motion.button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="group relative flex items-center px-8 py-4 bg-gray-50/80 backdrop-blur-sm border border-gray-200/60 text-gray-700 font-semibold rounded-2xl hover:bg-gray-100/80 transition-all duration-200 shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-200" />
            <span>Feedback</span>
          </motion.button>
        </div>
      </div>

      {/* User Feedback Modal */}
      <UserFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </>
  );
};

export default ActionButtons;
