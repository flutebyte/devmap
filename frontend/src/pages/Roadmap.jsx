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
import { fetchRoadmapByTopic, fetchRoadmapById, updateRoadmapStep } from "../services/roadmapApi";

function Roadmap() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const level = searchParams.get("level") || "Beginner";
  const duration = searchParams.get("duration") || "3 Months";
  const existingId = searchParams.get("existing");

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

        const data = existingId
          ? await fetchRoadmapById(existingId)
          : await fetchRoadmapByTopic(topic, level, duration);

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

    if (topic || existingId) {
      getRoadmap();
    }
  }, [topic, level, duration, existingId]);

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

  const { flowNodes, flowEdges } = useMemo(() => {
    if (!roadmapData?.graph) return { flowNodes: [], flowEdges: [] };

    const backendNodes = roadmapData.graph.nodes;
    const backendEdges = roadmapData.graph.edges;
    const topicNodes = backendNodes.filter(n => n.type === "topic");

    // Map each topic to its subtopic children
    const childMap = {};
    backendEdges.forEach(e => {
      const src = backendNodes.find(n => n.id === e.source);
      if (src?.type === "topic") {
        const tgt = backendNodes.find(n => n.id === e.target);
        if (tgt && tgt.type !== "topic") {
          if (!childMap[e.source]) childMap[e.source] = [];
          childMap[e.source].push(e.target);
        }
      }
    });

    const TOPIC_W = 280;
    const SUB_W = 200;
    const SUB_H = 60;
    const H_GAP = 18;
    const COLS = 3;
    const CENTER_X = 450;
    let y = 0;

    const positioned = [];

    topicNodes.forEach(t => {
      positioned.push({
        id: t.id,
        position: { x: CENTER_X - TOPIC_W / 2, y },
        data: { label: t.label },
        style: {
          background: "#1e3a8a",
          color: "white",
          borderRadius: "10px",
          fontWeight: 700,
          width: TOPIC_W,
          padding: "12px 20px",
          fontSize: "15px",
          border: "none",
          boxShadow: "0 4px 12px rgba(30,58,138,0.25)",
        },
      });
      y += 62 + 40;

      const subs = childMap[t.id] || [];
      const rows = [];
      for (let i = 0; i < subs.length; i += COLS) rows.push(subs.slice(i, i + COLS));

      rows.forEach(row => {
        const totalW = row.length * (SUB_W + H_GAP) - H_GAP;
        const startX = CENTER_X - totalW / 2;

        row.forEach((childId, i) => {
          const child = backendNodes.find(n => n.id === childId);
          if (!child) return;

          const bg = child.color === "#ff4444" ? "#fee2e2"
                   : child.color === "#ffaa00" ? "#fef3c7"
                   : "#dcfce7";

          positioned.push({
            id: child.id,
            position: { x: startX + i * (SUB_W + H_GAP), y },
            data: { label: child.label },
            style: {
              background: bg,
              border: `2px solid ${child.color || "#94a3b8"}`,
              borderRadius: "8px",
              width: SUB_W,
              padding: "10px 14px",
              fontSize: "13px",
              cursor: "pointer",
              minHeight: `${SUB_H}px`,
            },
          });
        });
        y += SUB_H + 16;
      });

      y += 48;
    });

    const edges = backendEdges.map(e => ({
      ...e,
      animated: false,
      style: { stroke: "#cbd5e1", strokeWidth: 1.5 },
    }));

    return { flowNodes: positioned, flowEdges: edges };
  }, [roadmapData]);

  const handleNodeClick = (_, node) => {
    const step = roadmapData.roadmap.find(s => s._id?.toString() === node.id);
    if (step) setSelectedStep(step);
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
          onClick={() => navigate(existingId ? "/dashboard?tab=roadmaps" : "/dashboard")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6 transition"
        >
          <FaArrowLeft />
          {existingId ? "Back to My Roadmaps" : "Back to Dashboard"}
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
                    fitViewOptions={{ padding: 0.2 }}
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
                    <div className="flex flex-col gap-3 mb-4">
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
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 bg-gray-50 rounded-xl px-4 py-3">
                      <FaCheckCircle className="text-green-400 shrink-0" />
                      Complete the quiz on this topic to mark it as done
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
                              onClick={() => {
                                if (selectedStep.status === "red") {
                                  handleStatusChange(selectedStep.step, "yellow");
                                }
                              }}
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