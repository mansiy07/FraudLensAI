import { useEffect, useState } from "react";
import "./Dashboard.css";

function RiskAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH RISK ALERTS
  // ==========================================

  useEffect(() => {
    const fetchRiskAlerts = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login again");
        }

        const response = await fetch(
          "http://localhost:5000/api/risk-alerts",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load risk alerts"
          );
        }

        setAlerts(data.alerts || []);
      } catch (err) {
        console.error("Risk alerts fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskAlerts();
  }, []);

  // ==========================================
  // SEVERITY
  // ==========================================

  const getSeverity = (risk) => {
    if (risk >= 80) return "Critical";
    if (risk >= 70) return "High";
    return "Medium";
  };

  // ==========================================
  // SEVERITY CLASS
  // ==========================================

  const getSeverityClass = (severity) => {
    if (severity === "Critical") return "blocked";
    if (severity === "High") return "review";
    return "safe";
  };

  // ==========================================
  // RISK CLASS
  // ==========================================

  const getRiskClass = (risk) => {
    if (risk >= 80) return "risk-high";
    if (risk >= 50) return "risk-medium";
    return "risk-low";
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="page-container">

        <div className="page-header">

          <div>
            <p className="eyebrow">
              THREAT MONITORING
            </p>

            <h1>
              Risk Alerts
            </h1>

            <p className="page-subtitle">
              Loading risk alerts...
            </p>
          </div>

          <span className="live-badge">
            LIVE
          </span>

        </div>

      </div>
    );
  }

  // ==========================================
  // CALCULATE STATS
  // ==========================================

  const activeAlerts = alerts.length;

  const criticalAlerts = alerts.filter(
    (alert) => alert.riskScore >= 80
  ).length;

  const highRiskAlerts = alerts.filter(
    (alert) => alert.riskScore >= 70
  ).length;

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="page-container">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>

          <p className="eyebrow">
            THREAT MONITORING
          </p>

          <h1>
            Risk Alerts
          </h1>

          <p className="page-subtitle">
            Review suspicious activities detected by
            the AI engine.
          </p>

        </div>

        <span className="live-badge">
          LIVE
        </span>

      </div>


      {/* ================= STATS ================= */}

      <div className="stats-grid">

        {/* ACTIVE ALERTS */}

        <div className="stat-card">

          <div className="stat-top">

            <span>
              Active Alerts
            </span>

            <div className="stat-icon danger">
              !
            </div>

          </div>

          <h2>
            {activeAlerts}
          </h2>

          <p className="negative">
            Requires attention
          </p>

        </div>


        {/* CRITICAL */}

        <div className="stat-card">

          <div className="stat-top">

            <span>
              Critical
            </span>

            <div className="stat-icon danger">
              !
            </div>

          </div>

          <h2>
            {criticalAlerts}
          </h2>

          <p className="negative">
            Immediate action
          </p>

        </div>


        {/* HIGH RISK */}

        <div className="stat-card">

          <div className="stat-top">

            <span>
              High Risk
            </span>

            <div className="stat-icon danger">
              !
            </div>

          </div>

          <h2>
            {highRiskAlerts}
          </h2>

          <p className="negative">
            Needs review
          </p>

        </div>


        {/* RESOLVED */}

        <div className="stat-card">

          <div className="stat-top">

            <span>
              Resolved
            </span>

            <div className="stat-icon">
              ✓
            </div>

          </div>

          <h2>
            0
          </h2>

          <p className="positive">
            This month
          </p>

        </div>

      </div>


      {/* ================= ERROR ================= */}

      {error && (
        <p
          style={{
            color: "#ff4d4d",
            padding: "20px 0",
          }}
        >
          {error}
        </p>
      )}


      {/* ================= ALERT TABLE ================= */}

      {!error && (
        <div className="panel">

          <div className="panel-header">

            <div>

              <p className="eyebrow">
                AI DETECTIONS
              </p>

              <h2>
                Recent Risk Alerts
              </h2>

            </div>

            <span className="live-badge">
              LIVE
            </span>

          </div>


          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>Alert ID</th>
                  <th>Alert</th>
                  <th>Transaction</th>
                  <th>Amount</th>
                  <th>Risk</th>
                  <th>Severity</th>
                </tr>

              </thead>


              <tbody>

                {alerts.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                      }}
                    >
                      No risk alerts found
                    </td>

                  </tr>

                ) : (

                  alerts.map((alert, index) => {

                    const risk =
                      Number(alert.riskScore) || 0;

                    const severity =
                      getSeverity(risk);

                    return (
                      <tr
                        key={
                          alert._id ||
                          alert.transactionId ||
                          index
                        }
                      >

                        {/* ALERT ID */}

                        <td>
                          ALT-{501 + index}
                        </td>


                        {/* ALERT */}

                        <td>
                          {risk >= 80
                            ? "High-value transaction detected"
                            : risk >= 70
                            ? "Unusual transaction pattern"
                            : "Suspicious transaction activity"}
                        </td>


                        {/* TRANSACTION */}

                        <td>
                          #{alert.transactionId}
                        </td>


                        {/* AMOUNT */}

                        <td>
                          ₹
                          {Number(
                            alert.amount
                          ).toLocaleString("en-IN")}
                        </td>


                        {/* RISK */}

                        <td>

                          <span
                            className={getRiskClass(
                              risk
                            )}
                          >
                            {risk}
                          </span>

                        </td>


                        {/* SEVERITY */}

                        <td>

                          <span
                            className={`status ${getSeverityClass(
                              severity
                            )}`}
                          >
                            {severity}
                          </span>

                        </td>

                      </tr>
                    );

                  })

                )}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
}

export default RiskAlerts;