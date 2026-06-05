import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.identifier.trim() || !form.password.trim()) {
      setError("Please fill all the details");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: form.identifier,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
  // optional but important for later
  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  navigate("/dashboard");
} else {
  setError(data.message || "Login failed");
}
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f8fc] px-4">
      <div className="w-full max-w-[440px]">
        <h1 className="text-center text-[42px] font-extrabold text-[#2f66b5] tracking-wide mb-8">
          LOGIN
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-3 text-sm font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Username/Email */}
          <div className="flex items-center bg-white border border-[#d9dfea] rounded-[12px] px-4 h-[52px] shadow-sm">
            <FaUser className="text-[#5f6f98] text-[20px] mr-3" />
            <input
              type="text"
              name="identifier"
              placeholder="Username or Email"
              className="w-full outline-none text-[16px] text-[#5f6f98] placeholder-[#5f6f98] bg-transparent"
              onChange={handleChange}
              value={form.identifier}
            />
          </div>

          {/* Password */}
          <div className="flex items-center justify-between bg-white border border-[#d9dfea] rounded-[12px] px-4 h-[52px] shadow-sm">
            <div className="flex items-center w-full">
              <FaLock className="text-[#5f6f98] text-[20px] mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full outline-none text-[16px] text-[#5f6f98] placeholder-[#5f6f98] bg-transparent"
                onChange={handleChange}
                value={form.password}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#5f6f98] text-[18px] ml-3"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Forgot Password */}
          <Link
  to="/forgot-password"
  className="text-sm text-[#2f66b5] hover:underline text-right block mt-2"
>
  Forgot Password?
</Link>

          {/* Button */}
          <button
            type="submit"
            className="w-full h-[54px] rounded-full text-white text-[18px] font-bold bg-gradient-to-r from-[#1f4fb8] via-[#2d75ff] to-[#56d9ff] shadow-[0_6px_14px_rgba(40,90,255,0.30)] border border-[#67dfff] mt-2"
          >
            Log In
          </button>
        </form>

        {/* OR */}
        <div className="flex items-center my-5">
          <div className="flex-grow h-[1px] bg-[#d9dfea]"></div>
          <span className="mx-4 text-[#5f6f98] text-[16px] font-medium">OR</span>
          <div className="flex-grow h-[1px] bg-[#d9dfea]"></div>
        </div>

        {/* Google */}
        <button className="w-full h-[52px] flex items-center justify-center gap-3 border border-[#d9dfea] rounded-[12px] bg-white shadow-sm text-[16px] text-[#5f6f98] font-medium">
          <FcGoogle className="text-[26px]" />
          Sign in with Google
        </button>

        {/* Footer */}
        <p className="text-center text-[#5f6f98] text-[16px] mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#2f66b5] font-medium underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;