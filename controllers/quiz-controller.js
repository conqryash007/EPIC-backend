const Quiz = require("./../models/QUIZ/Quiz");
const Question = require("./../models/QUIZ/Question");
const Answer = require("./../models/QUIZ/Answers");
const UserQuiz = require("./../models/QUIZ/UserQuiz");
const UserQuizStatus = require("./../models/QUIZ/UserQuiz");
const UserQuizAnswer = require("./../models/QUIZ/UserQuizAnswer");
const Child = require("../models/Child");

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
      return res
        .status(200)
        .json({ ok: false, data: [], msg: "Quiz not found" });
    }
    res.status(200).json({ ok: true, data: [quiz], msg: "Quiz found" });
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
    const userId = req.user.id;
    const { child_id, is_child, quiz_id } = req.body;

    // Find all questions related to the quiz
    const questions = await Question.find({ quiz_id });

    const getUserAnswers = await UserQuizAnswer.find({
      child_id,
      is_child,
      userId,
    });

    let userAns = {};
    if (getUserAnswers.length > 0) {
      userAns = getUserAnswers[0].answers;
    }

    // Populate each question with its answers
    const questionsWithAnswers = await Promise.all(
      questions.map(async (question, index) => {
        let flag = false;
        if (Object.keys(userAns).length > 0) flag = true;

        const answers = await Answer.find({ question_id: question._id });
        return {
          id: question._id,
          que_id: index + 1,
          question: question.question_text,
          answers: answers.map((answer) => ({
            label: answer.answer_text,
            value: answer._id,
          })),
          selectedOption: flag ? userAns[question._id.toString()] || "" : "",
        };
      })
    );

    res.status(200).json({
      quiz_id,
      data: questionsWithAnswers,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the quiz data." });
  }
};

exports.getUserQuizDestails = async (req, res) => {
  try {
    const userId = req.user.id;
    const children = await Child.find({ userId });
    const allQuizes = await Quiz.find();

    const userQuizStatus = await UserQuizStatus.find({
      userId,
      is_child: false,
    });

    const childrenQuizesStatus = await Promise.all(
      children.map((curr) => {
        return UserQuizStatus.find({
          child_id: curr._id,
          userId,
          is_child: true,
        });
      })
    );
    const finalChildrenStatus = [];
    childrenQuizesStatus.forEach((curr) => {
      if (curr.length > 0) {
        finalChildrenStatus.push(curr[0]);
      }
    });

    const resumeQuiz = [];
    const startQuiz = [];
    const completedQuiz = [];

    [...userQuizStatus, ...finalChildrenStatus].forEach((curr) => {
      let x = curr.toObject();

      allQuizes.forEach((ele) => {
        if (ele._id.toString() === x.quiz_id.toString()) {
          x.title = ele.title;
          x.description = ele.description;
          x.image = ele.image;
          x.students = ele.students;
        }
      });

      if (x.completed_status === "resume") {
        resumeQuiz.push(x);
      } else if (x.completed_status === "start") {
        startQuiz.push(x);
      } else {
        completedQuiz.push(x);
      }
    });

    const allUserQuizesIds = userQuizStatus.map((curr) =>
      curr.quiz_id.toString()
    );
    const allChildQuizesIds = finalChildrenStatus.map((curr) =>
      curr.quiz_id.toString()
    );
    let availableQuiz = allQuizes.filter((curr) => {
      return ![...allUserQuizesIds, ...allChildQuizesIds].includes(
        curr._id.toString()
      );
    });
    availableQuiz = availableQuiz.map((curr, i) => {
      let x = curr.toObject();
      x.completed_status = "start";

      return x;
    });

    res.status(200).json({
      ok: true,
      available: [...availableQuiz, ...resumeQuiz, ...startQuiz],
      completed: [...completedQuiz],
    });
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};

exports.saveUserQuizStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const userquiz = new UserQuiz({ userId, ...req.body });
    const saved = await userquiz.save();

    res.status(200).json({ ok: true, data: saved });
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};
exports.updateUserQuizStatus = async (req, res) => {
  try {
    const id = req.params.id;

    const userquiz = await UserQuiz.findByIdAndUpdate(id, req.body);

    res.status(200).json({ ok: true, data: userquiz });
  } catch (error) {
    res.status(400).json({ ok: false, msg: error.message });
  }
};

exports.saveUsersAnswers = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data, child_id, is_child, quiz_id } = req.body;

    let userAnswer = await UserQuizAnswer.find({
      child_id,
      is_child,
      quiz_id,
      userId,
    });
    let userAns = {};
    if (userAnswer.length > 0) {
      userAns = { ...userAnswer[0].answers };

      data.forEach((curr) => {
        userAns[curr.id] = curr.selectedOption;
      });

      userAnswer = await UserQuizAnswer.findOneAndUpdate(
        {
          child_id,
          is_child,
          quiz_id,
          userId,
        },
        { answers: userAns }
      );
    } else {
      data.forEach((curr) => {
        userAns[curr.id] = curr.selectedOption;
      });

      userAnswer = new UserQuizAnswer({
        child_id,
        is_child,
        quiz_id,
        userId,
        answers: userAns,
      });

      await userAnswer.save();
    }

    res.status(200).json({ ok: true, data: userAnswer });
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
