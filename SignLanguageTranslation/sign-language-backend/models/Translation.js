// models/Translation.js
const mongoose = require("mongoose");

const translationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    translatedText: {
      type: String,
      required: [true, "Translated text is required"],
      trim: true,
      maxlength: [5000, "Translated text cannot exceed 5000 characters"],
    },
    sourceLanguage: {
      type: String,
      default: "ASL",
      enum: ["ASL", "BSL", "ISL", "JSL", "OTHER"],
    },
    confidence: {
      // optional: AI model confidence score 0–1
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for efficient per-user history queries (newest first)
translationSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model("Translation", translationSchema);
