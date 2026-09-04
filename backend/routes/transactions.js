const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");

const router = express.Router();

// ==========================================
// GET TRANSACTION STATS
// ==========================================
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    console.log("Stats - Logged-in user ID:", req.user.id);

    const transactions = await Transaction.find({
      user: req.user.id,
    });

    console.log("Stats - Transactions found:", transactions.length);

    const totalTransactions = transactions.length;

    const highRiskTransactions = transactions.filter(
      (transaction) => transaction.riskScore >= 70
    ).length;

    const fraudPrevented = transactions
      .filter((transaction) => transaction.status === "Blocked")
      .reduce(
        (total, transaction) => total + transaction.amount,
        0
      );

    const averageRiskScore =
      totalTransactions > 0
        ? Math.round(
            transactions.reduce(
              (total, transaction) =>
                total + transaction.riskScore,
              0
            ) / totalTransactions
          )
        : 0;

    res.status(200).json({
      totalTransactions,
      highRiskTransactions,
      fraudPrevented,
      averageRiskScore,
    });
  } catch (error) {
    console.error("Get transaction stats error:", error);

    res.status(500).json({
      message: "Server error while fetching transaction stats",
    });
  }
});

// ==========================================
// GET ALL TRANSACTIONS
// ==========================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("=================================");
    console.log("Logged-in user ID:", req.user.id);

    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    console.log("Transactions found:", transactions.length);
    console.log("=================================");

    res.status(200).json({
      transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error);

    res.status(500).json({
      message: "Server error while fetching transactions",
    });
  }
});

// ==========================================
// CREATE TRANSACTION
// ==========================================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      amount,
      merchant,
      category,
      location,
      paymentMethod,
      riskScore,
      riskLevel,
      status,
    } = req.body;

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------
    if (
      amount === undefined ||
      !merchant ||
      !category ||
      !location ||
      !paymentMethod
    ) {
      return res.status(400).json({
        message:
          "Amount, merchant, category, location and payment method are required",
      });
    }

    // ------------------------------------------
    // TRANSACTION ID
    // ------------------------------------------
    const transactionId = `TXN-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    // ------------------------------------------
    // SAFE DEFAULT VALUES
    // ------------------------------------------
    const finalRiskScore =
      typeof riskScore === "number" ? riskScore : 0;

    let finalRiskLevel = riskLevel || "Low";

    if (finalRiskScore >= 80) {
      finalRiskLevel = "High";
    } else if (finalRiskScore >= 50) {
      finalRiskLevel = "Medium";
    } else {
      finalRiskLevel = "Low";
    }

    let finalStatus = status || "Approved";

    if (finalRiskScore >= 80) {
      finalStatus = "Blocked";
    } else if (finalRiskScore >= 40) {
      finalStatus = "Pending";
    } else {
      finalStatus = "Approved";
    }

    // ------------------------------------------
    // SAVE TRANSACTION
    // ------------------------------------------
    const transaction = await Transaction.create({
      user: req.user.id,
      transactionId,

      amount: Number(amount),
      merchant,
      category,
      location,
      paymentMethod,

      riskScore: finalRiskScore,
      riskLevel: finalRiskLevel,
      status: finalStatus,
    });

    console.log("New transaction saved:", transaction);

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.error("Create transaction error:", error);

    res.status(500).json({
      message: "Server error while creating transaction",
    });
  }
});

module.exports = router;