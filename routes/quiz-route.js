const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topic-controller");
const quizController = require("../controllers/quiz-controller");

const authenticateToken = require("./../middleware/authenticateToken");
const jwtAuth = require("./../middleware/jwtAuth");

router.get("/topic", jwtAuth, topicController.getTopics);
router.get("/topic/:id", jwtAuth, topicController.getTopicById);

router.post("/topic/create", jwtAuth, topicController.createTopic);
router.post("/topic/update/:id", jwtAuth, topicController.updateTopic);
router.post("/topic/delete/:id", jwtAuth, topicController.deleteTopic);

// ADD QUIZ
router.get("/", quizController.getQuizes);
router.get("/:id", quizController.getQuizById);

router.get("/full/:id", authenticateToken, quizController.getFullQuizInfo);

router.post("/create", authenticateToken, quizController.createQuiz);

router.post("/userQuiz", authenticateToken, quizController.saveUserQuizStatus);
router.post(
  "/userQuiz/update/:id",
  authenticateToken,
  quizController.updateUserQuizStatus
);

router.post("/userAnswer", authenticateToken, quizController.saveUsersAnswers);

// ADD QUIZ QUESTION
router.post("/question/create", authenticateToken, quizController.addQuestion);
// ADD QUIZ ANSWERS
router.post("/answer/create", authenticateToken, quizController.addAnswer);

module.exports = router;
