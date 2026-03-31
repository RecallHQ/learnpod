import React from "react";

const VideoDemo: React.FC = () => {
  return (
    <section
      id="learnpod-action"
      className="max-w-6xl mx-auto px-4 pb-20 pt-6"
      aria-label="Video demonstration"
    >
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/70 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.7)] p-6 sm:p-8 backdrop-blur">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--app-fg)]">
            See it in Action
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            A quick walkthrough of conversational search, timestamp answers, and
            interactive knowledge layers.
          </p>
        </div>
        <div className="mt-6">
          <video
            className="w-full rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-950/5"
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
            poster="/videos/demo-poster.jpg"
          >
            <source src="/videos/demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};

export default VideoDemo;
