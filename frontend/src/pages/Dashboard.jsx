import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaCode,
  FaRobot,
  FaGlobe,
  FaDatabase,
  FaBrain,
  FaLaptopCode
} from "react-icons/fa";
import GenerateRoadmapModal from "../components/GenerateRoadmapModal";

function Dashboard() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");

  const popularTopics = [
    { name: "DSA", icon: <FaCode />, color: "bg-blue-100 text-blue-600" },
    { name: "Machine Learning", icon: <FaRobot />, color: "bg-purple-100 text-purple-600" },
    { name: "Web Development", icon: <FaGlobe />, color: "bg-green-100 text-green-600" },
    { name: "DBMS", icon: <FaDatabase />, color: "bg-orange-100 text-orange-600" },
    { name: "Artificial Intelligence", icon: <FaBrain />, color: "bg-pink-100 text-pink-600" },
    { name: "Full Stack Development", icon: <FaLaptopCode />, color: "bg-indigo-100 text-indigo-600" }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-white to-[#f7f8fc] px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#12326b] mb-4 leading-tight">
            DevMap Dashboard 🚀
          </h1>

          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Generate a personalized AI-powered roadmap for any tech skill and
            start learning smarter.
          </p>
        </div>

        {/* Search */}
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

        {/* Popular Topics */}
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
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 ${item.color}`}
                >
                  {item.icon}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Explore a structured roadmap and step-by-step learning path
                  for {item.name}.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#12326b] text-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-3">
              Start Your Learning Journey
            </h3>

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
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Trending in Tech
            </h3>

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
      </div>

      {/* Modal */}
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