import React, { useState, useMemo, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import { Pod, PodResponseData } from "./types";
import Hero from "./components/Hero";
import UserFeedbackModal from "./components/UserFeedbackModal";
// import SearchFilter from "./components/SearchFilter";
import PodGrid from "./components/PodGrid";
import PodDetail from "./components/PodDetail";
import PerformanceDebugger from "./components/PerformanceDebugger";
import ShareModal from "./components/ShareModal";
import { getPodById } from "./hooks/usePod";
import { getUserSessionId } from "./utils/cookieUtils";
import SearchBar from "./components/SearchBar";
import FeatureDeck from "./components/FeatureDeck";
import DummyComponent from "./components/DummyComponent";
import VideoDemo from "./components/VideoDemo";

// Shared Pod Page Component
const SharedPodPage: React.FC = () => {
  const { podId } = useParams<{ podId: string }>();
  const navigate = useNavigate();
  const [pod, setPod] = useState<PodResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPod = async () => {
      if (!podId) {
        setError("No pod ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const podData = await getPodById(podId);
        setPod(podData);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error("Error fetching pod:", err);
        setError("Pod not found or failed to load");
      } finally {
        setLoading(false);
      }
    };

    fetchPod();
  }, [podId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Pod...
          </h1>
          <p className="text-gray-600">
            Please wait while we fetch the pod details.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Pod Not Found"}
          </h1>
          <p className="text-gray-600 mb-6">
            {error === "No pod ID provided"
              ? "No pod ID was provided in the URL."
              : "The pod you're looking for doesn't exist or failed to load."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return <PodDetail id={pod!.id} onBack={() => navigate("/")} />;
};

// Home Page Component
interface HomePageProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
  isDarkMode,
  onToggleTheme,
}) => {
  const navigate = useNavigate();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const featuredRef = useRef<HTMLDivElement | null>(null);
  const [pods, setPods] = useState<Pod[]>([
    {
      id: "pod-1",
      title: "Mastering React Hooks in 25 Minutes",
      tags: ["React", "Hooks", "Frontend"],
      image:
        "/home/azureuser/recallstore/recall-api/../recallhq/learnpod_static/placeholder.jpg",
      queries: 124,
      views: 310,
      status: "ready",
    },
    {
      id: "pod-2",
      title: "Python for Data Analysis: Pandas Power Tips",
      tags: ["Python", "Data", "Pandas"],
      image:
        "/home/azureuser/recallstore/recall-api/../recallhq/learnpod_static/placeholder.jpg",
      queries: 98,
      views: 245,
      status: "ready",
    },
    {
      id: "pod-3",
      title: "Design Systems: From Tokens to Components",
      tags: ["Design", "UX", "Systems"],
      image:
        "/home/azureuser/recallstore/recall-api/../recallhq/learnpod_static/placeholder.jpg",
      queries: 57,
      views: 180,
      status: "ready",
    },
    {
      id: "pod-4",
      title: "Intro to Machine Learning Concepts for Builders",
      tags: ["ML", "Foundations", "AI"],
      image:
        "/home/azureuser/recallstore/recall-api/../recallhq/learnpod_static/placeholder.jpg",
      queries: 76,
      views: 222,
      status: "ready",
    },
    {
      id: "pod-5",
      title: "Next.js App Router Deep Dive",
      tags: ["Next.js", "Routing", "SSR"],
      image:
        "/home/azureuser/recallstore/recall-api/../recallhq/learnpod_static/placeholder.jpg",
      queries: 132,
      views: 355,
      status: "ready",
    },
    {
      id: "pod-6",
      title: "Building Accessible Interfaces That Scale",
      tags: ["Accessibility", "UI", "WCAG"],
      image:
        "/home/azureuser/recallstore/recall-api/../recallhq/learnpod_static/placeholder.jpg",
      queries: 41,
      views: 120,
      status: "ready",
    },
    {
      id: "pod-7",
      title: "TypeScript Patterns for Real-World Apps",
      tags: ["TypeScript", "Patterns", "Code"],
      image:
        "/home/azureuser/recallstore/recall-api/../recallhq/learnpod_static/placeholder.jpg",
      queries: 66,
      views: 198,
      status: "ready",
    },
    {
      id: "pod-8",
      title: "Product Strategy: Turning Insights into Roadmaps",
      tags: ["Product", "Strategy", "Growth"],
      image:
        "/home/azureuser/recallstore/recall-api/../recallhq/learnpod_static/placeholder.jpg",
      queries: 52,
      views: 142,
      status: "ready",
    },
    {
      id: "pod-9",
      title: "Figma to Code: Prototyping That Ships",
      tags: ["Figma", "Prototyping", "Design"],
      image:
        "/home/azureuser/recallstore/recall-api/../recallhq/learnpod_static/placeholder.jpg",
      queries: 89,
      views: 271,
      status: "ready",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [shareModalPod, setShareModalPod] = useState<Pod | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const prefersReducedMotion = useReducedMotion();

  // NOTE: API fetching is paused while we use mock data.
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [podsData, usageResponse] = await Promise.all([
  //         getPods(),
  //         getUsage(),
  //       ]);

  //       setUsageData(usageResponse);

  //       // Merge query counts with pods
  //       const mergedPods = podsData.map((pod) => {
  //         const usageKey = `pod_${pod.id}`;
  //         const queryCount = usageResponse[usageKey]?.queries || 0;
  //         const viewsCount = usageResponse[usageKey]?.views || 0;

  //         return {
  //           ...pod,
  //           queries: queryCount,
  //           views: viewsCount,
  //         };
  //       });

  //       setPods(mergedPods);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // Filter and sort pods
  const filteredPods = useMemo(() => {
    return pods.filter((pod) =>
      pod.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pods, searchQuery]);

  const handleExplorePods = () => {
    featuredRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const handlePodClick = (pod: Pod) => {
    if (pod.status != "processing") {
      navigate(`/pod/${pod.id}`);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle pod following
  const handleToggleFollow = (podId: string) => {
    setPods((prev) =>
      prev.map((pod) =>
        pod.id === podId
          ? {
            ...pod,
            //isFollowing: !pod.isFollowing,
            //followers: pod.isFollowing ? pod.followers - 1 : pod.followers + 1
          }
          : pod
      )
    );
  };

  // Handle pod sharing
  const handlePodShare = (pod: Pod) => {
    setShareModalPod(pod);
  };

  // if (pods == null) {
  //   return (

  //   );
  // }

  return (
    <>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 1, height: "auto" }}
        transition={{ duration: 0.5 }}
      >
        <Hero
          onCreatePod={handleExplorePods}
          isDarkMode={isDarkMode}
          onToggleTheme={onToggleTheme}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
        />
      </motion.div>

      <section ref={featuredRef} className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--app-fg)]">
              Featured Pods
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Curated picks to get you learning faster.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsSearchVisible((prev) => !prev)}
            className="inline-flex items-center justify-center h-11 w-11 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 shadow-sm transition hover:bg-white hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1e90ff]/70"
            aria-label={
              isSearchVisible ? "Hide search" : "Show search"
            }
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {isSearchVisible && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.35 }}
          >
            <SearchBar onSearch={handleSearch} />
          </motion.div>
        )}

        <div className="mt-8">
          <PodGrid
            pods={filteredPods}
            onPodClick={handlePodClick}
            onToggleFollow={handleToggleFollow}
            onShare={handlePodShare}
          />
        </div>
      </section>

      <VideoDemo />
      <FeatureDeck />

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/70 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.7)] p-6 sm:p-8 backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--app-fg)]">
                Help shape the next pods
              </h2>
              <p className="text-sm sm:text-base text-slate-500 mt-2">
                Share what you want to learn next. Your input drives new pods, stronger semantic search, and sharper timestamp answers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFeedbackOpen(true)}
              className="inline-flex items-center justify-center rounded-full liquid-glass-btn bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-6 py-3 text-sm font-semibold"
            >
              Share Feedback
            </button>
          </div>
        </div>
      </section>
      <DummyComponent />

      <UserFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={() => setIsFeedbackOpen(false)}
      />
      {/* Share Modal */}
      {shareModalPod && (
        <ShareModal
          isOpen={!!shareModalPod}
          onClose={() => setShareModalPod(null)}
          pod={shareModalPod}
        />
      )}
    </>
  );
};

function App() {
  const [showPerformanceDebugger, setShowPerformanceDebugger] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") return true;
    if (storedTheme === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const sessionId = getUserSessionId();
    console.log("User Session ID:", sessionId);
  }, []);

  // Performance debugging toggle (for development)
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        setShowPerformanceDebugger((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const root = document.documentElement;
    let rafId = 0;
    let currentX = window.innerWidth * 0.5;
    let currentY = window.innerHeight * 0.35;
    let targetX = currentX;
    let targetY = currentY;

    const setVars = (x: number, y: number) => {
      root.style.setProperty("--mouse-x", `${x}px`);
      root.style.setProperty("--mouse-y", `${y}px`);
    };

    setVars(currentX, currentY);

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;

      if (prefersReducedMotion) {
        currentX = targetX;
        currentY = targetY;
        setVars(currentX, currentY);
      }
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      setVars(currentX, currentY);
      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    if (!prefersReducedMotion) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-fg)] relative overflow-hidden">
      <div className="mouse-glow" aria-hidden="true" />
      <div className="app-content">
        <PerformanceDebugger enabled={showPerformanceDebugger} />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                isDarkMode={isDarkMode}
                onToggleTheme={() => setIsDarkMode((prev) => !prev)}
              />
            }
          />
          <Route path="/pod/:podId" element={<SharedPodPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
