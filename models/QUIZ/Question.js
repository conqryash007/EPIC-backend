const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    quiz_id: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
    },
    question_text: {
      type: String,
    },
  },
  {
    timestamps: true, // This will automatically update created_at and updated_at
  }
);

module.exports = mongoose.model("Question", questionSchema);
