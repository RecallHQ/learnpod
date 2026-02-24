import React from "react";

const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logoo.png" alt="LearnPod logo" className="h-8 w-auto" />
          <span className="text-lg font-semibold text-gray-900">
            LearnPod
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsDarkMode((prev) => !prev)}
          aria-label="Toggle theme"
          className="h-10 w-10 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center text-gray-700 hover:text-gray-900 hover:border-gray-300 transition-colors"
        >
          {isDarkMode ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 1 0 9.8 9.8Z" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
