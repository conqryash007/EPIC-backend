const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SchoolManagementSchema = new Schema(
  {
    school_name: {
      type: String,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    city: {
      type: String,
    },
    logo: {
      type: String,
    },
    pin_code: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("School", SchoolManagementSchema);
