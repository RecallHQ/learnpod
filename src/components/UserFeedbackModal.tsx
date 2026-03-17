import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MessageSquare,
  Star,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { UserFeedbackFormData } from "../types";
import { feedback } from "../hooks/usePod";

interface UserFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFeedbackFormData) => void;
}

const feedbackCategories = [
  {
    value: "bug",
    label: "Bug Report",
    description: "Report a technical issue or error",
  },
  {
    value: "feature",
    label: "Feature Request",
    description: "Suggest a new feature or improvement",
  },
  {
    value: "ui",
    label: "UI/UX Feedback",
    description: "Comments on design and user experience",
  },
  {
    value: "performance",
    label: "Performance",
    description: "Issues with speed or responsiveness",
  },
  {
    value: "content",
    label: "Content Quality",
    description: "Feedback on video content or accuracy",
  },
  {
    value: "general",
    label: "General Feedback",
    description: "Other comments or suggestions",
  },
];

const UserFeedbackModal: React.FC<UserFeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<UserFeedbackFormData>({
    name: "",
    email: "",
    rating: 0,
    category: "",
    feedback: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<UserFeedbackFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFeedbackFormData> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (formData.rating === 0) newErrors.rating = "Rating is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.feedback.trim()) newErrors.feedback = "Feedback is required";
    else if (formData.feedback.length > 500)
      newErrors.feedback = "Feedback must be 500 characters or less";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Prepare data for API (note: API expects "comments" instead of "feedback")
      const apiData = {
        name: formData.name,
        email: formData.email,
        rating: formData.rating,
        category: formData.category,
        comments: formData.feedback,
      };

      // Call the actual API
      const result = await feedback(apiData);

      if (result.success) {
        onSubmit(formData);
        setIsSubmitted(true);
      } else {
        setSubmissionError("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      setSubmissionError("An error occurred while submitting your feedback.");
      console.error("Feedback submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", rating: 0, category: "", feedback: "" });
    setErrors({});
    setIsSubmitted(false);
    setIsSubmitting(false);
    setHoveredStar(0);
    onClose();
  };

  const handleStarClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleStarHover = (rating: number) => {
    setHoveredStar(rating);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isActive = starNumber <= (hoveredStar || formData.rating);

      return (
        <motion.button
          key={starNumber}
          type="button"
          onClick={() => handleStarClick(starNumber)}
          onMouseEnter={() => handleStarHover(starNumber)}
          onMouseLeave={handleStarLeave}
          className={`p-1 transition-colors duration-200 ${
            isActive
              ? "text-yellow-400"
              : "text-slate-300 dark:text-slate-600 hover:text-yellow-300 dark:hover:text-yellow-400"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Star className={`w-6 h-6 ${isActive ? "fill-current" : ""}`} />
        </motion.button>
      );
    });
  };

  const getRatingText = (rating: number): string => {
    const texts = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
    return texts[rating] || "";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/45 dark:bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="liquid-glass-panel text-[var(--app-fg)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {!isSubmitted ? (
              <>
                {/* Header */}
                <div className="flex-shrink-0 px-6 py-4 border-b border-[var(--app-border)]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#1e90ff]/20 dark:bg-[#1e90ff]/25 border border-[#1e90ff]/35 rounded-xl flex items-center justify-center mr-3">
                        <MessageSquare className="w-5 h-5 text-[#1e90ff]" />
                      </div>
                      <h2 className="text-xl font-semibold text-[var(--app-fg)]">
                        Share Your Feedback
                      </h2>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-2 rounded-lg liquid-glass-btn text-slate-900 dark:text-white"
                    >
                      <X className="w-5 h-5 text-slate-500 dark:text-slate-300" />
                    </button>
                  </div>
                  <p className="text-[var(--app-muted)] text-sm ml-[3.25rem]">
                    Help us improve VideoIndex with your thoughts and
                    suggestions
                  </p>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto mt-4">
                  <form onSubmit={handleSubmit} className="px-6 pb-6">
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Your name"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Overall Rating *
                      </label>
                      <div className="flex items-center space-x-1 mb-2">
                        {renderStars()}
                      </div>
                      {(formData.rating > 0 || hoveredStar > 0) && (
                        <motion.p
                          className="text-sm text-[var(--app-muted)] ml-1"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {getRatingText(hoveredStar || formData.rating)}
                        </motion.p>
                      )}
                      {errors.rating && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.rating}
                        </p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Category *
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {feedbackCategories.map((category) => (
                          <motion.button
                            key={category.value}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                category: category.value,
                              }))
                            }
                            className={`text-left p-3 border-2 rounded-xl transition-all duration-200 ${
                              formData.category === category.value
                                ? "border-blue-500 bg-blue-50/90 dark:bg-blue-500/15 shadow-sm"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/70"
                            }`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="font-medium text-slate-900 dark:text-slate-100 text-sm mb-1">
                              {category.label}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {category.description}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.category}
                        </p>
                      )}
                    </div>

                    {/* Feedback Text */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Your Feedback *
                      </label>
                      <textarea
                        value={formData.feedback}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            feedback: e.target.value,
                          }))
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                        placeholder="Please share your thoughts, suggestions, or report any issues you've encountered..."
                      />
                      <div className="flex justify-between items-center mt-1">
                        {errors.feedback ? (
                          <p className="text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.feedback}
                          </p>
                        ) : (
                          <div />
                        )}
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {formData.feedback.length}/500
                        </span>
                      </div>
                    </div>

                    {submissionError && (
                      <p className="mb-4 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {submissionError}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 sticky bottom-0 liquid-glass-panel border-t border-white/10 pt-4 -mx-6 px-6">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 px-6 py-3 liquid-glass-btn text-slate-900 dark:text-white font-medium rounded-xl"
                      >
                        Cancel
                      </button>
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 liquid-glass-btn liquid-glass-btn--accent text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center"
                        whileHover={isSubmitting ? {} : { scale: 1.02 }}
                        whileTap={isSubmitting ? {} : { scale: 0.98 }}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            Sending...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Send className="w-4 h-4 mr-2" />
                            Send Feedback
                          </div>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              /* Success State */
              <motion.div
                className="p-8 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-16 h-16 bg-green-100 dark:bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </motion.div>
                <h3 className="text-lg font-semibold text-[var(--app-fg)] mb-2">
                  Thank you for your feedback!
                </h3>
                <p className="text-[var(--app-muted)] text-sm">
                  We appreciate you taking the time to help us improve
                  VideoIndex.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserFeedbackModal;
