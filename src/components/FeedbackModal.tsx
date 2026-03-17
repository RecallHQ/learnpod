import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Send, CheckCircle } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string, category: string) => void;
  messageId: string;
}

const feedbackCategories = [
  { 
    value: 'incorrect', 
    label: 'Incorrect information',
    description: 'The response contains factual errors'
  },
  { 
    value: 'irrelevant', 
    label: 'Not relevant',
    description: 'Doesn\'t answer my question'
  },
  { 
    value: 'unclear', 
    label: 'Unclear or confusing',
    description: 'Hard to understand or poorly explained'
  },
  { 
    value: 'incomplete', 
    label: 'Incomplete',
    description: 'Missing important information'
  },
  { 
    value: 'other', 
    label: 'Something else',
    description: 'Other issue not listed above'
  }
];

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmit, messageId }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit(feedbackText, selectedCategory);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Auto close after showing success
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setSelectedCategory('');
    setFeedbackText('');
    setIsSubmitted(false);
    onClose();
  };

  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/45 dark:bg-black/65 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative liquid-glass-panel text-[var(--app-fg)] rounded-3xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {!isSubmitted ? (
              <>
                {/* Header */}
                <div className="relative px-6 pt-6 pb-4 flex-shrink-0">
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-slate-400 dark:text-slate-300" />
                  </button>
                  
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-[#1e90ff]/20 dark:bg-[#1e90ff]/25 border border-[#1e90ff]/35 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-[#1e90ff]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--app-fg)]">Help us improve</h2>
                    </div>
                  </div>
                  <p className="text-[var(--app-muted)] text-sm ml-[3.25rem]">
                    What could we have done better with this response?
                  </p>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto">
                  <form onSubmit={handleSubmit} className="px-6 pb-6" data-message-id={messageId}>
                  {/* Category Selection */}
                  <div className="mb-6">
                    <div className="space-y-2">
                      {feedbackCategories.map((category) => (
                        <motion.button
                          key={category.value}
                          type="button"
                          onClick={() => handleCategorySelect(category.value)}
                          className={`w-full text-left p-4 border-2 rounded-xl transition-all duration-200 ${
                            selectedCategory === category.value
                              ? 'border-orange-500 bg-orange-50/90 dark:bg-orange-500/15 shadow-sm'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                                {category.label}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {category.description}
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-3 mt-0.5 ${
                              selectedCategory === category.value
                                ? 'border-orange-500 bg-orange-500'
                                : 'border-slate-300 dark:border-slate-600'
                            }`}>
                              {selectedCategory === category.value && (
                                <motion.div
                                  className="w-2 h-2 bg-white rounded-full"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                />
                              )}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Feedback - Only show if category selected */}
                  <AnimatePresence>
                    {selectedCategory && (
                      <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                          Tell us more (optional)
                        </label>
                        <textarea
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 text-slate-900 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200"
                          placeholder="What specifically could be improved?"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions */}
                  <div className="flex gap-3 sticky bottom-0 liquid-glass-panel border-t border-white/10 pt-4 -mx-6 px-6">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 px-6 py-3 text-slate-700 dark:text-slate-200 font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      disabled={!selectedCategory || isSubmitting}
                      className="flex-1 px-6 py-3 bg-[#1e90ff] text-white liquid-glass-btn liquid-glass-btn--accent font-medium rounded-xl transition-all duration-200 flex items-center justify-center"
                      whileHover={!selectedCategory || isSubmitting ? {} : { scale: 1.02 }}
                      whileTap={!selectedCategory || isSubmitting ? {} : { scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="w-4 h-4 mr-2" />
                          Send feedback
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
                  Your input helps us improve our AI responses.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
