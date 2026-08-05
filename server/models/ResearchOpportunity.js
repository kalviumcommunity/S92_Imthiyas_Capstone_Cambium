const mongoose = require("mongoose");

const researchOpportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Grant", "CFP", "Journal", "Paper"],
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
    },
    description: {
      type: String,
    },
    link: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ResearchOpportunity",
  researchOpportunitySchema
);