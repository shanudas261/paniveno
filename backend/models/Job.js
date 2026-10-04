const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    externalId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    park: {
      type: String,
      enum: ["Technopark", "Infopark", "Cyberpark"],
      required: true,
    },

    location: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    jobType: {
      type: String,
      default: "Full-time",
    },

    skills: {
      type: [String],
      default: [],
    },

    applyUrl: {
      type: String,
      default: "",
    },

    sourceUrl: {
      type: String,
      default: "",
    },

    source: {
      type: String,
      required: true,
    },

    postedDate: {
      type: Date,
    },

    closingDate: {
      type: Date,
    },

    isWalkIn: {
      type: Boolean,
      default: false,
    },

    walkInStartDate: {
      type: Date,
    },

    walkInStartTime: {
      type: String,
    },

    walkInEndTime: {
      type: String,
    },

    companyId: {
      type: Number,
    },

    companyLogo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index(
  { externalId: 1, park: 1 },
  { unique: true }
);

module.exports = mongoose.model("Job", jobSchema);