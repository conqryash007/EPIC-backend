const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const answerSchema = new Schema(
  {
    question_id: {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
    answer_text: {
      type: String,
    },
    is_correct: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true, // This will automatically update created_at and updated_at
  }
);

module.exports = mongoose.model("Answer", answerSchema);
