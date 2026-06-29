import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaBrain,
} from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Quiz() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const topic = searchParams.get("topic") || "";
  const level = searchParams.get("level") || "Beginner";
  const roadmapId = searchParams.get("roadmapId");
  const topicNode = searchParams.get("topicNode");

  const [quiz, setQuiz] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const generate = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/quizzes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ topic, difficulty: level, type: "Theory" }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to generate quiz");
        setQuiz(data.quiz);
        setQuizId(data.quizId || data.quiz?._id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (topic) generate();
    else setError("No topic provided.");
  }, [topic, level]);

  const handleSelect = (qIdx, option) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  const handleSubmit = async () => {
    const total = quiz?.questions?.length || 0;
    const answered = Object.keys(answers).length;
    if (answered < total) {
      alert(`Please answer all ${total - answered} remaining question(s) before submitting.`);
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to be logged in to submit a quiz. Please log in and try again.");
        return;
      }

      const answersArray = Object.entries(answers).map(([i, ans]) => ({
        questionIndex: Number(i),
        selectedAnswer: ans,
      }));

      const res = await fetch(`${API_BASE_URL}/api/quizzes/${quizId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: answersArray, roadmapId, topicNode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit quiz");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-500 font-medium">Generating your quiz...</p>
          <p className="text-sm text-gray-400 mt-1">{topic} · {level}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-md w-full">
          <FaTimesCircle className="text-red-400 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-500 mb-3">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-md p-8 text-center">
            {result.passed ? (
              <FaTrophy className="text-yellow-400 text-6xl mx-auto mb-4" />
            ) : (
              <FaBrain className="text-blue-400 text-6xl mx-auto mb-4" />
            )}

            <h1 className="text-3xl font-bold text-[#12326b] mb-2">
              {result.passed ? "Great Job!" : "Keep Revising!"}
            </h1>

            <p className="text-gray-500 mb-6 text-base">{result.message}</p>

            <div
              className={`text-6xl font-extrabold mb-6 ${
                result.passed ? "text-green-500" : "text-red-500"
              }`}
            >
              {result.score}%
            </div>

            <div className="flex items-center justify-center gap-6 mb-8 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <FaCheckCircle className="text-green-500" />
                <span>Passed: {result.score}% (need 70%)</span>
              </div>
            </div>

            {result.weakTopics?.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-6 text-left">
                <h3 className="font-semibold text-yellow-800 mb-3 text-sm uppercase tracking-wide">
                  Topics to revise
                </h3>
                <ul className="space-y-2">
                  {result.weakTopics.map((t, i) => (
                    <li key={i} className="text-yellow-700 text-sm flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 shrink-0"></span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="bg-[#12326b] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1a4490] transition"
              >
                Back to Roadmap
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                  setLoading(true);
                  setError("");
                  const generate = async () => {
                    try {
                      const token = localStorage.getItem("token");
                      const res = await fetch(`${API_BASE_URL}/api/quizzes`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          ...(token && { Authorization: `Bearer ${token}` }),
                        },
                        body: JSON.stringify({ topic, difficulty: level, type: "Theory" }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message);
                      setQuiz(data.quiz);
                      setQuizId(data.quizId || data.quiz?._id);
                    } catch (err) {
                      setError(err.message);
                    } finally {
                      setLoading(false);
                    }
                  };
                  generate();
                }}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Retry Quiz
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const total = quiz?.questions?.length || 0;
  const answered = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6 transition"
        >
          <FaArrowLeft /> Back to Roadmap
        </button>

        <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#12326b] mb-1">
            {topic}
          </h1>
          <p className="text-gray-500 text-sm mb-4">
            {level} · {total} Questions
          </p>

          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Progress</span>
            <span>{answered} / {total} answered</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${total > 0 ? (answered / total) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-5">
          {quiz?.questions?.map((q, qIdx) => (
            <div
              key={qIdx}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <p className="font-semibold text-gray-800 mb-4 leading-relaxed">
                <span className="text-blue-600 font-bold mr-2">Q{qIdx + 1}.</span>
                {q.question}
              </p>

              <div className="space-y-2">
                {Object.entries(q.options || {}).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => handleSelect(qIdx, key)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      answers[qIdx] === key
                        ? "border-blue-500 bg-blue-50 text-blue-800 font-medium"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700"
                    }`}
                  >
                    <span className="font-bold mr-2">{key}.</span> {val}
                  </button>
                ))}
              </div>

              {q.topic && (
                <p className="text-xs text-gray-400 mt-3 italic">Subtopic: {q.topic}</p>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="mt-8 text-center pb-10">
          <button
            onClick={handleSubmit}
            disabled={submitting || answered < total}
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
          <p className="text-sm text-gray-400 mt-3">
            {answered < total
              ? `Answer ${total - answered} more question(s) to submit`
              : "All answered! Ready to submit."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
