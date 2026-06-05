import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const updatedForm = { ...form, [e.target.name]: e.target.value };
    setForm(updatedForm);

    setError("");

    // live password match check
    if (
      updatedForm.confirmPassword &&
      updatedForm.password !== updatedForm.confirmPassword
    ) {
      setPasswordError("Passwords do not match!");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.email.trim() ||
      !form.username.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      setError("Please fill all the details");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (data.message === "User registered successfully") {
        navigate("/dashboard");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f8fc] px-4">
      <div className="w-full max-w-[440px]">
        <h1 className="text-center text-[42px] font-extrabold text-[#2f66b5] tracking-wide mb-8">
          SIGN UP
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-3 text-sm font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email */}
          <div className="flex items-center bg-white border border-[#d9dfea] rounded-[12px] px-4 h-[52px] shadow-sm">
            <FaEnvelope className="text-[#5f6f98] text-[20px] mr-3" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full outline-none text-[16px] text-[#5f6f98] placeholder-[#5f6f98] bg-transparent"
              onChange={handleChange}
              value={form.email}
            />
          </div>

          {/* Username */}
          <div className="flex items-center bg-white border border-[#d9dfea] rounded-[12px] px-4 h-[52px] shadow-sm">
            <FaUser className="text-[#5f6f98] text-[20px] mr-3" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full outline-none text-[16px] text-[#5f6f98] placeholder-[#5f6f98] bg-transparent"
              onChange={handleChange}
              value={form.username}
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

          {/* Confirm Password */}
          <div>
            <div className="flex items-center justify-between bg-white border border-[#d9dfea] rounded-[12px] px-4 h-[52px] shadow-sm">
              <div className="flex items-center w-full">
                <FaLock className="text-[#5f6f98] text-[20px] mr-3" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full outline-none text-[16px] text-[#5f6f98] placeholder-[#5f6f98] bg-transparent"
                  onChange={handleChange}
                  value={form.confirmPassword}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-[#5f6f98] text-[18px] ml-3"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Password Match Error */}
            {passwordError && (
              <p className="text-red-500 text-sm mt-2 ml-1">
                {passwordError}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full h-[54px] rounded-full text-white text-[18px] font-bold bg-gradient-to-r from-[#1f4fb8] via-[#2d75ff] to-[#56d9ff] shadow-[0_6px_14px_rgba(40,90,255,0.30)] border border-[#67dfff] mt-4"
          >
            Sign Up
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
          Sign up with Google
        </button>

        {/* Footer */}
        <p className="text-center text-[#5f6f98] text-[16px] mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#2f66b5] font-medium underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;