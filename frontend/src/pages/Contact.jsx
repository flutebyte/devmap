import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.email || !form.message) {
      setError("Please fill all the details");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.message === "Message sent successfully") {
        setSuccess("Your message has been sent successfully!");
        setForm({
          name: "",
          phone: "",
          email: "",
          message: "",
        });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="bg-[#f5f8ff] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-100 to-white py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900">
          Contact Us
        </h1>
        <p className="text-xl text-blue-800 mt-3">We’d love to hear from you</p>
        <p className="text-gray-600 mt-2 text-base">
          Ask doubts, report issues, or send feedback
        </p>
      </section>

      {/* Main Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-6 items-start">
          
          {/* Contact Form */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-5">
              Send Us a Message
            </h2>

            {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}
            {success && <p className="text-green-600 mb-3 text-sm">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-900 font-medium mb-2 text-sm">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-blue-50 rounded-xl px-4 py-2.5 outline-none border border-blue-100 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-blue-900 font-medium mb-2 text-sm">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full bg-blue-50 rounded-xl px-4 py-2.5 outline-none border border-blue-100 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-blue-900 font-medium mb-2 text-sm">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-blue-50 rounded-xl px-4 py-2.5 outline-none border border-blue-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-blue-900 font-medium mb-2 text-sm">
                  Message
                </label>
                <textarea
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full bg-blue-50 rounded-xl px-4 py-3 outline-none border border-blue-100 resize-none text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition shadow-sm text-sm font-medium"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right Side */}
          <div className="space-y-5">
            {/* Newsletter */}
            <div className="bg-gradient-to-br from-blue-200 to-blue-100 rounded-2xl shadow-md p-5">
              <h3 className="text-xl font-bold text-blue-900 mb-2">
                Our Newsletter
              </h3>
              <p className="text-gray-700 mb-4 text-sm">
                Get study updates and AI learning tips
              </p>

              <input
                type="email"
                placeholder="Enter Email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full rounded-full px-4 py-2.5 outline-none mb-3 text-sm"
              />

              <button className="w-full bg-blue-600 text-white py-2.5 rounded-full hover:bg-blue-700 transition text-sm font-medium">
                Subscribe
              </button>
            </div>

            {/* Address Box */}
            <div className="bg-white rounded-2xl shadow-md p-5">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-blue-600 text-lg mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-blue-900">Address</h4>
                  <p className="text-base font-semibold mt-1">Shoolini University</p>
                  <p className="text-gray-600 text-sm">Solan, Himachal</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-2xl shadow-sm p-5 flex items-start gap-3">
            <FaPhoneAlt className="text-blue-600 text-lg mt-1" />
            <div>
              <h4 className="text-lg font-bold text-blue-900">Phone</h4>
              <p className="text-gray-700 mt-1 text-sm">+91 98765 43210</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 flex items-start gap-3">
            <FaEnvelope className="text-blue-600 text-lg mt-1" />
            <div>
              <h4 className="text-lg font-bold text-blue-900">Email</h4>
              <p className="text-gray-700 mt-1 text-sm">support@devmap.ai</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5 flex items-start gap-3">
            <FaMapMarkerAlt className="text-blue-600 text-lg mt-1" />
            <div>
              <h4 className="text-lg font-bold text-blue-900">Address</h4>
              <p className="text-gray-700 mt-1 text-sm">Shoolini University, Solan</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;