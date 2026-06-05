const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  roadmap: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap' },
  topicNode: { type: String }, 

  answers: [
    {
      questionIndex: Number,
      selectedAnswer: String,
      isCorrect: Boolean,
    }
  ],

  score: { type: Number }, 
  weakTopics: [{ type: String }],
  passed: { type: Boolean }, 

}, { timestamps: true });

quizAttemptSchema.index({ user: 1, quiz: 1 }, { unique: true });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);