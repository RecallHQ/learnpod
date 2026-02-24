import React from "react";

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  variant?: "overlay" | "solid";
}

const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  variant = "overlay",
}) => {
  const headerClass =
    variant === "solid"
      ? "bg-[var(--app-surface)]/90 backdrop-blur-md border-b border-[var(--app-border)] shadow-sm"
      : "bg-transparent";

  const toggleClass =
    variant === "solid"
      ? "border border-[var(--app-border)] bg-[var(--app-surface)]/80 hover:border-gray-400"
      : "border border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/15";

  return (
    <header className={`w-full transition-colors duration-300 ${headerClass}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg sm:text-xl font-black tracking-[0.05em] uppercase text-[var(--app-fg)]">
            LearnPod
          </span>

        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          aria-pressed={isDarkMode}
          className={`h-10 w-10 rounded-full shadow-sm backdrop-blur-md flex items-center justify-center text-[var(--app-fg)] transition-colors ${toggleClass}`}
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
