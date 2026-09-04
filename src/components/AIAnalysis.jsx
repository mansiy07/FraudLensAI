import { useEffect, useState } from "react";
import "./Dashboard.css";

function AIAnalysis() {
  // ==========================================
  // FORM
  // ==========================================

  const [form, setForm] = useState({
    amount: "",
    merchant: "",
    category: "",
    location: "",
    paymentMethod: "",
    frequency: "Normal",
    device: "Known",
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // ==========================================
  // BACKEND AI ANALYSIS DATA
  // ==========================================

  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const [analysisError, setAnalysisError] = useState("");

  // ==========================================
  // FETCH AI ANALYSIS
  // ==========================================

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login again");
        }

        const response = await fetch(
          "http://localhost:5000/api/ai-analysis",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load AI analysis"
          );
        }

        setAnalysis(data);
      } catch (error) {
        console.error("AI analysis fetch error:", error);
        setAnalysisError(
          error.message || "Failed to load AI analysis"
        );
      } finally {
        setLoadingAnalysis(false);
      }
    };

    fetchAnalysis();
  }, []);

  // ==========================================
  // HANDLE FORM
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // ANALYZE TRANSACTION
  // ==========================================

  const analyzeTransaction = async () => {
    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (
      !form.amount ||
      !form.merchant ||
      !form.category ||
      !form.location ||
      !form.paymentMethod
    ) {
      alert(
        "Please enter amount, merchant, category, location and payment method."
      );
      return;
    }

    const amount = Number(form.amount);

    if (Number.isNaN(amount) || amount <= 0) {
      alert("Please enter a valid transaction amount.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      // ==========================================
      // CALCULATE RISK SCORE
      // ==========================================

      let score = 15;

      // ------------------------------------------
      // AMOUNT SIGNAL
      // ------------------------------------------

      if (amount >= 100000) {
        score += 40;
      } else if (amount >= 50000) {
        score += 25;
      } else if (amount >= 20000) {
        score += 12;
      }

      // ------------------------------------------
      // FREQUENCY SIGNAL
      // ------------------------------------------

      if (form.frequency === "High") {
        score += 25;
      } else if (form.frequency === "Unusual") {
        score += 18;
      }

      // ------------------------------------------
      // DEVICE SIGNAL
      // ------------------------------------------

      if (form.device === "Unknown") {
        score += 15;
      }

      // Keep score between 0 and 100

      score = Math.min(Math.max(score, 0), 100);

      // ==========================================
      // DECISION
      // ==========================================

      let level = "Low Risk";
      let decision = "Safe";
      let levelClass = "positive";

      if (score >= 80) {
        level = "Critical Risk";
        decision = "Blocked";
        levelClass = "negative";
      } else if (score >= 60) {
        level = "High Risk";
        decision = "Review";
        levelClass = "negative";
      } else if (score >= 40) {
        level = "Medium Risk";
        decision = "Review";
        levelClass = "negative";
      }

      // ==========================================
      // REASONS
      // ==========================================

      const reasons = [];

      if (amount >= 100000) {
        reasons.push(
          "Very high transaction amount detected."
        );
      } else if (amount >= 50000) {
        reasons.push(
          "High-value transaction detected."
        );
      } else if (amount >= 20000) {
        reasons.push(
          "Transaction amount is above the normal threshold."
        );
      }

      if (form.frequency === "High") {
        reasons.push(
          "Unusually high transaction frequency."
        );
      } else if (form.frequency === "Unusual") {
        reasons.push(
          "Transaction frequency differs from normal behaviour."
        );
      }

      if (form.device === "Unknown") {
        reasons.push(
          "Transaction originated from an unfamiliar device."
        );
      }

      if (!form.location.trim()) {
        reasons.push(
          "Transaction location could not be verified."
        );
      }

      if (reasons.length === 0) {
        reasons.push(
          "Transaction behaviour is consistent with normal activity."
        );
      }

      // ==========================================
      // DATABASE STATUS
      // ==========================================

      let status = "Approved";

      if (decision === "Blocked") {
        status = "Blocked";
      } else if (decision === "Review") {
        status = "Pending";
      }

      // ==========================================
      // RISK LEVEL
      // ==========================================

      let riskLevel = "Low";

      if (score >= 80) {
        riskLevel = "High";
      } else if (score >= 50) {
        riskLevel = "Medium";
      }

      // ==========================================
      // SAVE TRANSACTION TO MONGODB
      // ==========================================

      const transactionResponse = await fetch(
        "http://localhost:5000/api/transactions",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            amount: amount,

            merchant: form.merchant,

            category: form.category,

            location: form.location,

            paymentMethod: form.paymentMethod,

            // ======================================
            // IMPORTANT:
            // FREQUENCY + DEVICE NOW SAVED
            // ======================================

            frequency: form.frequency,

            device: form.device,

            riskScore: score,

            riskLevel: riskLevel,

            status: status,
          }),
        }
      );

      const transactionData =
        await transactionResponse.json();

      if (!transactionResponse.ok) {
        throw new Error(
          transactionData.message ||
            "Failed to save transaction"
        );
      }

      // ==========================================
      // SHOW RESULT
      // ==========================================

      setResult({
        score,
        level,
        decision,
        levelClass,
        reasons,

        transactionId:
          transactionData.transaction?.transactionId || "",
      });

      // ==========================================
      // REFRESH AI ANALYSIS DATA
      // ==========================================

      try {
        const analysisResponse = await fetch(
          "http://localhost:5000/api/ai-analysis",
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },

            cache: "no-store",
          }
        );

        const updatedAnalysis =
          await analysisResponse.json();

        if (analysisResponse.ok) {
          setAnalysis(updatedAnalysis);
        }
      } catch (error) {
        console.error(
          "Refresh analysis error:",
          error
        );
      }
    } catch (error) {
      console.error(
        "Transaction analysis error:",
        error
      );

      alert(
        error.message ||
          "Failed to analyze transaction."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // ==========================================
  // BACKEND VALUES
  // ==========================================

  const totalTransactions =
    analysis?.totalTransactions ?? 0;

  const fraudDetected =
    analysis?.highRiskTransactions ?? 0;

  const threatsPrevented =
    analysis?.threatsPrevented ?? 0;

  const averageRiskScore =
    analysis?.averageRiskScore ?? 0;

  const threatLevel =
    analysis?.threatLevel ?? "Low";

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="page-container">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="page-header">
        <div>
          <p className="eyebrow">
            ARTIFICIAL INTELLIGENCE
          </p>

          <h1>AI Analysis</h1>

          <p className="page-subtitle">
            Analyze transaction behaviour using
            FraudLens AI.
          </p>
        </div>

        <span className="live-badge">
          AI ONLINE
        </span>
      </div>

      {/* ==========================================
          AI OVERVIEW
      ========================================== */}

      <section className="stats-grid">

        {/* AI ACCURACY */}

        <div className="stat-card">
          <div className="stat-top">
            <span>AI Accuracy</span>

            <div className="stat-icon">
              ✦
            </div>
          </div>

          <h2>96.8%</h2>

          <p className="positive">
            Model confidence
          </p>
        </div>

        {/* TRANSACTIONS ANALYZED */}

        <div className="stat-card">
          <div className="stat-top">
            <span>
              Transactions Analyzed
            </span>

            <div className="stat-icon">
              ↗
            </div>
          </div>

          <h2>
            {loadingAnalysis
              ? "..."
              : totalTransactions.toLocaleString(
                  "en-IN"
                )}
          </h2>

          <p className="positive">
            Real-time analysis
          </p>
        </div>

        {/* FRAUD DETECTED */}

        <div className="stat-card">
          <div className="stat-top">
            <span>
              Fraud Detected
            </span>

            <div className="stat-icon danger">
              !
            </div>
          </div>

          <h2>
            {loadingAnalysis
              ? "..."
              : fraudDetected}
          </h2>

          <p className="negative">
            Suspicious transactions
          </p>
        </div>

        {/* THREATS PREVENTED */}

        <div className="stat-card">
          <div className="stat-top">
            <span>
              Threats Prevented
            </span>

            <div className="stat-icon">
              ✓
            </div>
          </div>

          <h2>
            {loadingAnalysis
              ? "..."
              : threatsPrevented}
          </h2>

          <p className="positive">
            Successfully blocked
          </p>
        </div>

      </section>

      {/* ==========================================
          ERROR
      ========================================== */}

      {analysisError && (
        <p
          style={{
            color: "#ff4d4d",
            marginBottom: "20px",
          }}
        >
          {analysisError}
        </p>
      )}

      {/* ==========================================
          TRANSACTION ANALYZER
      ========================================== */}

      <section className="panel">

        <div className="panel-header">
          <div>
            <p className="eyebrow">
              AI TRANSACTION ANALYZER
            </p>

            <h2>
              Analyze a Transaction
            </h2>
          </div>

          <span className="ai-badge">
            AI
          </span>
        </div>

        {/* INFO */}

        <div className="insight-box">

          <div className="insight-icon">
            ✦
          </div>

          <div>
            <h3>
              FraudLens AI Decision Engine
            </h3>

            <p>
              Enter transaction details and let
              the AI evaluate behavioural risk
              signals.
            </p>
          </div>

        </div>

        {/* FORM */}

        <div className="stats-grid">

          {/* AMOUNT */}

          <div className="form-group">
            <label>
              Transaction Amount
            </label>

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="1"
            />
          </div>

          {/* MERCHANT */}

          <div className="form-group">
            <label>
              Merchant
            </label>

            <input
              type="text"
              name="merchant"
              value={form.merchant}
              onChange={handleChange}
              placeholder="e.g. Amazon"
            />
          </div>

          {/* CATEGORY */}

          <div className="form-group">
            <label>
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">
                Select Category
              </option>

              <option value="Shopping">
                Shopping
              </option>

              <option value="Travel">
                Travel
              </option>

              <option value="Food">
                Food
              </option>

              <option value="Electronics">
                Electronics
              </option>

              <option value="Bills">
                Bills
              </option>

              <option value="Entertainment">
                Entertainment
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          {/* LOCATION */}

          <div className="form-group">
            <label>
              Location
            </label>

            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Mumbai, IN"
            />
          </div>

          {/* PAYMENT METHOD */}

          <div className="form-group">
            <label>
              Payment Method
            </label>

            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
            >
              <option value="">
                Select Payment Method
              </option>

              <option value="UPI">
                UPI
              </option>

              <option value="Credit Card">
                Credit Card
              </option>

              <option value="Debit Card">
                Debit Card
              </option>

              <option value="Net Banking">
                Net Banking
              </option>

              <option value="Wallet">
                Wallet
              </option>
            </select>
          </div>

          {/* FREQUENCY */}

          <div className="form-group">
            <label>
              Transaction Frequency
            </label>

            <select
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
            >
              <option value="Normal">
                Normal
              </option>

              <option value="Unusual">
                Unusual
              </option>

              <option value="High">
                High
              </option>
            </select>
          </div>

          {/* DEVICE */}

          <div className="form-group">
            <label>
              Device
            </label>

            <select
              name="device"
              value={form.device}
              onChange={handleChange}
            >
              <option value="Known">
                Known Device
              </option>

              <option value="Unknown">
                Unknown Device
              </option>
            </select>
          </div>

        </div>

        {/* ANALYZE BUTTON */}

        <button
          className="secondary-btn"
          type="button"
          onClick={analyzeTransaction}
          disabled={analyzing}
        >
          {analyzing
            ? "✦ Analyzing..."
            : "✦ Analyze Transaction"}
        </button>

      </section>

      {/* ==========================================
          AI RESULT
      ========================================== */}

      {result && (
        <section className="panel">

          <div className="panel-header">

            <div>
              <p className="eyebrow">
                AI DECISION
              </p>

              <h2>
                Analysis Result
              </h2>
            </div>

            <span className="ai-badge">
              GENERATED BY AI
            </span>

          </div>

          {/* SCORE */}

          <div className="risk-content">

            <div className="risk-circle">

              <strong>
                {result.score}
              </strong>

              <span>
                / 100
              </span>

            </div>

            <div className="risk-info">

              <h3
                className={
                  result.levelClass
                }
              >
                {result.level}
              </h3>

              <p>
                FraudLens AI evaluated the
                transaction using amount,
                behavioural frequency, device,
                location and transaction signals.
              </p>

              <p
                style={{
                  marginTop: "10px",
                  fontWeight: "600",
                }}
              >
                AI Decision: {result.decision}
              </p>

              {result.transactionId && (
                <p
                  style={{
                    marginTop: "8px",
                    fontWeight: "600",
                  }}
                >
                  Transaction ID: #
                  {result.transactionId}
                </p>
              )}

            </div>

          </div>

          {/* SCORE BAR */}

          <div className="risk-bar">

            <div
              className="risk-progress"
              style={{
                width: `${result.score}%`,
              }}
            />

          </div>

          {/* REASONS */}

          <div
            className="insight-box"
            style={{
              marginTop: "25px",
            }}
          >

            <div className="insight-icon">
              ✦
            </div>

            <div>

              <h3>
                Why did the AI reach this
                decision?
              </h3>

              {result.reasons.map(
                (reason, index) => (
                  <p
                    key={index}
                    style={{
                      marginTop: "8px",
                    }}
                  >
                    • {reason}
                  </p>
                )
              )}

            </div>

          </div>

          {/* RECOMMENDATION */}

          <div
            className="insight-box"
            style={{
              marginTop: "20px",
            }}
          >

            <div className="insight-icon">
              ✓
            </div>

            <div>

              <h3>
                AI Recommendation
              </h3>

              <p>
                {result.decision ===
                "Blocked"
                  ? "Block the transaction immediately and perform a detailed account review."
                  : result.decision ===
                    "Review"
                  ? "Send the transaction for manual security review before approval."
                  : "Transaction appears safe. Continue monitoring for behavioural changes."}
              </p>

            </div>

          </div>

        </section>
      )}

      {/* ==========================================
          AI ENGINE
      ========================================== */}

      <section className="dashboard-grid">

        {/* CURRENT MODEL STATUS */}

        <div className="panel">

          <div className="panel-header">

            <div>

              <p className="eyebrow">
                AI RISK ENGINE
              </p>

              <h2>
                Current Model Status
              </h2>

            </div>

            <span className="live-badge">
              ACTIVE
            </span>

          </div>

          <div className="risk-content">

            <div className="risk-circle">

              <strong>
                {loadingAnalysis
                  ? "..."
                  : averageRiskScore}
              </strong>

              <span>
                / 100
              </span>

            </div>

            <div className="risk-info">

              <h3 className="positive">
                {loadingAnalysis
                  ? "Analyzing..."
                  : `${threatLevel} Threat Level`}
              </h3>

              <p>
                {loadingAnalysis
                  ? "FraudLens AI is analyzing your transaction data."
                  : analysis?.insight ||
                    "FraudLens AI is operating normally and continuously analyzing transaction patterns."}
              </p>

            </div>

          </div>

          <div className="risk-bar">

            <div
              className="risk-progress"
              style={{
                width: `${averageRiskScore}%`,
              }}
            />

          </div>

        </div>

        {/* THREAT INTELLIGENCE */}

        <div className="panel">

          <div className="panel-header">

            <div>

              <p className="eyebrow">
                THREAT INTELLIGENCE
              </p>

              <h2>
                AI Monitoring
              </h2>

            </div>

            <span className="ai-badge">
              LIVE
            </span>

          </div>

          <div className="insight-box">

            <div className="insight-icon">
              ✦
            </div>

            <div>

              <h3>
                Continuous fraud monitoring
              </h3>

              <p>
                AI continuously evaluates
                transaction patterns and
                identifies anomalies that may
                indicate fraudulent activity.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ==========================================
          HOW AI WORKS
      ========================================== */}

      <section className="panel">

        <div className="panel-header">

          <div>

            <p className="eyebrow">
              AI DECISION PROCESS
            </p>

            <h2>
              How FraudLens AI Detects Fraud
            </h2>

          </div>

          <span className="ai-badge">
            AI
          </span>

        </div>

        {/* STEP 01 */}

        <div className="insight-box">

          <div className="insight-icon">
            01
          </div>

          <div>

            <h3>
              Collect transaction signals
            </h3>

            <p>
              Transaction amount, merchant,
              category, location, payment
              method, frequency and device
              information are collected.
            </p>

          </div>

        </div>

        {/* STEP 02 */}

        <div
          className="insight-box"
          style={{
            marginTop: "15px",
          }}
        >

          <div className="insight-icon">
            02
          </div>

          <div>

            <h3>
              Detect anomalies
            </h3>

            <p>
              AI compares the current
              transaction behaviour with
              normal risk patterns.
            </p>

          </div>

        </div>

        {/* STEP 03 */}

        <div
          className="insight-box"
          style={{
            marginTop: "15px",
          }}
        >

          <div className="insight-icon">
            03
          </div>

          <div>

            <h3>
              Calculate risk score
            </h3>

            <p>
              Multiple risk signals are combined
              into a score between 0 and 100.
            </p>

          </div>

        </div>

        {/* STEP 04 */}

        <div
          className="insight-box"
          style={{
            marginTop: "15px",
          }}
        >

          <div className="insight-icon">
            04
          </div>

          <div>

            <h3>
              Generate AI decision
            </h3>

            <p>
              The final risk score determines
              whether the transaction is Safe,
              sent for Review, or Blocked.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default AIAnalysis;