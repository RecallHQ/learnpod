import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, AlertCircle } from "lucide-react";
import { CreatePodFormData } from "../types";
import { createPod } from "../hooks/usePod";

interface CreatePodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePodFormData) => void;
}

const CreatePodModal: React.FC<CreatePodModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CreatePodFormData>({
    title: "",
    // description: "",
    urls: [""],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Pod title is required";
    }

    // if (!formData.description.trim()) {
    //   newErrors.description = "Description is required";
    // }

    const validUrls = formData.urls.filter((url) => url.trim());
    if (validUrls.length === 0) {
      newErrors.urls = "At least one URL is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Call API to create pod
      await createPod({
        title: formData.title,
        urls: formData.urls.filter((url) => url.trim()),
      });

      // On success, call parent handler
      onSubmit({
        ...formData,
        urls: formData.urls.filter((url) => url.trim()),
      });

      // Reset form
      setFormData({ title: "", urls: [""] });
      setErrors({});
    } catch (error) {
      console.error("Pod creation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addUrlField = () => {
    setFormData((prev) => ({ ...prev, urls: [...prev.urls, ""] }));
  };

  const removeUrlField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      urls: prev.urls.filter((_, i) => i !== index),
    }));
  };

  const updateUrl = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      urls: prev.urls.map((url, i) => (i === index ? value : url)),
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Create New Pod
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pod Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your pod title..."
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              {/* <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe what this pod is about..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </p>
                )}
              </div> */}

              {/* URLs */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URLs *
                </label>
                <div className="space-y-3">
                  {formData.urls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateUrl(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      {formData.urls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeUrlField(index)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addUrlField}
                  className="mt-3 flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add another URL
                </button>

                {errors.urls && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.urls}
                  </p>
                )}
              </div>

              {/* Warning */}
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Public Visibility
                    </p>
                    <p className="text-sm text-yellow-700">
                      This pod will be publicly visible to all users. Make sure
                      you're comfortable sharing this content.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? "Creating..." : "Create Pod"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePodModal;
