const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");

const router = express.Router();

// ==========================================
// GET AI ANALYSIS
// ==========================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    // ==========================================
    // NO TRANSACTIONS
    // ==========================================
    if (transactions.length === 0) {
      return res.json({
        totalTransactions: 0,
        highRiskTransactions: 0,
        mediumRiskTransactions: 0,
        threatsPrevented: 0,
        averageRiskScore: 0,
        threatLevel: "Low",
        insight:
          "No transaction data available for analysis.",
      });
    }

    // ==========================================
    // TOTAL TRANSACTIONS
    // ==========================================
    const totalTransactions = transactions.length;

    // ==========================================
    // HIGH RISK
    // ==========================================
    const highRiskTransactions = transactions.filter(
      (transaction) =>
        Number(transaction.riskScore || 0) >= 70
    ).length;

    // ==========================================
    // MEDIUM RISK
    // ==========================================
    const mediumRiskTransactions = transactions.filter(
      (transaction) => {
        const score = Number(transaction.riskScore || 0);

        return score >= 50 && score < 70;
      }
    ).length;

    // ==========================================
    // THREATS PREVENTED
    // ==========================================
    const threatsPrevented = transactions.filter(
      (transaction) =>
        transaction.status === "Blocked"
    ).length;

    // ==========================================
    // AVERAGE RISK SCORE
    // ==========================================
    const totalRiskScore = transactions.reduce(
      (sum, transaction) =>
        sum + Number(transaction.riskScore || 0),
      0
    );

    const averageRiskScore = Math.round(
      totalRiskScore / totalTransactions
    );

    // ==========================================
    // THREAT LEVEL
    // ==========================================
    let threatLevel = "Low";

    let insight =
      "Transaction activity appears normal with low fraud probability.";

    if (averageRiskScore >= 70) {
      threatLevel = "High";

      insight =
        "High-risk activity detected. Immediate transaction review is recommended.";
    } else if (averageRiskScore >= 50) {
      threatLevel = "Medium";

      insight =
        "Some unusual transaction patterns have been detected. Further review is recommended.";
    }

    // ==========================================
    // RESPONSE
    // ==========================================
    res.status(200).json({
      totalTransactions,
      highRiskTransactions,
      mediumRiskTransactions,
      threatsPrevented,
      averageRiskScore,
      threatLevel,
      insight,
    });
  } catch (error) {
    console.error("AI analysis error:", error);

    res.status(500).json({
      message:
        "Server error while generating AI analysis",
    });
  }
});

module.exports = router;