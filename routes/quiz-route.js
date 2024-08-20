const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topic-controller");
const quizController = require("../controllers/quiz-controller");

const authenticateToken = require("./../middleware/authenticateToken");

router.get("/topic", authenticateToken, topicController.getTopics);
router.get("/topic/:id", authenticateToken, topicController.getTopicById);

router.post("/topic/create", authenticateToken, topicController.createTopic);
router.post(
  "/topic/update/:id",
  authenticateToken,
  topicController.updateTopic
);
router.post(
  "/topic/delete/:id",
  authenticateToken,
  topicController.deleteTopic
);

// ADD QUIZ
router.get("/", quizController.getQuizes);
router.get("/:id", quizController.getQuizById);

router.get("/full/:id", quizController.getFullQuizInfo);

router.post("/create", quizController.createQuiz);

router.post("/userQuiz", quizController.saveUserQuizStatus);
router.post("/userQuiz/update", quizController.updateUserQuizStatus);

router.post("/userAnswer", quizController.saveUsersAnswers);

// ADD QUIZ QUESTION
router.post("/question/create", quizController.addQuestion);
// ADD QUIZ ANSWERS
router.post("/answer/create", quizController.addAnswer);

module.exports = router;
