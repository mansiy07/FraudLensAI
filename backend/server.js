const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
const riskAlertRoutes = require("./routes/riskAlerts");
const aiAnalysisRoutes = require("./routes/aiAnalysis");
const auditLogRoutes = require("./routes/auditLogRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/risk-alerts", riskAlertRoutes);
app.use("/api/ai-analysis", aiAnalysisRoutes);
app.use("/api/audit-logs", auditLogRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "FraudLens AI Backend is running",
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });