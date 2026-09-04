import { useState } from "react";
import "./Dashboard.css";

function AIAnalysis() {
  const [form, setForm] = useState({
    amount: "",
    location: "",
    frequency: "Normal",
    device: "Known",
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const analyzeTransaction = () => {
    if (!form.amount || !form.location) {
      alert("Please enter amount and location.");
      return;
    }

    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      let score = 15;
      const amount = Number(form.amount);

      if (amount >= 100000) {
        score += 40;
      } else if (amount >= 50000) {
        score += 25;
      } else if (amount >= 20000) {
        score += 12;
      }

      if (form.frequency === "High") {
        score += 25;
      } else if (form.frequency === "Unusual") {
        score += 18;
      }

      if (form.device === "Unknown") {
        score += 15;
      }

      score = Math.min(score, 100);

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

      const reasons = [];

      if (amount >= 100000) {
        reasons.push("Very high transaction amount detected.");
      } else if (amount >= 50000) {
        reasons.push("High-value transaction detected.");
      }

      if (form.frequency === "High") {
        reasons.push("Unusually high transaction frequency.");
      } else if (form.frequency === "Unusual") {
        reasons.push("Transaction frequency differs from normal behaviour.");
      }

      if (form.device === "Unknown") {
        reasons.push("Transaction originated from an unfamiliar device.");
      }

      if (reasons.length === 0) {
        reasons.push(
          "Transaction behaviour is consistent with normal activity."
        );
      }

      setResult({
        score,
        level,
        decision,
        levelClass,
        reasons,
      });

      setAnalyzing(false);
    }, 1800);
  };

  return (
    <div className="page-container">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>
          <p className="eyebrow">
            ARTIFICIAL INTELLIGENCE
          </p>

          <h1>
            AI Analysis
          </h1>

          <p className="page-subtitle">
            Analyze transaction behaviour using FraudLens AI.
          </p>
        </div>

        <span className="live-badge">
          AI ONLINE
        </span>

      </div>


      {/* ================= AI OVERVIEW ================= */}

      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-top">
            <span>AI Accuracy</span>
            <div className="stat-icon">✦</div>
          </div>

          <h2>96.8%</h2>

          <p className="positive">
            Model confidence
          </p>
        </div>


        <div className="stat-card">
          <div className="stat-top">
            <span>Transactions Analyzed</span>
            <div className="stat-icon">↗</div>
          </div>

          <h2>24,892</h2>

          <p className="positive">
            Real-time analysis
          </p>
        </div>


        <div className="stat-card">
          <div className="stat-top">
            <span>Fraud Detected</span>
            <div className="stat-icon danger">!</div>
          </div>

          <h2>187</h2>

          <p className="negative">
            Suspicious transactions
          </p>
        </div>


        <div className="stat-card">
          <div className="stat-top">
            <span>Threats Prevented</span>
            <div className="stat-icon">✓</div>
          </div>

          <h2>164</h2>

          <p className="positive">
            Successfully blocked
          </p>
        </div>

      </section>


      {/* ================= TRANSACTION ANALYZER ================= */}

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


        <div className="insight-box">

          <div className="insight-icon">
            ✦
          </div>

          <div>

            <h3>
              FraudLens AI Decision Engine
            </h3>

            <p>
              Enter transaction details and let the AI
              evaluate behavioural risk signals.
            </p>

          </div>

        </div>


        {/* FORM */}

        <div className="stats-grid">

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
            />

          </div>


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


        <button
          className="secondary-btn"
          type="button"
          onClick={analyzeTransaction}
          disabled={analyzing}
        >

          {analyzing
            ? "✦ AI is analyzing..."
            : "✦ Analyze Transaction"
          }

        </button>

      </section>


      {/* ================= AI RESULT ================= */}

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

              <h3 className={result.levelClass}>
                {result.level}
              </h3>

              <p>
                FraudLens AI evaluated the transaction
                using amount, behavioural frequency,
                device and transaction signals.
              </p>

              <p
                style={{
                  marginTop: "10px",
                  fontWeight: "700",
                }}
              >
                AI Decision: {result.decision}
              </p>

            </div>

          </div>


          {/* SCORE BAR */}

          <div className="risk-bar">

            <div
              className="risk-progress"
              style={{
                width: `${result.score}%`,
              }}
            ></div>

          </div>


          {/* REASONS */}

          <div
            className="insight-box"
            style={{ marginTop: "25px" }}
          >

            <div className="insight-icon">
              ✦
            </div>

            <div>

              <h3>
                Why did the AI reach this decision?
              </h3>

              {result.reasons.map((reason, index) => (
                <p
                  key={index}
                  style={{ marginTop: "8px" }}
                >
                  • {reason}
                </p>
              ))}

            </div>

          </div>


          {/* RECOMMENDATION */}

          <div className="insight-box">

            <div className="insight-icon">
              ✓
            </div>

            <div>

              <h3>
                AI Recommendation
              </h3>

              <p>

                {result.decision === "Blocked"
                  ? "Block the transaction immediately and perform a detailed account review."
                  : result.decision === "Review"
                  ? "Send the transaction for manual security review before approval."
                  : "Transaction appears safe. Continue monitoring for behavioural changes."
                }

              </p>

            </div>

          </div>

        </section>

      )}


      {/* ================= AI ENGINE ================= */}

      <section className="dashboard-grid">

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
                97
              </strong>

              <span>
                / 100
              </span>

            </div>


            <div className="risk-info">

              <h3>
                High Confidence
              </h3>

              <p>
                FraudLens AI is operating normally and
                continuously analyzing transaction patterns.
              </p>

            </div>

          </div>


          <div className="risk-bar">

            <div
              className="risk-progress"
              style={{ width: "97%" }}
            ></div>

          </div>

        </div>


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
                AI continuously evaluates transaction
                patterns and identifies anomalies that
                may indicate fraudulent activity.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= HOW AI WORKS ================= */}

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


        <div className="insight-box">

          <div className="insight-icon">
            01
          </div>

          <div>

            <h3>
              Collect transaction signals
            </h3>

            <p>
              Transaction amount, location, frequency
              and device information are collected.
            </p>

          </div>

        </div>


        <div className="insight-box">

          <div className="insight-icon">
            02
          </div>

          <div>

            <h3>
              Detect anomalies
            </h3>

            <p>
              AI compares the current behaviour with
              normal transaction patterns.
            </p>

          </div>

        </div>


        <div className="insight-box">

          <div className="insight-icon">
            03
          </div>

          <div>

            <h3>
              Calculate risk score
            </h3>

            <p>
              Multiple risk signals are combined into
              a score between 0 and 100.
            </p>

          </div>

        </div>


        <div className="insight-box">

          <div className="insight-icon">
            04
          </div>

          <div>

            <h3>
              Generate AI decision
            </h3>

            <p>
              The final risk score determines whether
              the transaction is Safe, Review or Blocked.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default AIAnalysis;