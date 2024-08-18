const Quiz = require("./../models/QUIZ/Quiz");
const Question = require("./../models/QUIZ/Question");
const Answer = require("./../models/QUIZ/Answers");
const UserQuiz = require("./../models/QUIZ/UserQuiz");
const UserQuizAnswer = require("./../models/QUIZ/UserQuizAnswer");

// ---------------------------------------
// ------------QUIZ-----------------------
// ------------START----------------------

exports.getQuizes = async (req, res) => {
  try {
    const quiz = await Quiz.find();
    res.status(200).json({ ok: true, data: quiz });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ ok: false, msg: "Quiz not found" });
    }
    res.status(200).json({ ok: true, data: quiz });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};
exports.createQuiz = async (req, res) => {
  try {
    const quizBody = { ...req.body };

    const quiz = new Quiz(quizBody);
    await quiz.save();

    res.status(200).json({ ok: true, data: quiz });
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};

exports.getFullQuizInfo = async (req, res) => {
  try {
    const quizId = req.params.id;

    // Find all questions related to the quiz
    const questions = await Question.find({ quiz_id: quizId });

    // Populate each question with its answers
    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answers = await Answer.find({ question_id: question._id });
        return {
          question: question,
          answers: answers.map((answer) => ({
            answer_text: answer.answer_text,
            _id: answer._id,
          })),
        };
      })
    );

    res.status(200).json({
      quizId: quizId,
      questions: questionsWithAnswers,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the quiz data." });
  }
};

exports.saveUserQuizStatus = async (req, res) => {
  try {
    const userId = req.user.uid;

    const userquiz = new UserQuiz({ userId, ...req.body });
    const saved = await userquiz.save();

    res.status(200).json({ ok: true, data: saved });
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};
exports.updateUserQuizStatus = async (req, res) => {
  try {
    const userId = req.user.uid;

    const userquiz = await UserQuiz.findOneAndUpdate({ userId }, req.body);

    res.status(200).json({ ok: true, data: userquiz });
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};

exports.saveUsersAnswers = async (req, res) => {
  try {
    const userId = req.user.uid;

    const userAnswer = new UserQuizAnswer({ userId, ...req.body });
    const saved = await userAnswer.save();

    res.status(200).json({ ok: true, data: saved });
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};
// ------------END----------------------

exports.addQuestion = async (req, res) => {
  try {
    const quesBody = { ...req.body };

    const ques = new Question(quesBody);
    await ques.save();

    res.status(200).json({ ok: true, data: ques });
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};

exports.addAnswer = async (req, res) => {
  try {
    const ansBody = { ...req.body };

    const ans = new Answer(ansBody);
    await ans.save();

    res.status(200).json({ ok: true, data: ans });
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};
