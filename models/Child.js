const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersChildSchema = new Schema(
  {
    userId: {
      type: String,
    },
    name: {
      type: String,
    },
    gender: {
      type: String,
    },
    dob: {
      type: Date,
    },
    grade: {
      type: Number,
    },
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
    },
  },
  {
    timestamps: true, // This will add created_at and updated_at fields
  }
);

module.exports = mongoose.model("Child", UsersChildSchema);
