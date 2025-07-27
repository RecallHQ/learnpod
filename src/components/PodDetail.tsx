import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Share2 } from "lucide-react";
import { PodResponseData } from "../types";
import { useChat } from "../hooks/useChat";
import VideoPlayer from "./VideoPlayer";
import ChatInterface from "./ChatInterface";
import ShareModal from "./ShareModal";
import { getPublicVideoUrl } from "../utils/getMediaUrl";
import { getPodById } from "../hooks/usePod";

interface PodDetailProps {
  id: string;
  onBack: () => void;
}

const PodDetail: React.FC<PodDetailProps> = ({ id, onBack }) => {
  const [podData, setPodData] = useState<PodResponseData | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");
  const [jumpToTime, setJumpToTime] = useState<number | undefined>();
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [pendingSeek, setPendingSeek] = useState<{
    time: number;
    videoPath?: string;
  } | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const podData = await getPodById(id);
        setPodData(podData);
        // Set initial video URL
        setCurrentVideoUrl(getPublicVideoUrl(podData.video_path));
      } catch (error) {
        console.error("Error fetching pod data:", error);
        // Handle error - could set an error state here
      }
    };
    getData();
  }, [id]);

  const {
    messages,
    sendMessage,
    submitFeedback: addFeedback,
    isLoading,
    onVideoUpdate,
  } = useChat(id);

  // Handle immediate video updates from streaming
  useEffect(() => {
    if (onVideoUpdate) {
      onVideoUpdate((videoPath: string, timestamp: string) => {
        console.log("Immediate video update:", videoPath, timestamp);
        const newVideoUrl = getPublicVideoUrl(videoPath);
        if (newVideoUrl !== currentVideoUrl) {
          setCurrentVideoUrl(newVideoUrl);
          setIsVideoReady(false);
        }

        // Store the timestamp for later seeking
        const timeInSeconds = parseFloat(timestamp);
        if (!isNaN(timeInSeconds) && timeInSeconds > 0) {
          setPendingSeek({ time: timeInSeconds, videoPath });
        }
      });
    }
  }, [onVideoUpdate, currentVideoUrl]);

  const handleJumpToTime = (time: number, videoPath?: string) => {
    console.log("Jump to time requested:", time);

    // If a specific video path is provided, switch to that video first
    if (videoPath) {
      const newVideoUrl = getPublicVideoUrl(videoPath);
      console.log("Switching to video:", newVideoUrl);

      // Store the pending seek operation
      setPendingSeek({ time, videoPath });

      // Only change video if it's different
      if (newVideoUrl !== currentVideoUrl) {
        setCurrentVideoUrl(newVideoUrl);
        setIsVideoReady(false);
      } else {
        // Same video, just seek
        setJumpToTime(time);
        setTimeout(() => setJumpToTime(undefined), 100);
        setPendingSeek(null);
      }
    } else {
      // Jump in current video
      setJumpToTime(time);
      setTimeout(() => setJumpToTime(undefined), 100);
    }
  };

  const handleVideoReady = () => {
    console.log("Video is ready for playback");
    setIsVideoReady(true);

    // Execute pending seek if there is one
    if (pendingSeek) {
      console.log("Executing pending seek to:", pendingSeek.time);
      setTimeout(() => {
        setJumpToTime(pendingSeek.time);
        setTimeout(() => setJumpToTime(undefined), 100);
        setPendingSeek(null);
      }, 200);
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  if (podData == null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Loading
        </h1>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Pods
            </button>

            <div className="flex items-center space-x-2">
              <motion.button
                onClick={handleShare}
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </motion.button>

              {/* <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {pod.category}
              </span> */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video and Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <VideoPlayer
                videoUrl={currentVideoUrl}
                jumpToTime={jumpToTime}
                onVideoReady={handleVideoReady}
              />
            </div>

            {/* Pod Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {podData.title}
              </h1>

              {/* <p className="text-gray-600 mb-4">{pod.description}</p> */}

              {/* URLs */}
              <div className="mb-4">
                {/* <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Source URLs:
                </h3> */}
                {/* <div className="space-y-2">
                  {pod.urls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <span className="text-sm truncate">{url}</span>
                    </a>
                  ))}
                </div> */}
                {podData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 px-4 py-1 rounded-lg gap-4"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Meta Info */}
              <div className="flex items-center text-sm text-gray-500">
                {/* <span>Created: {pod.createdAt.toLocaleDateString()}</span> */}
                {/* <span className="mx-2">•</span> */}
                {/* <span>{pod.interactions} interactions</span> */}
              </div>
            </div>
          </div>

          {/* Right Column - Chat */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 h-[calc(100vh-8rem)]">
              <ChatInterface
                messages={messages}
                onSendMessage={sendMessage}
                onFeedback={addFeedback}
                isLoading={isLoading}
                onJumpToTime={handleJumpToTime}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        pod={podData}
      />
    </motion.div>
  );
};

export default PodDetail;
