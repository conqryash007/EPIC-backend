const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userQuizSchema = new Schema(
  {
    user_id: {
      type: String,
    },
    quiz_id: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    is_child: {
      type: Boolean,
      required: true,
    },
    child_id: {
      type: String,
      ref: "Child",
    },
    completed_status: {
      type: Boolean,
    },
    certificate_url: {
      type: String,
    },
    quiz_score: {
      type: Number,
    },
  },
  {
    timestamps: true, // This will automatically update created_at and updated_at
  }
);

module.exports = mongoose.model("UserQuiz", userQuizSchema);
