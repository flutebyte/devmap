import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPassword() {
  const navigate = useNavigate();
  const { email } = useParams();

  const [form, setForm] = useState({
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

    if (!form.password.trim() || !form.confirmPassword.trim()) {
      setError("Please fill all the details");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (data.message === "Password updated successfully") {
        navigate("/login");
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
          RESET PASSWORD
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-4 text-sm font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div className="flex items-center justify-between bg-white border border-[#d9dfea] rounded-[12px] px-4 h-[52px] shadow-sm">
            <div className="flex items-center w-full">
              <FaLock className="text-[#5f6f98] text-[20px] mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="New Password"
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
                  placeholder="Confirm New Password"
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

            {passwordError && (
              <p className="text-red-500 text-sm mt-2 ml-1">
                {passwordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-[52px] rounded-full text-white text-[18px] font-bold bg-gradient-to-r from-[#1f4fb8] via-[#2d75ff] to-[#56d9ff] shadow-[0_6px_14px_rgba(40,90,255,0.30)] border border-[#67dfff]"
          >
            Reset Password
          </button>
        </form>

        <p className="text-center text-[#5f6f98] text-[16px] mt-6">
          Back to{" "}
          <Link to="/login" className="text-[#2f66b5] font-medium underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;