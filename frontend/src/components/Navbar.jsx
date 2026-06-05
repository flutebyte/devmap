import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center px-10 py-5 bg-white shadow-sm sticky top-0 z-50">
      {/* Logo */}
      <h1 className="text-3xl font-extrabold text-blue-600 tracking-wide cursor-pointer">
        DevMap
      </h1>

      {/* Nav Links */}
      <div className="hidden md:flex items-center space-x-8 text-[16px] font-medium text-gray-700">
        <Link to="/" className="hover:text-blue-500 transition duration-200">
          Home
        </Link>
        <a href="/#features" className="hover:text-blue-500 transition duration-200">
          Features
        </a>
        <a href="/#about" className="hover:text-blue-500 transition duration-200">
          About
        </a>
        <Link to="/contact" className="hover:text-blue-500 transition duration-200">
          Contact
        </Link>
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-4">
        <Link
          to="/login"
          className="px-5 py-2 rounded-full border border-blue-500 text-blue-600 font-medium hover:bg-blue-50 transition duration-200"
        >
          Log In
        </Link>

        <Link
          to="/signup"
          className="px-5 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition duration-200 shadow-sm"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;