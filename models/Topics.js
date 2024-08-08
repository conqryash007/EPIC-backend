const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TopicSchema = new Schema(
  {
    topic_type: {
      type: String,
      enum: ["Book", "Course"],
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    duration_weeks: {
      type: Number,
    },
    topic_for: {
      type: String,
      enum: ["Parent", "Child", "Teacher"],
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    topic_cost: {
      type: Number,
    },
  },
  {
    timestamps: true, // This will add created_at and updated_at fields
  }
);

module.exports = mongoose.model("Topic", TopicSchema);
