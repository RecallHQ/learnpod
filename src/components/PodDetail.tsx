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
    console.log('Setting up video update callback');
    if (onVideoUpdate) {
      onVideoUpdate((videoPath: string, timestamp: string) => {
        console.log("Immediate video update callback called:", videoPath, timestamp);
        const newVideoUrl = getPublicVideoUrl(videoPath);
        console.log("New video URL:", newVideoUrl);
        console.log("Current video URL:", currentVideoUrl);
        
        const timeInSeconds = parseFloat(timestamp);
        console.log("Parsed timestamp:", timeInSeconds);
        
        if (newVideoUrl !== currentVideoUrl) {
          console.log("Video URL changed, switching video");
          setCurrentVideoUrl(newVideoUrl);
          setIsVideoReady(false);
          // Store the timestamp for later seeking after video loads
          if (!isNaN(timeInSeconds) && timeInSeconds > 0) {
            console.log("Setting pending seek to:", timeInSeconds);
            setPendingSeek({ time: timeInSeconds, videoPath });
          }
        } else {
          console.log("Same video URL, executing seek immediately");
          // Same video, seek immediately
          if (!isNaN(timeInSeconds) && timeInSeconds > 0) {
            console.log("Setting jumpToTime immediately to:", timeInSeconds);
            setJumpToTime(timeInSeconds);
            setTimeout(() => {
              console.log("Clearing jumpToTime");
              setJumpToTime(undefined);
            }, 100);
          } else {
            console.log("Invalid timestamp, not seeking");
          }
        }
      });
    } else {
      console.log("ERROR: onVideoUpdate is null!");
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
    console.log("Pending seek:", pendingSeek);
    setIsVideoReady(true);

    // Execute pending seek if there is one
    if (pendingSeek) {
      console.log("Executing pending seek to:", pendingSeek.time);
      setTimeout(() => {
        console.log("Setting jumpToTime to:", pendingSeek.time);
        setJumpToTime(pendingSeek.time);
        setTimeout(() => {
          console.log("Clearing jumpToTime");
          setJumpToTime(undefined);
        }, 100);
        setPendingSeek(null);
      }, 200);
    } else {
      console.log("No pending seek to execute");
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
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-lg border-b border-border/30 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={onBack}
              className="flex items-center px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 group"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Back to Pods</span>
            </motion.button>

            <div className="flex items-center space-x-3">
              <motion.button
                onClick={handleShare}
                className="flex items-center px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg border border-primary/20 transition-all duration-200"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
          {/* Left Column - Video and Info */}
          <div className="xl:col-span-2 flex flex-col">
            {/* Video Player */}
            <div className="bg-muted/50 rounded-2xl overflow-hidden border border-border">
              <VideoPlayer
                videoUrl={currentVideoUrl}
                jumpToTime={jumpToTime}
                onVideoReady={handleVideoReady}
              />
            </div>

            {/* Pod Info */}
            <div className="bg-card rounded-2xl p-6 border border-border flex-1 mt-6">
              <h1 className="text-2xl xl:text-3xl font-bold text-foreground mb-4 leading-tight">
                {podData.title}
              </h1>

              {/* Tags */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  {podData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-muted text-muted-foreground px-4 py-2 rounded-full text-sm font-medium border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center px-3 py-1.5 rounded-full border">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    podData.status === 'ready' ? 'bg-green-500' : 
                    podData.status === 'processing' ? 'bg-yellow-500' : 
                    podData.status === 'error' ? 'bg-red-500' : 'bg-green-500'
                  }`} />
                  <span className="text-sm font-medium capitalize">
                    {podData.status === 'ready' ? 'Ready' : 
                     podData.status === 'processing' ? 'In Progress' : 
                     podData.status === 'error' ? 'Error' : 'Ready'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Chat */}
          <div className="xl:col-span-1 h-full">
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
