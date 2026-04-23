import { useState, useCallback } from "react";
import { ChatMessage } from "../types";
import { queryPodStreaming, submitQueryFeedback } from "../hooks/usePod";

export const useChat = (id: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [videoUpdateCallback, setVideoUpdateCallback] = useState<((videoPath: string, timestamp: string) => void) | null>(null);

  const sendMessage = useCallback(
    async (question: string) => {
      if (!question.trim()) return;

      const userMessage: ChatMessage = {
        type: "user",
        question,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Create a placeholder AI message that will be updated with streaming content
      const aiMessageId = `assistant-${Date.now()}`;
      const initialAiMessage: ChatMessage = {
        id: aiMessageId,
        type: "ai",
        answer: "",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, initialAiMessage]);

      try {
        let hasReceivedFirstChunk = false;
        
        await queryPodStreaming(id, question, (chunk) => {
          console.log('Received chunk:', chunk);
          console.log('start_time from chunk:', chunk.start_time);
          console.log('videoUpdateCallback exists:', !!videoUpdateCallback);
          
          // Handle immediate video update from first chunk
          if (!hasReceivedFirstChunk && chunk.video_path && chunk.start_time !== undefined) {
            console.log('First chunk received, updating video immediately:', chunk.video_path, chunk.start_time);
            if (videoUpdateCallback) {
              console.log('Calling videoUpdateCallback with:', chunk.video_path, chunk.start_time.toString());
              videoUpdateCallback(chunk.video_path, chunk.start_time.toString());
            } else {
              console.log('ERROR: videoUpdateCallback is null!');
            }
            hasReceivedFirstChunk = true;
          }
          
          // Update the message with the new chunk response
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    answer: (msg.answer || '') + chunk.response,
                    // Set video path and timestamp only from the first chunk that has them
                    videoPath: msg.videoPath || chunk.video_path,
                    timestamp: (msg.timestamp === initialAiMessage.timestamp && chunk.start_time !== undefined) ? chunk.start_time.toString() : msg.timestamp,
                  }
                : msg
            )
          );
        });
      } catch (error) {
        console.error("Error querying knowledge base:", error);
        
        // Update the placeholder message with error content
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  answer: "I'm sorry, I encountered an error while processing your question. Please try again.",
                }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [id, videoUpdateCallback]
  );

  const onVideoUpdate = useCallback((callback: (videoPath: string, timestamp: string) => void) => {
    setVideoUpdateCallback(() => callback);
  }, []);

  const submitFeedback = useCallback(
    async (
      messageId: string,
      feedback: "like" | "dislike",
      feedbackText?: string,
      category?: string
    ) => {
      const message = messages.find((msg) => msg.id === messageId);

      // Handle cases where required data might be missing
      if (!message) {
        console.error("Message not found for feedback");
        return;
      }

      // Default to pod ID if knowledgeBaseId is missing
      const knowledgeBaseId = message.knowledgeBaseId || id;

      // Get original question if available
      const originalQuestion = message.question || "Unknown question";

      // Optimistically update UI
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                feedback,
                feedbackComment: feedbackText,
              }
            : msg
        )
      );

      try {
        const feedbackData = {
          knowledge_base_id: parseInt(knowledgeBaseId, 10),
          query: originalQuestion,
          response: message.answer || "",
          thumbs_up: feedback === "like",
          comments: feedbackText,
          category: category,
        };

        await submitQueryFeedback(feedbackData);
        console.log("Feedback submitted successfully");
      } catch (error) {
        console.error("Failed to submit feedback:", error);

        // Revert UI changes on error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, feedback: undefined, feedbackComment: undefined }
              : msg
          )
        );
      }
    },
    [messages, id]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    submitFeedback,
    clearChat,
    onVideoUpdate,
  };
};
