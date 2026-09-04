require("dotenv").config();

const mongoose = require("mongoose");
const AuditLog = require("./models/AuditLog");
const User = require("./models/User");

const MONGO_URI = process.env.MONGO_URI;

const logs = [
  {
    logId: "LOG-1001",
    action: "User Login",
    source: "Security Analyst",
    status: "Success",
  },
  {
    logId: "LOG-1002",
    action: "Transaction Reviewed",
    source: "Security Analyst",
    status: "Success",
  },
  {
    logId: "LOG-1003",
    action: "Risk Alert Generated",
    source: "AI Engine",
    status: "Detected",
  },
  {
    logId: "LOG-1004",
    action: "AI Analysis Completed",
    source: "AI Engine",
    status: "Success",
  },
  {
    logId: "LOG-1005",
    action: "Transaction Blocked",
    source: "AI Engine",
    status: "Blocked",
  },
];

async function seedAuditLogs() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    const user = await User.findOne({
      email: "mansiyadav2807@gmail.com",
    });

    if (!user) {
      console.log("User not found");
      process.exit(1);
    }

    console.log(
      "Using user ID:",
      user._id.toString()
    );

    await AuditLog.deleteMany({
      logId: {
        $in: logs.map((log) => log.logId),
      },
    });

    const logsWithUser = logs.map((log) => ({
      ...log,
      user: user._id,
    }));

    const inserted =
      await AuditLog.insertMany(logsWithUser);

    console.log(
      `✅ ${inserted.length} audit logs inserted successfully`
    );

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Seed audit logs error:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
}

seedAuditLogs();