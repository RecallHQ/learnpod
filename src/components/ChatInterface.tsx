import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mic,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Brain,
  Search,
  Zap,
} from "lucide-react";
import { ChatMessage } from "../types";
import FeedbackModal from "./FeedbackModal";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onFeedback: (
    messageId: string,
    feedback: "like" | "dislike",
    feedbackText?: string,
    category?: string
  ) => void;
  isLoading?: boolean;
  onJumpToTime?: (time: number, videoPath?: string) => void;
}

const statusMessages = [
  { text: "Processing your question...", icon: Brain, duration: 800 },
  { text: "Searching knowledge base...", icon: Search, duration: 600 },
  { text: "Analyzing video content...", icon: Zap, duration: 700 },
  { text: "Generating response...", icon: Brain, duration: 500 },
];
const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onFeedback,
  isLoading,
  onJumpToTime,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<{
    text: string;
    icon: any;
  } | null>(null);
  const [statusIndex, setStatusIndex] = useState(0);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle status progression when loading
  useEffect(() => {
    if (isLoading) {
      setStatusIndex(0);
      setCurrentStatus(statusMessages[0]);

      const progressStatus = () => {
        let currentIndex = 0;

        const showNextStatus = () => {
          if (currentIndex < statusMessages.length && isLoading) {
            const status = statusMessages[currentIndex];
            setCurrentStatus(status);
            setStatusIndex(currentIndex);

            setTimeout(() => {
              currentIndex++;
              if (currentIndex < statusMessages.length) {
                showNextStatus();
              }
            }, status.duration);
          }
        };

        showNextStatus();
      };

      progressStatus();
    } else {
      setCurrentStatus(null);
      setStatusIndex(0);
    }
  }, [isLoading]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
  };

  const handleThumbsUp = (messageId: string) => {
    onFeedback(messageId, "like");
  };

  const handleThumbsDown = (messageId: string) => {
    setSelectedMessageId(messageId);
    setFeedbackModalOpen(true);
  };

  // Update the handleFeedbackSubmit function
  const handleFeedbackSubmit = (feedbackText: string, category: string) => {
    if (selectedMessageId) {
      onFeedback(selectedMessageId, "dislike", feedbackText, category);
    }
    setFeedbackModalOpen(false);
    setSelectedMessageId("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 rounded-t-lg">
        <h3 className="font-semibold text-gray-900">Q&A Section</h3>
        <p className="text-sm text-gray-500">
          Ask questions about the video content
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id || `message-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="space-y-3"
            >
              {message.type === "user" ? (
                // User message
                <div className="flex justify-end">
                  <div className="max-w-xs bg-blue-600 text-white rounded-lg px-4 py-2">
                    <p className="text-sm">{message.question}</p>
                    <p className="text-xs text-blue-100 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ) : (
                // AI message
                <div className="flex justify-start">
                  <div className="max-w-sm bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-800 mb-2">
                      <span>{message.answer}</span>
                      {/* Show typing indicator if message is being streamed */}
                      {isLoading &&
                        index === messages.length - 1 &&
                        message.type === "ai" && (
                          <motion.span
                            className="inline-block ml-1"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            ▋
                          </motion.span>
                        )}
                    </div>

                    {/* Video Timestamp */}
                    {message.timestamp &&
                      !isLoading &&
                      (() => {
                        // Try to parse timestamp as number (seconds)
                        const timeInSeconds = parseFloat(message.timestamp);
                        if (!isNaN(timeInSeconds) && timeInSeconds > 0) {
                          return (
                            <button
                              onClick={() => {
                                console.log("Jumping to time:", timeInSeconds);
                                onJumpToTime?.(
                                  timeInSeconds,
                                  message.videoPath
                                );
                              }}
                              className="flex items-center text-xs text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-2"
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {`Jump to ${formatTime(timeInSeconds)}`}
                            </button>
                          );
                        }
                        return null;
                      })()}

                    {/* Alternative: Show start_time if available in message */}
                    {message.videoPath && !message.timestamp && !isLoading && (
                      <button
                        onClick={() => {
                          // If we have video path but no timestamp, jump to beginning
                          console.log("Jumping to video start");
                          onJumpToTime?.(0, message.videoPath);
                        }}
                        className="flex items-center text-xs text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-2"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        Jump to video
                      </button>
                    )}

                    {/* Feedback Buttons */}
                    {!isLoading && message.answer && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onFeedback(message.id!, "like")}
                            className={`p-1 rounded transition-colors duration-200 ${
                              message.feedback === "like"
                                ? "text-green-600 bg-green-50"
                                : "text-gray-400 hover:text-green-600"
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleThumbsDown(message.id!)}
                            className={`p-1 rounded transition-colors duration-200 ${
                              message.feedback === "dislike"
                                ? "text-red-600 bg-red-50"
                                : "text-gray-400 hover:text-red-600"
                            }`}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Enhanced Loading with Status Messages */}
        {isLoading && currentStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-start"
          >
            <motion.div
              className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200 max-w-sm"
              key={statusIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                {/* Animated Status Icon */}
                <motion.div
                  className="flex-shrink-0"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  <currentStatus.icon className="w-4 h-4 text-blue-600" />
                </motion.div>

                {/* Status Text with Typing Effect */}
                <motion.span
                  className="text-sm text-gray-600 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStatus.text}
                </motion.span>

                {/* Subtle Progress Dots */}
                <div className="flex space-x-1 ml-auto">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white border-t border-gray-200 rounded-b-lg"
      >
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question about the video..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="button"
            onClick={handleVoiceRecord}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isRecording
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
        messageId={selectedMessageId}
      />
    </div>
  );
};

export default ChatInterface;
