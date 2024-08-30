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
    answers: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserQuizAnswer", userQuizAnswerSchema);
