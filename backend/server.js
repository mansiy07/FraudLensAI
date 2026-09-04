const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
const riskAlertRoutes = require("./routes/riskAlerts");
const aiAnalysisRoutes = require("./routes/aiAnalysis");
const auditLogRoutes = require("./routes/auditLogRoutes");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/risk-alerts", riskAlertRoutes);
app.use("/api/ai-analysis", aiAnalysisRoutes);
app.use("/api/audit-logs", auditLogRoutes);

// ==========================================
// API HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FraudLens AI Backend is running",
  });
});

// ==========================================
// PRODUCTION FRONTEND
// ==========================================

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  // Serve React static files
  app.use(express.static(frontendPath));

  // React Router fallback
  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ==========================================
// ROOT
// ==========================================

app.get("/", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.sendFile(
      path.join(__dirname, "../frontend/dist/index.html")
    );
  }

  res.json({
    message: "FraudLens AI Backend is running",
  });
});

// ==========================================
// DATABASE + SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });