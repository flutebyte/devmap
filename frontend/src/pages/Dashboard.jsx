import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaSearch,
  FaCode,
  FaRobot,
  FaGlobe,
  FaDatabase,
  FaBrain,
  FaLaptopCode,
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaMap,
  FaTrash
} from "react-icons/fa";
import GenerateRoadmapModal from "../components/GenerateRoadmapModal";
import Navbar from "../components/Navbar";
import { fetchMyRoadmaps, fetchMyAttempts, deleteRoadmap } from "../services/roadmapApi";

function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [topic, setTopic] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "generate");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const [myRoadmaps, setMyRoadmaps] = useState([]);
  const [roadmapsLoading, setRoadmapsLoading] = useState(false);
  const [roadmapsError, setRoadmapsError] = useState("");

  const [quizAttempts, setQuizAttempts] = useState([]);
  const [attemptsLoading, setAttemptsLoading] = useState(false);
  const [attemptsError, setAttemptsError] = useState("");

  const popularTopics = [
    { name: "DSA", icon: <FaCode />, color: "bg-blue-100 text-blue-600" },
    { name: "Machine Learning", icon: <FaRobot />, color: "bg-purple-100 text-purple-600" },
    { name: "Web Development", icon: <FaGlobe />, color: "bg-green-100 text-green-600" },
    { name: "DBMS", icon: <FaDatabase />, color: "bg-orange-100 text-orange-600" },
    { name: "Artificial Intelligence", icon: <FaBrain />, color: "bg-pink-100 text-pink-600" },
    { name: "Full Stack Development", icon: <FaLaptopCode />, color: "bg-indigo-100 text-indigo-600" }
  ];

  useEffect(() => {
    if (activeTab === "roadmaps") loadRoadmaps();
    if (activeTab === "quiz") loadAttempts();
  }, [activeTab]);

  const loadRoadmaps = async () => {
    setRoadmapsLoading(true);
    setRoadmapsError("");
    try {
      const data = await fetchMyRoadmaps();
      setMyRoadmaps(data.roadmaps || []);
    } catch {
      setRoadmapsError("Failed to load roadmaps");
    } finally {
      setRoadmapsLoading(false);
    }
  };

  const loadAttempts = async () => {
    setAttemptsLoading(true);
    setAttemptsError("");
    try {
      const data = await fetchMyAttempts();
      setQuizAttempts(data.attempts || []);
    } catch {
      setAttemptsLoading(false);
      setAttemptsError("Failed to load quiz results");
      return;
    }
    setAttemptsLoading(false);
  };

  const handleDelete = async (e, roadmapId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this roadmap? This can't be undone.")) return;
    try {
      await deleteRoadmap(roadmapId);
      setMyRoadmaps(prev => prev.filter(r => r._id !== roadmapId));
    } catch {
      alert("Failed to delete roadmap");
    }
  };

  const getProgress = (roadmap) => {
    if (!roadmap.roadmap?.length) return 0;
    const done = roadmap.roadmap.filter(s => s.status === "green").length;
    return Math.round((done / roadmap.roadmap.length) * 100);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setSelectedTopic(topic.trim());
    setShowModal(true);
  };

  const handleQuickSearch = (topicName) => {
    setSelectedTopic(topicName);
    setShowModal(true);
  };

  const handleGenerateRoadmap = ({ topic, level, duration }) => {
    setShowModal(false);
    navigate(
      `/roadmap/${encodeURIComponent(topic)}?level=${encodeURIComponent(level)}&duration=${encodeURIComponent(duration)}`
    );
  };

  const tabs = [
    { id: "generate", label: "Generate" },
    { id: "roadmaps", label: "My Roadmaps" },
    { id: "quiz", label: "Quiz Results" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-white to-[#f7f8fc]">
      <Navbar />
      <div className="px-4 py-12"><div className="max-w-6xl mx-auto">

        {/* Tabs */}
        <div className="flex gap-2 mb-10 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-semibold rounded-t-xl transition ${
                activeTab === tab.id
                  ? "bg-white text-[#12326b] border border-b-white border-gray-200 -mb-px"
                  : "text-gray-500 hover:text-[#12326b]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Generate Tab ── */}
        {activeTab === "generate" && (
          <>
            <div className="text-center mb-14">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#12326b] mb-4 leading-tight">
                DevMap Dashboard 🚀
              </h1>
              <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
                Generate a personalized AI-powered roadmap for any tech skill and
                start learning smarter.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="bg-white rounded-2xl shadow-xl px-5 sm:px-6 py-4 flex items-center gap-4 max-w-3xl mx-auto mb-16 border border-gray-100"
            >
              <FaSearch className="text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search topics like DSA, Machine Learning, Web Development..."
                className="w-full outline-none text-base sm:text-lg text-gray-700 bg-transparent"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-3 rounded-xl font-semibold transition whitespace-nowrap"
              >
                Generate
              </button>
            </form>

            <div className="mb-16">
              <h2 className="text-2xl font-bold text-[#12326b] mb-6 text-center">
                Popular Learning Paths
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {popularTopics.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleQuickSearch(item.name)}
                    className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:-translate-y-1"
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 ${item.color}`}>
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Explore a structured roadmap and step-by-step learning path for {item.name}.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#12326b] text-white rounded-3xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-3">Start Your Learning Journey</h3>
                <p className="text-blue-100 mb-6 leading-relaxed">
                  Pick a skill, follow a roadmap, and build your future step by
                  step with guided resources and progress tracking.
                </p>
                <button
                  onClick={() => handleQuickSearch("Full Stack Development")}
                  className="bg-white text-[#12326b] px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
                >
                  Explore Full Stack
                </button>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Trending in Tech</h3>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  AI, Cloud, Data Science, Web Development, and System Design are
                  currently some of the most in-demand skills in tech.
                </p>
                <button
                  onClick={() => handleQuickSearch("Artificial Intelligence")}
                  className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Explore AI
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── My Roadmaps Tab ── */}
        {activeTab === "roadmaps" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[#12326b]">My Roadmaps</h2>
              <button
                onClick={() => setActiveTab("generate")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                + New Roadmap
              </button>
            </div>

            {roadmapsLoading && (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {roadmapsError && (
              <p className="text-center text-red-500 py-10">{roadmapsError}</p>
            )}

            {!roadmapsLoading && !roadmapsError && myRoadmaps.length === 0 && (
              <div className="text-center py-20">
                <FaMap className="text-5xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No roadmaps yet.</p>
                <p className="text-gray-400 text-sm mt-1">Generate your first one from the Generate tab.</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRoadmaps.map(roadmap => {
                const progress = getProgress(roadmap);
                const total = roadmap.roadmap?.length || 0;
                const done = roadmap.roadmap?.filter(s => s.status === "green").length || 0;
                const date = new Date(roadmap.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric"
                });

                return (
                  <div
                    key={roadmap._id}
                    onClick={() =>
                      navigate(
                        `/roadmap/${encodeURIComponent(roadmap.topic)}?level=${encodeURIComponent(roadmap.level)}&duration=${encodeURIComponent(roadmap.learningTime)}&existing=${roadmap._id}`
                      )
                    }
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-[#12326b] leading-tight">
                        {roadmap.topic}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-xs text-gray-400">{date}</span>
                        <button
                          onClick={(e) => handleDelete(e, roadmap._id)}
                          className="text-gray-300 hover:text-red-500 transition p-1"
                          title="Delete roadmap"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-4 flex-wrap">
                      <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">
                        {roadmap.level}
                      </span>
                      <span className="bg-purple-50 text-purple-600 text-xs px-3 py-1 rounded-full font-medium">
                        {roadmap.learningTime}
                      </span>
                    </div>

                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{done}/{total} steps</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                            background: progress === 100 ? "#22c55e" : "#3b82f6"
                          }}
                        />
                      </div>
                    </div>

                    <p className="text-right text-sm font-semibold mt-2"
                      style={{ color: progress === 100 ? "#22c55e" : "#3b82f6" }}>
                      {progress}%
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Quiz Results Tab ── */}
        {activeTab === "quiz" && (
          <div>
            <h2 className="text-3xl font-bold text-[#12326b] mb-8">Quiz Results</h2>

            {attemptsLoading && (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {attemptsError && (
              <p className="text-center text-red-500 py-10">{attemptsError}</p>
            )}

            {!attemptsLoading && !attemptsError && quizAttempts.length === 0 && (
              <div className="text-center py-20">
                <FaTrophy className="text-5xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No quiz attempts yet.</p>
                <p className="text-gray-400 text-sm mt-1">
                  Open a roadmap step and take a quiz to see results here.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizAttempts.map(attempt => {
                const date = new Date(attempt.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric"
                });

                return (
                  <div
                    key={attempt._id}
                    className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-base font-bold text-gray-800 leading-tight">
                        {attempt.quiz?.topic || "Quiz"}
                      </h3>
                      <span className="text-xs text-gray-400 shrink-0 ml-2">{date}</span>
                    </div>

                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 mb-4 inline-block">
                      {attempt.quiz?.difficulty || "—"}
                    </span>

                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all"
                          style={{
                            width: `${attempt.score}%`,
                            background: attempt.passed ? "#22c55e" : "#f59e0b"
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-700 w-10 text-right">
                        {attempt.score}%
                      </span>
                    </div>

                    <div className={`flex items-center gap-2 mt-3 text-sm font-semibold ${
                      attempt.passed ? "text-green-600" : "text-yellow-600"
                    }`}>
                      {attempt.passed
                        ? <><FaCheckCircle /> Passed</>
                        : <><FaTimesCircle /> Needs Revision</>
                      }
                    </div>

                    {attempt.weakTopics?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-400 mb-1.5">Weak areas:</p>
                        <div className="flex flex-wrap gap-1">
                          {attempt.weakTopics.slice(0, 3).map((t, i) => (
                            <span key={i} className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
                              {t}
                            </span>
                          ))}
                          {attempt.weakTopics.length > 3 && (
                            <span className="text-xs text-gray-400">+{attempt.weakTopics.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div></div>

      <GenerateRoadmapModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        topic={selectedTopic}
        onGenerate={handleGenerateRoadmap}
      />
    </div>
  );
}

export default Dashboard;
