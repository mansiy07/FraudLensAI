const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");

const router = express.Router();

// GET ALL TRANSACTIONS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// CREATE TRANSACTION
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      amount,
      merchant,
      category,
      location,
      paymentMethod,
    } = req.body;

    if (
      !amount ||
      !merchant ||
      !category ||
      !location ||
      !paymentMethod
    ) {
      return res.status(400).json({
        message: "All transaction fields are required",
      });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      amount,
      merchant,
      category,
      location,
      paymentMethod,
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.error("Create transaction error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;