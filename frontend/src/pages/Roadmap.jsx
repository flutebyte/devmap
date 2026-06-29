import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaYoutube,
  FaGlobe,
  FaQuestionCircle
} from "react-icons/fa";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap
} from "reactflow";
import "reactflow/dist/style.css";
import { fetchRoadmapByTopic, updateRoadmapStep } from "../services/roadmapApi";

function Roadmap() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const level = searchParams.get("level") || "Beginner";
  const duration = searchParams.get("duration") || "3 Months";

  const [roadmapData, setRoadmapData] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const loadingIntervalRef = useRef(null);

  const LOADING_MESSAGES = [
    { text: "Analyzing your topic...", sub: "Understanding the key concepts" },
    { text: "Structuring your learning path...", sub: "Organizing topics from basics to advanced" },
    { text: "Finding the best YouTube tutorials...", sub: "Ranking videos by engagement & quality" },
    { text: "Curating articles & resources...", sub: "Searching across the web for you" },
    { text: "Personalizing for your level...", sub: `Tailoring content for ${level}` },
    { text: "Almost ready...", sub: "Putting it all together" },
  ];

  useEffect(() => {
    if (loading) {
      loadingIntervalRef.current = setInterval(() => {
        setLoadingMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
      }, 2500);
    } else {
      clearInterval(loadingIntervalRef.current);
    }
    return () => clearInterval(loadingIntervalRef.current);
  }, [loading]);

  useEffect(() => {
    const getRoadmap = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchRoadmapByTopic(topic, level, duration);
        setRoadmapData(data.roadmap);

        if (data.roadmap?.roadmap?.length > 0) {
          setSelectedStep(data.roadmap.roadmap[0]);
        }
      } catch (err) {
        console.error("Roadmap Fetch Error:", err);
        setError(err.message || "Failed to load roadmap");
      } finally {
        setLoading(false);
      }
    };

    if (topic) {
      getRoadmap();
    }
  }, [topic, level, duration]);

  const handleStatusChange = async (step, newStatus) => {
    try {
      const updated = await updateRoadmapStep(roadmapData._id, step, newStatus);
      setRoadmapData(updated.roadmap);

      const updatedStep = updated.roadmap.roadmap.find((item) => item.step === step);
      if (updatedStep) {
        setSelectedStep(updatedStep);
      }
    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update step status");
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "green":
        return "bg-green-100 text-green-700";
      case "yellow":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  const getNodeColor = (status) => {
    switch (status) {
      case "green":
        return "#22c55e";
      case "yellow":
        return "#f59e0b";
      default:
        return "#ef4444";
    }
  };

  const getStatusProgress = () => {
    if (!roadmapData?.roadmap?.length) return 0;
    const completed = roadmapData.roadmap.filter((item) => item.status === "green").length;
    return Math.round((completed / roadmapData.roadmap.length) * 100);
  };

  const flowNodes = useMemo(() => {
    if (!roadmapData?.roadmap) return [];

    return roadmapData.roadmap.map((item, index) => ({
      id: `${index + 1}`,
      position: { x: index % 2 === 0 ? 100 : 450, y: index * 130 },
      data: {
        label: (
          <div className="text-center">
            <p className="font-semibold text-sm">{item.step}</p>
          </div>
        )
      },
      style: {
        background: "#fff",
        border: `3px solid ${getNodeColor(item.status)}`,
        borderRadius: "16px",
        padding: "12px 18px",
        width: 220,
        fontSize: "14px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        cursor: "pointer"
      }
    }));
  }, [roadmapData]);

  const flowEdges = useMemo(() => {
    if (!roadmapData?.roadmap) return [];

    return roadmapData.roadmap.slice(0, -1).map((_, index) => ({
      id: `e${index + 1}-${index + 2}`,
      source: `${index + 1}`,
      target: `${index + 2}`,
      animated: true,
      style: {
        stroke: "#2563eb",
        strokeWidth: 2
      }
    }));
  }, [roadmapData]);

  const handleNodeClick = (_, node) => {
    const index = Number(node.id) - 1;
    setSelectedStep(roadmapData.roadmap[index]);
  };

  if (loading) {
    const current = LOADING_MESSAGES[loadingMsgIdx];
    return (
      <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

          <h2 className="text-xl font-bold text-[#12326b] mb-1 transition-all duration-500">
            {current.text}
          </h2>
          <p className="text-gray-400 text-sm mb-8">{current.sub}</p>

          <div className="flex justify-center gap-2 mb-6">
            {LOADING_MESSAGES.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === loadingMsgIdx ? "w-6 bg-blue-600" : "w-2 bg-gray-200"
                }`}
              />
            ))}
          </div>

          <div className="bg-blue-50 rounded-2xl px-5 py-3">
            <p className="text-blue-600 font-semibold text-sm">
              {decodeURIComponent(topic)} · {level} · {duration}
            </p>
          </div>

          <p className="text-gray-400 text-xs mt-4">This usually takes 15–30 seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 sm:px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6 transition"
        >
          <FaArrowLeft />
          Back to Search
        </button>

        {error ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <h2 className="text-3xl font-bold text-red-500 mb-3">Oops!</h2>
            <p className="text-gray-600 text-lg">{error}</p>
          </div>
        ) : roadmapData ? (
          <>
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-md p-8 mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#12326b] mb-3">
                {roadmapData.topic || decodeURIComponent(topic)} Roadmap
              </h1>

              <p className="text-gray-600 text-base sm:text-lg mb-4">
                {roadmapData.description ||
                  `A complete learning roadmap for ${decodeURIComponent(topic)}`}
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  Level: {roadmapData.level || level}
                </span>
                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                  Duration: {roadmapData.learningTime || duration}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>Your Progress</span>
                  <span>{getStatusProgress()}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${getStatusProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* React Flow */}
              <div className="xl:col-span-2 bg-white rounded-3xl shadow-md p-4 h-[700px]">
                <h2 className="text-2xl font-bold text-[#12326b] mb-4 px-2">
                  Visual Learning Path
                </h2>

                <div className="w-full h-[620px] rounded-2xl overflow-hidden border border-gray-100">
                  <ReactFlow
                    nodes={flowNodes}
                    edges={flowEdges}
                    fitView
                    onNodeClick={handleNodeClick}
                  >
                    <MiniMap />
                    <Controls />
                    <Background gap={20} size={1} />
                  </ReactFlow>
                </div>
              </div>

              {/* Step Details */}
              <div className="bg-white rounded-3xl shadow-md p-6 h-fit sticky top-6">
                <h2 className="text-2xl font-bold text-[#12326b] mb-4">
                  Step Details
                </h2>

                {selectedStep ? (
                  <>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {selectedStep.step}
                    </h3>

                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-5 ${getStatusStyles(
                        selectedStep.status
                      )}`}
                    >
                      Status: {selectedStep.status}
                    </span>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3 mb-6">
                      <button
                        onClick={() =>
                          handleStatusChange(selectedStep.step, "red")
                        }
                        className="px-4 py-3 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 text-sm font-medium flex items-center justify-center gap-2 transition"
                      >
                        <FaTimesCircle />
                        Not Started
                      </button>

                      <button
                        onClick={() =>
                          handleStatusChange(selectedStep.step, "yellow")
                        }
                        className="px-4 py-3 rounded-xl bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-sm font-medium flex items-center justify-center gap-2 transition"
                      >
                        <FaClock />
                        In Progress
                      </button>

                      <button
                        onClick={() =>
                          handleStatusChange(selectedStep.step, "green")
                        }
                        className="px-4 py-3 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 text-sm font-medium flex items-center justify-center gap-2 transition"
                      >
                        <FaCheckCircle />
                        Completed
                      </button>
                    </div>

                    {/* Take Quiz */}
                    <button
                      onClick={() =>
                        navigate(
                          `/quiz?topic=${encodeURIComponent(selectedStep.step)}&level=${encodeURIComponent(roadmapData.level || level)}&roadmapId=${roadmapData._id}&topicNode=${selectedStep._id || ""}`
                        )
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#12326b] text-white hover:bg-[#1a4490] text-sm font-medium flex items-center justify-center gap-2 transition mb-6"
                    >
                      <FaQuestionCircle />
                      Take Quiz on this Topic
                    </button>

                    {/* Resources */}
                    {selectedStep.resources && selectedStep.resources.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                          Recommended Resources
                        </h4>

                        <div className="space-y-3">
                          {selectedStep.resources.map((resource, idx) => (
                            <a
                              key={idx}
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-4 transition"
                            >
                              <div className="flex items-center gap-3 mb-2">
                                {resource.type === "video" ? (
                                  <FaYoutube className="text-red-500 text-xl" />
                                ) : (
                                  <FaGlobe className="text-blue-500 text-lg" />
                                )}

                                <p className="text-sm uppercase text-blue-600 font-semibold">
                                  {resource.type}
                                </p>
                              </div>

                              <p className="text-gray-800 font-medium">
                                {resource.title}
                              </p>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">
                    Click on a roadmap node to view its details.
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-3">
              No roadmap found
            </h2>
            <p className="text-gray-500">
              Try generating another roadmap from the dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Roadmap;