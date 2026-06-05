const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    difficulty:{type: String, enum:['Beginner','Intermediate','Advanced'],required: true},
    type: {type:String, enum:['Theory','Numerical','Research'],required: true},
    questions: [
  {
    question: String,           // was "ques"
    options: {                  // was "ans"
      A: String,
      B: String,
      C: String,
      D: String
    },
    answer: String,             // was "correct_ans"
    topic: String               // new — subtopic label
  }
]
},{ timestamps: true });

module.exports = mongoose.model("Quiz", quizSchema);