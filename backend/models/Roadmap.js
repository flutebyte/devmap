const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  topic: String,
  level: String,
  learningTime: String,

  roadmap: [
    {
      step: String,
      status: {
        type: String,
        enum: ["red", "yellow", "green"],
        default: "red"
      },

      resources: [
        {
          type: {
            type: String,   
          },
          title: String,
          link: String
        }
      ]
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Roadmap", roadmapSchema);