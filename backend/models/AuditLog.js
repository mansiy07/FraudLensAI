const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    logId: {
      type: String,
      required: true,
      unique: true,
    },

    action: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["Success", "Detected", "Blocked"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);