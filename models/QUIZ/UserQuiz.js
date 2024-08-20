const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userQuizSchema = new Schema(
  {
    userId: {
      type: String,
    },
    quiz_id: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
    },
    is_child: {
      type: Boolean,
    },
    child_id: {
      type: Schema.Types.ObjectId,
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
