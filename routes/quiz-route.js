const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topic-controller");
const quizController = require("../controllers/quiz-controller");
const evaluateController = require("./../controllers/evaluate-controller");

const authenticateToken = require("./../middleware/authenticateToken");
const jwtAuth = require("./../middleware/jwtAuth");

router.get("/topic", jwtAuth, topicController.getTopics);
router.get("/topic/:id", jwtAuth, topicController.getTopicById);

router.post("/topic/create", jwtAuth, topicController.createTopic);
router.post("/topic/update/:id", jwtAuth, topicController.updateTopic);
router.post("/topic/delete/:id", jwtAuth, topicController.deleteTopic);

router.post(
  "/topic/selection",
  jwtAuth,
  topicController.saveUserselectionTopic
);

// ADD QUIZ
router.get("/", quizController.getQuizes);
router.get("/:id", quizController.getQuizById);

router.post("/full", jwtAuth, quizController.getFullQuizInfo);

router.post("/create", jwtAuth, quizController.createQuiz);

router.get(
  "/userQuiz/userQuizDetails",
  jwtAuth,
  quizController.getUserQuizDestails
);

router.post("/userQuiz", jwtAuth, quizController.saveUserQuizStatus);
router.post(
  "/userQuiz/update/:id",
  jwtAuth,
  quizController.updateUserQuizStatus
);

router.post("/userAnswer", jwtAuth, quizController.saveUsersAnswers);

router.post("/evaluate", jwtAuth, evaluateController.evaluate);

// ADD QUIZ QUESTION
router.post("/question/create", jwtAuth, quizController.addQuestion);
// ADD QUIZ ANSWERS
router.post("/answer/create", jwtAuth, quizController.addAnswer);

module.exports = router;
