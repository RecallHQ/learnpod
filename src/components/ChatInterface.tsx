import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mic,
  ThumbsUp,
  ThumbsDown,
  Clock,
} from "lucide-react";
import { ChatMessage } from "../types";
import { submitQueryFeedback } from "../hooks/usePod";
import FeedbackModal from "./FeedbackModal";
import { useParams } from "react-router-dom";

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

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onFeedback,
  isLoading,
  onJumpToTime,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { podId } = useParams<{ podId: string }>();

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
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

  const findUserQuestion = (aiMessageId: string) => {
    const aiIndex = messages.findIndex((m) => m.id === aiMessageId);
    if (aiIndex > 0 && messages[aiIndex - 1].type === "user") {
      return messages[aiIndex - 1].question || "";
    }
    return "";
  };

  const handleThumbsDown = (messageId: string) => {
    setSelectedMessageId(messageId);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = (feedbackText: string, category: string) => {
    if (!selectedMessageId) return;

    const aiMessage = messages.find((m) => m.id === selectedMessageId);
    if (!aiMessage) return;

    // Update UI state first
    onFeedback(selectedMessageId, "dislike", feedbackText, category);

    // Submit to backend
    submitQueryFeedback({
      knowledge_base_id: Number(podId),
      query: findUserQuestion(selectedMessageId),
      response: aiMessage.answer || "",
      thumbs_up: false,
      comments: `Category: ${category}\nFeedback: ${feedbackText}`,
    }).catch((error) => {
      console.error("Feedback submission error:", error);
    });

    setFeedbackModalOpen(false);
    setSelectedMessageId("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-muted/30 p-4 rounded-t-lg">
        <h3 className="font-semibold text-foreground text-lg">Ask Questions</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Get answers about the video content
        </p>
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-3"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#9ca3af #f3f4f6',
        }}
      >
        <style>{`
          .scrollbar-thin::-webkit-scrollbar {
            width: 8px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: #f3f4f6;
            border-radius: 4px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: #9ca3af;
            border-radius: 4px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
          }
        `}</style>
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
                <div>
                  <p className="text-sm leading-relaxed max-w-md lg:max-w-lg">{message.question}</p>
                  <div className="mt-2 flex justify-end max-w-md lg:max-w-lg">
                    <span className="text-xs text-gray-400 bg-white/10 px-3 py-1.5 rounded-full">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ) : (
                // AI message
                message.answer && (
                  <div className="max-w-md lg:max-w-lg bg-muted rounded-2xl px-4 py-3 shadow-sm border border-border">
                    <div className="text-sm text-foreground leading-relaxed mb-3">
                      <span>{message.answer}</span>
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
                              className="flex items-center text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors duration-200 mb-3"
                            >
                              <Clock className="w-3 h-3 mr-1.5" />
                              {formatTime(timeInSeconds)}
                            </button>
                          );
                        }
                        return null;
                      })()}

                    {/* Feedback Buttons */}
                    {!isLoading && message.answer && (
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
                    )}
                  </div>
                )
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Simplified Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-muted rounded-2xl px-4 py-3 shadow-sm border border-border max-w-sm">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-primary rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  Thinking...
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-muted/30 rounded-b-lg"
      >
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your question here..."
              className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <button
            type="button"
            onClick={handleVoiceRecord}
            className={`p-3 rounded-xl transition-colors duration-200 ${
              isRecording
                ? "bg-red-600 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
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
