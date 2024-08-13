const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeacherRatingSchoolSchema = new Schema(
  {
    school_id: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    user_id: {
      type: String,
    },
    order_no: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TeacherRating", TeacherRatingSchoolSchema);
