const express = require('express');
const router = express.Router();
const { login, signup } = require('../controllers/UserCont');
const { authenticate } = require("../middlewares/auth");
const { createRoadmap, getRoadmaps, getRoadmapById, updateRoadmap, updateRoadmapFromQuiz, deleteRoadmap } = require('../controllers/RoadmapCont');
const { generateQuiz, submitQuiz, getAttempt } = require('../controllers/QuizCont');

router.post('/login', login);
router.post('/signup', signup);

router.post("/roadmaps", createRoadmap);
router.get("/roadmaps", authenticate, getRoadmaps);
router.get("/roadmaps/:id", authenticate, getRoadmapById);
router.put("/roadmaps/:id", authenticate, updateRoadmap);
router.delete("/roadmaps/:id", authenticate, deleteRoadmap);
router.post('/:id/quiz-update', authenticate, updateRoadmapFromQuiz);

router.post('/quizzes', generateQuiz);
router.post('/quizzes/:id/submit', submitQuiz);
router.get('/quizzes/:quizId/attempt', getAttempt);


module.exports = router;