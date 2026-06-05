function HowItWorks() {
  return (
    <section className="py-20 px-10 text-center">
      <h2 className="text-4xl font-bold mb-4">
        How DevMap Learns About You
      </h2>
      <p className="text-gray-500 mb-12">
        AI builds your custom roadmap based on your performance.
      </p>

      <div className="grid md:grid-cols-4 gap-6">
        
        {["Take a Quiz", "AI Analysis", "Spot the Gap", "Custom Roadmap"].map(
          (step, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-xl shadow hover:shadow-lg"
            >
              <h3 className="text-blue-500 font-bold mb-2">0{i + 1}</h3>
              <h4 className="font-semibold">{step}</h4>
              <p className="text-gray-500 mt-2 text-sm">
                Step description goes here.
              </p>
            </div>
          )
        )}

      </div>
    </section>
  );
}

export default HowItWorks;