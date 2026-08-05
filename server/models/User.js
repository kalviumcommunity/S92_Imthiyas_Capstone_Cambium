const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    institution: {
      type: String,
    },
    researchInterests: {
      type: [String],
      default: [],
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bookmark",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);