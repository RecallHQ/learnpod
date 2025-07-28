import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Check,
  Share2,
  Link,
  Twitter,
  Facebook,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Pod } from "../types";
import { getPublicImageUrl } from "../utils/getMediaUrl";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  pod: Pod;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, pod }) => {
  const [shareUrl, setShareUrl] = useState("");
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  // Generate shareable URL
  useEffect(() => {
    if (isOpen && pod) {
      setIsGeneratingLink(true);
      // Simulate API call to generate shareable link
      setTimeout(() => {
        const baseUrl = window.location.origin;
        const shareableUrl = `${baseUrl}/pod/${pod.id}?share=true`;
        setShareUrl(shareableUrl);
        setIsGeneratingLink(false);
      }, 800);
    }
  }, [isOpen, pod]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [type]: true }));

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const shareOptions = [
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => {
        const text = `Check out this amazing learning pod: "${pod.title}" on VideoIndex!`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, "_blank");
      },
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        window.open(url, "_blank");
      },
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-gray-600 hover:bg-gray-700",
      action: () => {
        const subject = `Check out this learning pod: ${pod.title}`;
        const body = `I found this interesting learning pod on VideoIndex that I thought you might like:\n\n"${pod.title}"\n${pod.description}\n\nCheck it out here: ${shareUrl}`;
        const url = `mailto:?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`;
        window.open(url);
      },
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      action: () => {
        const text = `Check out this learning pod: "${pod.title}" on VideoIndex! ${shareUrl}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
      },
    },
  ];

  const handleClose = () => {
    setCopiedStates({});
    setShareUrl("");
    onClose();
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Share Pod
                  </h2>
                </div>
              </div>
              <p className="text-gray-600 text-sm ml-13">
                Share "{pod.title}" with others
              </p>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              {/* Pod Preview */}
              <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-start space-x-3">
                  <img
                    src={getPublicImageUrl(pod.image)}
                    alt={pod.title}
                    className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                      {pod.title}
                    </h3>
                    {/* <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                      {pod.description}
                    </p> */}
                    <div className="flex items-center mt-2 text-xs text-gray-400">
                      <span>{pod.queries} interactions</span>
                      {/* <span className="mx-2">•</span>
                      <span>{pod.followers} followers</span> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Link */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Share Link
                </label>
                <div className="relative">
                  {isGeneratingLink ? (
                    <div className="flex items-center justify-center py-3 px-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                        <span className="text-sm text-gray-600">
                          Generating link...
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 relative">
                        <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={shareUrl}
                          readOnly
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <motion.button
                        onClick={() => copyToClipboard(shareUrl, "link")}
                        className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <AnimatePresence mode="wait">
                          {copiedStates.link ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="flex items-center space-x-1"
                            >
                              <Check className="w-4 h-4" />
                              <span className="text-sm">Copied!</span>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="copy"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="flex items-center space-x-1"
                            >
                              <Copy className="w-4 h-4" />
                              <span className="text-sm">Copy</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Share Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Share on Social Media
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {shareOptions.map((option) => (
                    <motion.button
                      key={option.name}
                      onClick={option.action}
                      disabled={isGeneratingLink}
                      className={`flex items-center justify-center space-x-2 py-3 px-4 ${option.color} text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                      whileHover={!isGeneratingLink ? { scale: 1.02 } : {}}
                      whileTap={!isGeneratingLink ? { scale: 0.98 } : {}}
                    >
                      <option.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{option.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Public Sharing
                    </p>
                    <p className="text-xs text-blue-700">
                      Anyone with this link can view the pod and its content.
                      The link will remain active as long as the pod exists.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
