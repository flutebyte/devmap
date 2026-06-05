import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />

      <section id="features">
        <Features />
      </section>

      <section id="about">
        <HowItWorks />
      </section>

      <section id="contact">
        <CTA />
        <Footer />
      </section>
    </div>
  );
}

export default Home;