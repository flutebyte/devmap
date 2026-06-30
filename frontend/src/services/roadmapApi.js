const API_BASE_URL = import.meta.env.VITE_API_URL;
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const fetchRoadmapById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/roadmaps/${id}`, {
    headers: getAuthHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch roadmap");
  return data;
};

export const fetchMyRoadmaps = async () => {
  const response = await fetch(`${API_BASE_URL}/api/roadmaps`, {
    headers: getAuthHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch roadmaps");
  return data;
};

export const fetchMyAttempts = async () => {
  const response = await fetch(`${API_BASE_URL}/api/quizzes/attempts`, {
    headers: getAuthHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch attempts");
  return data;
};

export const deleteRoadmap = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/roadmaps/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to delete roadmap");
  return data;
};

export const fetchRoadmapByTopic = async (topic, level, duration) => {
  const response = await fetch(`${API_BASE_URL}/api/roadmaps`, {
  method: "POST",
  headers: getAuthHeaders(),
  body: JSON.stringify({
    topic,
    level,
    learningTime: duration
  })
})

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch roadmap");
  }

  return data;
};

export const updateRoadmapStep = async (roadmapId, step, status) => {
  const response = await fetch(
    `${API_BASE_URL}/api/roadmaps/${roadmapId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ step, status })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update roadmap step");
  }

  return data;
};