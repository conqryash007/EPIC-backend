const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
    },
    name: { type: String },
    email: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    role: {
      type: String,
      enum: ["parent", "teacher", "management"],
    },
    designation: {
      type: String,
    },
    approved: {
      type: Boolean,
    },
    dob: {
      type: Date,
    },
    city: {
      type: String,
    },
    pin_code: {
      type: Number,
    },
    no_of_children: {
      type: Number,
    },
    school_id: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true, // This will add created_at and updated_at fields
  }
);

module.exports = mongoose.model("User", UserSchema);
