import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="relative">
          <Search className="absolute  left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search pods..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full placeholder:text-sm pl-4 py-3 bg-gray-50/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

          {/* Enhanced Search Input with Gradient Border */}
          <div className="relative">
            {/* Gradient Border Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-[2px] opacity-60 group-hover:opacity-80 group-focus-within:opacity-100 transition-all duration-300">
              <div className="w-full h-full bg-white rounded-3xl"></div>
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search learning pods with AI precision..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="relative w-full pl-12 pr-16 py-4 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 backdrop-blur-md rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:bg-gradient-to-r focus:from-blue-100/90 focus:via-indigo-100/90 focus:to-purple-100/90 hover:bg-gradient-to-r hover:from-blue-100/70 hover:via-indigo-100/70 hover:to-purple-100/70 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-lg hover:shadow-xl focus:shadow-2xl text-lg font-medium border-0"
            />
          </div>

          {/* Animated Search Glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-all duration-500 pointer-events-none blur-sm" />

          {/* Search Enhancement Icon */}
          <motion.div
            className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-all duration-300"
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: searchQuery ? 1 : 0,
              rotate: searchQuery ? 360 : 0,
            }}
            transition={{ duration: 0.4, type: "spring" }}
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Floating Search Suggestions Hint */}
          {!searchQuery && (
            <motion.div
              className="absolute right-16 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-1 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-full">
                <span>Try "React" or "JavaScript"</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
