import { Link } from "react-router-dom";
import robo from "../assets/robo.jpeg";

function Hero() {
  return (
    <section className="w-full min-h-[88vh] flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-16 lg:px-24 py-14 md:py-20 bg-[#eef3fa]">
      
      {/* Left Content */}
      <div className="w-full md:w-1/2 text-center md:text-left mt-12 md:mt-0">
        <h1 className="text-[52px] md:text-[72px] font-extrabold leading-[1.1] text-[#0b1736]">
          Your <span className="text-[#2563eb]">Smart AI</span>
          <br />
          <span className="text-[#2563eb]">Guide</span>
        </h1>

        <p className="mt-8 text-[20px] leading-[1.8] text-[#4b5563] max-w-[620px]">
          DevMap helps you build personalized learning roadmaps, track
          progress, and achieve your goals faster.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center md:items-start gap-5">
          <Link
            to="/login"
            className="px-10 py-4 border border-[#3b82f6] text-[#2563eb] rounded-full font-semibold text-[24px] hover:bg-blue-50 transition duration-200"
          >
            Log In
          </Link>

          <Link
            to="/signup"
            className="px-10 py-4 bg-[#2563eb] text-white rounded-full font-semibold text-[24px] hover:bg-blue-700 transition duration-200 shadow-lg"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Right Image */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end">
        <div className="relative flex items-center justify-center">
          {/* Background Glow */}
          <div className="absolute w-[360px] h-[360px] md:w-[460px] md:h-[460px] bg-blue-100 rounded-full blur-3xl opacity-60"></div>

          {/* Image Wrapper */}
          <div className="relative rounded-[32px] p-4 bg-white/50 backdrop-blur-sm shadow-[0_20px_60px_rgba(37,99,235,0.12)]">
            <img
              src={robo}
              alt="AI Guide"
              className="w-[320px] sm:w-[380px] md:w-[500px] object-contain rounded-[28px] mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;