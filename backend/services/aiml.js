const axios = require("axios");

exports.askAIML = async (prompt) => {
  try {
    const topicMatch = prompt.match(/Topic:\s*(.*)/);
    const levelMatch = prompt.match(/Level:\s*(.*)/);
    const timeMatch = prompt.match(/Learning Time Available:\s*(.*)/);

    const topic = topicMatch ? topicMatch[1].trim() : "";
    const level = levelMatch ? levelMatch[1].trim() : "";
    const duration = timeMatch ? timeMatch[1].trim() : "";

    const API_URL = process.env.AIML_API_URL;

    console.log("📡 Calling AI Server...");
    console.log("➡️ Data:", { topic, level, duration });

    const response = await axios.post(`${API_URL}/generate-roadmap`, {
      topic,
      level,
      duration
    });

    console.log("✅ AI RESPONSE RECEIVED");

    return response.data;

  } catch (error) {
    console.error("🔥 ROADMAP AI ERROR 🔥");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("No response from AI server");
    } else {
      console.error("Error:", error.message);
    }

    return null;
  }
};

exports.askQuiz = async (topic, difficulty, type) => {
  try {
    console.log("📡 Calling Quiz AI Server...");
    console.log("➡️ Data:", { topic, difficulty, type });

    const response = await axios.post(`${process.env.AIML_API_URL}/generate-quiz`, {
      topic,
      difficulty,
      type
    });

    console.log("QUIZ AI RESPONSE RECEIVED");

    return response.data; // { questions: [...] }

  } catch (error) {
    console.error("QUIZ AI ERROR ");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("No response from Quiz AI server");
    } else {
      console.error("Error:", error.message);
    }

    throw new Error("Quiz generation failed — AI server unreachable or returned an error");
  }
};