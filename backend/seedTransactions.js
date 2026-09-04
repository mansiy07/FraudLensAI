require("dotenv").config();

const mongoose = require("mongoose");
const Transaction = require("./models/Transaction");
const User = require("./models/User");

const MONGO_URI = process.env.MONGO_URI;

const transactions = [
  {
    transactionId: "TXN-84291",
    amount: 48500,
    merchant: "Amazon India",
    category: "Shopping",
    location: "Mumbai, IN",
    paymentMethod: "Credit Card",
    riskScore: 61,
    status: "Pending",
  },
  {
    transactionId: "TXN-84290",
    amount: 8200,
    merchant: "Flipkart",
    category: "Shopping",
    location: "Delhi, IN",
    paymentMethod: "UPI",
    riskScore: 12,
    status: "Approved",
  },
  {
    transactionId: "TXN-84289",
    amount: 124000,
    merchant: "Luxury Electronics",
    category: "Electronics",
    location: "Bengaluru, IN",
    paymentMethod: "Credit Card",
    riskScore: 89,
    status: "Blocked",
  },
  {
    transactionId: "TXN-84288",
    amount: 16750,
    merchant: "Myntra",
    category: "Shopping",
    location: "Pune, IN",
    paymentMethod: "UPI",
    riskScore: 18,
    status: "Approved",
  },
  {
    transactionId: "TXN-84287",
    amount: 72300,
    merchant: "International Travel",
    category: "Travel",
    location: "Hyderabad, IN",
    paymentMethod: "Credit Card",
    riskScore: 76,
    status: "Pending",
  },
  {
    transactionId: "TXN-84286",
    amount: 5600,
    merchant: "Swiggy",
    category: "Food",
    location: "Chennai, IN",
    paymentMethod: "UPI",
    riskScore: 9,
    status: "Approved",
  },
];

async function seedTransactions() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");
    console.log("Database:", mongoose.connection.name);

    // EXACT logged-in user ID
    const user = await User.findById(
      "6a95da7dfecb9dd9cf16b117"
    );

    if (!user) {
      console.log("Logged-in user not found");
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log("Using user ID:", user._id.toString());
    console.log("Using email:", user.email);

    // Remove old seeded transactions
    await Transaction.deleteMany({
      transactionId: {
        $in: transactions.map(
          (transaction) => transaction.transactionId
        ),
      },
    });

    // Attach EXACT logged-in user's ID
    const transactionsWithUser = transactions.map(
      (transaction) => ({
        ...transaction,
        user: user._id,
      })
    );

    const inserted = await Transaction.insertMany(
      transactionsWithUser
    );

    console.log(
      `✅ ${inserted.length} transactions inserted successfully`
    );

    // Verify transactions for logged-in user
    const verify = await Transaction.find({
      user: user._id,
    });

    console.log(
      `Transactions for this user: ${verify.length}`
    );

    verify.forEach((transaction) => {
      console.log(
        transaction.transactionId,
        "|",
        transaction.status,
        "| user:",
        transaction.user.toString()
      );
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);

    await mongoose.connection.close();
    process.exit(1);
  }
}

seedTransactions();