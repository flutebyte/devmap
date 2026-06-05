import { FaBrain, FaMap, FaRobot, FaChartLine } from "react-icons/fa";

function Features() {
  return (
    <section className="py-20 px-10 bg-gray-50 text-center">
      <h2 className="text-4xl font-bold mb-4">
        Everything you need in one workspace
      </h2>
      <p className="text-gray-500 mb-12">
        DevMap brings your entire study workflow into one place.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg">
          <FaBrain className="text-3xl text-blue-500 mb-3" />
          <h3 className="font-semibold">Gap Detection Analytics</h3>
          <p className="text-gray-500 mt-2">
            Identify weak areas and improve faster.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg">
          <FaMap className="text-3xl text-blue-500 mb-3" />
          <h3 className="font-semibold">Interactive Roadmaps</h3>
          <p className="text-gray-500 mt-2">
            Learn with structured visual paths.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg">
          <FaRobot className="text-3xl text-blue-500 mb-3" />
          <h3 className="font-semibold">AI Chat Assistant</h3>
          <p className="text-gray-500 mt-2">
            Ask anything and get instant help.
          </p>
        </div>

      </div>
    </section>
  );
}

export default Features;