import { useState, useEffect } from "react";
import { FaTimes, FaGraduationCap, FaClock } from "react-icons/fa";

function GenerateRoadmapModal({ isOpen, onClose, topic, onGenerate }) {
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("3 Months");

  useEffect(() => {
    if (isOpen) {
      setLevel("Beginner");
      setDuration("3 Months");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({ topic, level, duration });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative animate-in fade-in zoom-in duration-200">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-[#12326b] mb-2">
            Generate Roadmap
          </h2>
          <p className="text-gray-500">
            Create a personalized learning roadmap for:
          </p>
          <p className="mt-2 text-lg font-semibold text-blue-600">{topic}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Level */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              <span className="flex items-center gap-2">
                <FaGraduationCap className="text-blue-600" />
                Select Level
              </span>
            </label>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              <span className="flex items-center gap-2">
                <FaClock className="text-purple-600" />
                Study Duration
              </span>
            </label>

            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
            >
              <option>1 Month</option>
              <option>3 Months</option>
              <option>6 Months</option>
              <option>1 Year</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Generate Roadmap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GenerateRoadmapModal;