const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const version = new Schema(
  {
    current_version: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Version", version);
