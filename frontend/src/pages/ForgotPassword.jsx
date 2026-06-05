import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.message === "User found") {
        navigate(`/reset-password/${email}`);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f8fc] px-4">
      <div className="w-full max-w-[420px]">
        <h1 className="text-center text-[42px] font-extrabold text-[#2f66b5] tracking-wide mb-8">
          FORGOT PASSWORD
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-4 text-sm font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center bg-white border border-[#d9dfea] rounded-[12px] px-4 h-[52px] shadow-sm">
            <FaEnvelope className="text-[#5f6f98] text-[20px] mr-3" />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full outline-none text-[16px] text-[#5f6f98] placeholder-[#5f6f98] bg-transparent"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full h-[52px] rounded-full text-white text-[18px] font-bold bg-gradient-to-r from-[#1f4fb8] via-[#2d75ff] to-[#56d9ff] shadow-[0_6px_14px_rgba(40,90,255,0.30)] border border-[#67dfff]"
          >
            Continue
          </button>
        </form>

        <p className="text-center text-[#5f6f98] text-[16px] mt-6">
          Remembered your password?{" "}
          <Link to="/login" className="text-[#2f66b5] font-medium underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;