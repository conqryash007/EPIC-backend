const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userQuizAnswerSchema = new Schema(
  {
    userId: {
      type: String,
    },
    child_id: {
      type: Schema.Types.ObjectId,
      ref: "Child",
    },
    is_child: {
      type: Boolean,
    },
    quiz_id: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
    },
    question_id: {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
    answer_id: {
      type: Schema.Types.ObjectId,
      ref: "Answer",
    },
    is_correct: {
      type: Boolean,
    },
  },
  {
    timestamps: true, // This will automatically update created_at and updated_at
  }
);

module.exports = mongoose.model("UserQuizAnswer", userQuizAnswerSchema);
