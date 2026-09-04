const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    // ==========================================
    // USER
    // ==========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // TRANSACTION ID
    // ==========================================

    transactionId: {
      type: String,
      required: true,
      unique: true,
    },

    // ==========================================
    // BASIC TRANSACTION DETAILS
    // ==========================================

    amount: {
      type: Number,
      required: true,
    },

    merchant: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    // ==========================================
    // BEHAVIOURAL SIGNALS
    // ==========================================

    frequency: {
      type: String,
      enum: ["Normal", "Unusual", "High"],
      default: "Normal",
    },

    device: {
      type: String,
      enum: ["Known", "Unknown"],
      default: "Known",
    },

    // ==========================================
    // AI RISK RESULT
    // ==========================================

    status: {
      type: String,
      enum: ["Approved", "Blocked", "Pending"],
      default: "Pending",
    },

    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Transaction",
  transactionSchema
);