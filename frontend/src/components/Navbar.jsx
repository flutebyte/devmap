import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="w-full flex justify-between items-center px-10 py-5 bg-white shadow-sm sticky top-0 z-50">
      {/* Logo */}
      <h1
        onClick={() => navigate(isLoggedIn ? "/dashboard" : "/")}
        className="text-3xl font-extrabold text-blue-600 tracking-wide cursor-pointer"
      >
        DevMap
      </h1>

      {isLoggedIn ? (
        /* ── Authenticated nav ── */
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium text-sm transition">
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full border border-red-400 text-red-500 font-medium text-sm hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        /* ── Public nav ── */
        <>
          <div className="hidden md:flex items-center space-x-8 text-[16px] font-medium text-gray-700">
            <Link to="/" className="hover:text-blue-500 transition duration-200">Home</Link>
            <a href="/#features" className="hover:text-blue-500 transition duration-200">Features</a>
            <a href="/#about" className="hover:text-blue-500 transition duration-200">About</a>
            <Link to="/contact" className="hover:text-blue-500 transition duration-200">Contact</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-5 py-2 rounded-full border border-blue-500 text-blue-600 font-medium hover:bg-blue-50 transition duration-200">
              Log In
            </Link>
            <Link to="/signup" className="px-5 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition duration-200 shadow-sm">
              Sign Up
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
