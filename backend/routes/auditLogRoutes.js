const express = require("express");
const AuditLog = require("../models/AuditLog");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get audit logs for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const logs = await AuditLog.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      logs,
    });
  } catch (error) {
    console.error("Audit logs fetch error:", error);

    res.status(500).json({
      message: "Failed to fetch audit logs",
    });
  }
});

module.exports = router;