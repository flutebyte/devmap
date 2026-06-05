const { askQuiz } = require('../services/aiml');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Roadmap = require('../models/Roadmap'); 

const PASS_THRESHOLD = 70;

exports.generateQuiz = async (req, res) => {
  try {
    const {
      topic,
      difficulty = 'Beginner',
      type = 'mcq',
      roadmapId,
      topicNode, 
    } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'topic is required' });
    }

    const generated = await askQuiz(topic, difficulty, type);

    const quiz = await Quiz.create({
      topic,
      difficulty,
      type,
      questions: generated.questions, 
    });

    res.status(201).json({
      status: 'success',
      quizId: quiz._id,
      quiz,
      roadmapId,
      topicNode,
    });
  } catch (error) {
    console.error('generateQuiz error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { id: quizId } = req.params;
    const userId = req.user._id; 
    const { answers = [], roadmapId, topicNode } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let correct = 0;
    const gradedAnswers = answers.map(({ questionIndex, selectedAnswer }) => {
      const question = quiz.questions[questionIndex];
      if (!question) return { questionIndex, selectedAnswer, isCorrect: false };

      const isCorrect =
        String(selectedAnswer).trim().toLowerCase() ===
        String(question.correct_ans).trim().toLowerCase();

      if (isCorrect) correct++;
      return { questionIndex, selectedAnswer, isCorrect };
    });

    const total = quiz.questions.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = score >= PASS_THRESHOLD;

    const weakTopics = gradedAnswers
      .filter((a) => !a.isCorrect)
      .map(({ questionIndex }) => {
        const q = quiz.questions[questionIndex];
        return q ? q.ques : `Question ${questionIndex + 1}`;
      });

    const attempt = await QuizAttempt.findOneAndUpdate(
      { user: userId, quiz: quizId },
      {
        user: userId,
        quiz: quizId,
        roadmap: roadmapId || null,
        topicNode: topicNode || null,
        answers: gradedAnswers,
        score,
        weakTopics,
        passed,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (roadmapId && topicNode) {
      await updateRoadmapNodeStatus(roadmapId, topicNode, passed);
    }

    res.json({
      status: 'success',
      score,
      passed,
      weakTopics,
      attemptId: attempt._id,
      message: passed
        ? '✅ Great job! Topic marked as complete.'
        : '🟡 Keep revising! Topic marked as needs focus.',
    });
  } catch (error) {
    console.error('submitQuiz error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user._id;

    const attempt = await QuizAttempt.findOne({ user: userId, quiz: quizId }).populate('quiz');
    if (!attempt) return res.status(404).json({ message: 'No attempt found' });

    res.json({ status: 'success', attempt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


async function updateRoadmapNodeStatus(roadmapId, topicNode, passed) {
  try {
    const status = passed ? 'green' : 'yellow';
    const color = passed ? '#00C851' : '#ffbb33';

    // Update in roadmap array (the step)
    await Roadmap.updateOne(
      { _id: roadmapId, 'roadmap._id': topicNode },
      { $set: { 'roadmap.$.status': status } }
    );

    // Update in graph.nodes array
    await Roadmap.updateOne(
      { _id: roadmapId, 'graph.nodes.id': topicNode },
      { $set: { 'graph.nodes.$.status': status, 'graph.nodes.$.color': color } }
    );

  } catch (err) {
    console.error('Failed to update roadmap node status:', err.message);
  }
}
