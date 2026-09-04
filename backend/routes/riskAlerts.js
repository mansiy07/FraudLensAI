const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");

const router = express.Router();

// GET RISK ALERTS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const alerts = await Transaction.find({
      user: req.user.id,
      riskScore: { $gte: 50 },
    }).sort({ riskScore: -1, createdAt: -1 });

    res.json({
      alerts,
    });
  } catch (error) {
    console.error("Get risk alerts error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;