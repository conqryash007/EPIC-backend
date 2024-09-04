const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const topicSelection = new Schema(
  {
    userId: {
      type: String,
    },
    topic_id: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true, // This will add created_at and updated_at fields
  }
);

module.exports = mongoose.model("TopicSelection", topicSelection);
