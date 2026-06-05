const { askAIML } = require('../services/aiml');
const Roadmap = require('../models/Roadmap');

exports.createRoadmap = async (req, res) =>{
    try {
    const { topic, level, learningTime } = req.body;

    const prompt = `
    Create a learning roadmap for:

    Topic: ${topic}
    Level: ${level}
    Learning Time Available: ${learningTime}

    Structure the roadmap into:
    Fundamentals
    Core Concepts
    Tools & Frameworks
    Projects
    Advanced Topics
    Career Preparation
    `;
    const roadmap = await askAIML(prompt);

    if (!roadmap) {
      return res.status(500).json({ message: "Error generating roadmap from AI" });
    }
    const roadmapData = roadmap;
    console.log("AI FULL RESPONSE:", JSON.stringify(roadmapData, null, 2));

    if (!roadmapData || !roadmapData.topics) {
      console.log("INVALID AI RESPONSE:", roadmapData);
      return res.status(500).json({
        message: "Invalid roadmap format from AI",
        data: roadmapData
      });
    }

    const steps = [];

    roadmapData.topics.forEach(topic => {
      topic.subtopics.forEach(sub => {
        steps.push({
          step: sub.name,
          status: "red",
          resources: sub.resources || []
        });
      });
    });

    const savedRoadmap = await Roadmap.create({
      userId: req.user?.userId || "64b000000000000000000001", 
      topic,
      level,
      learningTime,
      roadmap: steps
    });
    const graph = generateGraph(savedRoadmap.roadmap);

    res.json({
  status: "success",
  roadmap: {
    ...savedRoadmap.toObject(), 
    graph
  }
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: { error: error.message } });
  }
};

exports.getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({
      userId: req.user?.userId || "64b000000000000000000001"
    }).sort({ createdAt: -1 });

    res.json({
      status: "success",
      roadmaps
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error-> fetching roadmaps" });
  }
};

exports.getRoadmapById = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({
      _id: req.params.id,
      userId: req.user?.userId || "64b000000000000000000001"
    });

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }
    const graph = generateGraph(roadmap.roadmap);

    res.json({
    status: "success",
    roadmap: {
        ...roadmap.toObject(),
        graph
    }
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error-> fetching roadmap" });
  }
};

exports.updateRoadmap = async (req, res) => {
  try {
    const { step, status } = req.body;

    const roadmap = await Roadmap.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user?.userId || "64b000000000000000000001",
        "roadmap.step": step
      },
      {
        $set: { "roadmap.$.status": status }
      },
      { new: true }
    );


    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap or step not found" });
    }
    const graph = generateGraph(roadmap.roadmap);

    res.json({
  status: "success",
  roadmap: {
    ...roadmap.toObject(),
    graph
  }
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error->updating roadmap" });
  }
};

exports.deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.userId || "64b000000000000000000001"
    });

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    res.json({
      status: "success",
      message: "Roadmap deleted"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error->deleting roadmap" });
  }
};

exports.updateRoadmapFromQuiz = async (req, res) => {
  try {
    const roadmapId = req.params.id;
    const { weakTopics } = req.body;

    // Validate inputs
    if (!roadmapId || !weakTopics || !Array.isArray(weakTopics)) {
      return res.status(400).json({ 
        message: "roadmapId and weakTopics array required" 
      });
    }

    // Find the roadmap
    const roadmap = await Roadmap.findOne({
      _id: roadmapId,
      userId: req.user?.userId || "64b000000000000000000001"
    });

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    // Update matching steps to "red" status
    let updatedCount = 0;
    for (const weakTopic of weakTopics) {
      const cleanWeakTopic = weakTopic.toLowerCase().trim();
      
      // Find matching step (case-insensitive partial match)
      for (let i = 0; i < roadmap.roadmap.length; i++) {
        const stepText = roadmap.roadmap[i].step.toLowerCase();
        
        if (stepText.includes(cleanWeakTopic) || cleanWeakTopic.includes(stepText)) {
          roadmap.roadmap[i].status = "red";
          updatedCount++;
          break; // First match only
        }
      }
    }

    await roadmap.save();
    
    const graph = generateGraph(roadmap.roadmap); 

    res.json({
      status: "success",
      message: `Updated ${updatedCount} steps to red based on weak topics`,
      roadmapId,
      weakTopicsProcessed: weakTopics.length,
      stepsUpdated: updatedCount,
      roadmap: {
        ...roadmap.toObject(),
        graph
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating roadmap from quiz 😵‍💫" });
  }
};

// Helper to generate graph from roadmap array
const generateGraph = (roadmapArray) => {
  const nodes = roadmapArray.map((step) => ({
    id: step._id,
    label: step.step,
    status: step.status,
    group: step.step.split('–')[0].trim(), // e.g., "Fundamentals"
    color: step.status === 'red' ? '#ff4444' : step.status === 'yellow' ? '#ffaa00' : '#44ff44'
  }));

  const edges = [];
  for (let i = 0; i < roadmapArray.length - 1; i++) {
    edges.push({
      id: `e${i + 1}`,
      source: roadmapArray[i]._id,
      target: roadmapArray[i + 1]._id,
      type: 'step',
      animated: false
    });
  }

  return { nodes, edges };
};
