import { useEffect, useState } from "react";
import "./Dashboard.css";

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "";

function RiskAlerts() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  // ==========================================
  // FETCH REAL TRANSACTIONS
  // ==========================================

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login again");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/transactions`,
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
            data.message || "Failed to load transactions"
          );
        }

        setTransactions(data.transactions || []);
      } catch (err) {
        console.error("Risk Alerts fetch error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // ==========================================
  // CREATE ALERTS FROM REAL TRANSACTIONS
  // ==========================================

  const alerts = transactions
    .filter(
      (transaction) =>
        Number(transaction.riskScore || 0) >= 40
    )
    .map((transaction, index) => {
      const risk = Number(transaction.riskScore || 0);

      let severity = "Medium";

      if (risk >= 80) {
        severity = "Critical";
      } else if (risk >= 60) {
        severity = "High";
      }

      let title = "Suspicious transaction detected";

      if (risk >= 80) {
        title = "Critical-risk transaction detected";
      } else if (risk >= 60) {
        title = "High-risk transaction detected";
      } else if (transaction.frequency === "High") {
        title = "Unusually high transaction frequency";
      } else if (transaction.device === "Unknown") {
        title = "Transaction from unknown device";
      } else if (transaction.location) {
        title = "Suspicious transaction activity detected";
      }

      return {
        id: `ALT-${501 + index}`,
        title,
        transaction: `#${transaction.transactionId || "N/A"}`,
        amount:
          transaction.amount !== undefined &&
          transaction.amount !== null
            ? `₹${Number(transaction.amount).toLocaleString("en-IN")}`
            : "—",
        location: transaction.location || "Unknown",
        risk,
        severity,
      };
    });

  // ==========================================
  // ALERT STATISTICS
  // ==========================================

  const activeAlerts = alerts.length;

  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === "Critical"
  ).length;

  const highRiskAlerts = alerts.filter(
    (alert) => alert.severity === "High"
  ).length;

  const getSeverityClass = (severity) => {
    if (severity === "Critical") return "blocked";
    if (severity === "High") return "review";
    return "safe";
  };

  const getRiskClass = (risk) => {
    if (risk >= 80) return "risk-high";
    if (risk >= 50) return "risk-medium";
    return "risk-low";
  };

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
            Review suspicious activities detected by the AI engine.
          </p>
        </div>

        <span className="live-badge">
          LIVE
        </span>
      </div>


      {/* ================= STATISTICS ================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-top">
            <span>Active Alerts</span>

            <div className="stat-icon danger">
              !
            </div>
          </div>

          <h2>
            {loading ? "..." : activeAlerts}
          </h2>

          <p className="negative">
            Requires attention
          </p>
        </div>


        <div className="stat-card">
          <div className="stat-top">
            <span>Critical</span>

            <div className="stat-icon danger">
              !
            </div>
          </div>

          <h2>
            {loading ? "..." : criticalAlerts}
          </h2>

          <p className="negative">
            Immediate action
          </p>
        </div>


        <div className="stat-card">
          <div className="stat-top">
            <span>High Risk</span>

            <div className="stat-icon danger">
              !
            </div>
          </div>

          <h2>
            {loading ? "..." : highRiskAlerts}
          </h2>

          <p className="negative">
            Needs review
          </p>
        </div>


        <div className="stat-card">
          <div className="stat-top">
            <span>Resolved</span>

            <div className="stat-icon">
              ✓
            </div>
          </div>

          <h2>0</h2>

          <p className="positive">
            This month
          </p>
        </div>

      </div>


      {/* ================= ALERT PANEL ================= */}

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


          <button
            className="secondary-btn"
            type="button"
            onClick={() => setShowAllAlerts(true)}
          >
            View All
          </button>

        </div>


        {error && (
          <div
            style={{
              padding: "20px",
              color: "#ff5c5c",
            }}
          >
            {error}
          </div>
        )}


        {!loading &&
          !error &&
          alerts.length === 0 && (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                color: "#8fa8c4",
              }}
            >
              No suspicious transactions detected.
            </div>
          )}


        {loading && (
          <div
            style={{
              padding: "30px",
              textAlign: "center",
              color: "#8fa8c4",
            }}
          >
            Loading risk alerts...
          </div>
        )}


        {!loading &&
          alerts.length > 0 && (
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

                  {alerts.map((alert) => (
                    <tr key={alert.id}>

                      <td>
                        {alert.id}
                      </td>

                      <td>
                        {alert.title}
                      </td>

                      <td>
                        {alert.transaction}
                      </td>

                      <td>
                        {alert.amount}
                      </td>

                      <td>
                        <span
                          className={getRiskClass(
                            alert.risk
                          )}
                        >
                          {alert.risk}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status ${getSeverityClass(
                            alert.severity
                          )}`}
                        >
                          {alert.severity}
                        </span>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

      </div>


      {/* =====================================================
          ALL ALERTS MODAL
      ===================================================== */}

      {showAllAlerts && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "30px",
          }}
          onClick={() => setShowAllAlerts(false)}
        >

          <div
            style={{
              width: "min(1100px, 95vw)",
              maxHeight: "85vh",
              overflowY: "auto",
              background: "#0b1a2d",
              border: "1px solid #29445f",
              borderRadius: "16px",
              padding: "28px",
              boxShadow:
                "0 25px 70px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >

              <div>

                <p className="eyebrow">
                  AI DETECTIONS
                </p>

                <h2
                  style={{
                    margin: "4px 0 0",
                    color: "#ffffff",
                  }}
                >
                  All Risk Alerts
                </h2>

                <p
                  style={{
                    color: "#8fa8c4",
                    marginTop: "8px",
                  }}
                >
                  Risk alerts generated from real transactions.
                </p>

              </div>


              <button
                type="button"
                onClick={() =>
                  setShowAllAlerts(false)
                }
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  border: "1px solid #304761",
                  background: "transparent",
                  color: "#ffffff",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                aria-label="Close alerts"
              >
                ×
              </button>

            </div>


            {/* ALL ALERTS TABLE */}

            {alerts.length === 0 ? (
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  color: "#8fa8c4",
                }}
              >
                No risk alerts available.
              </div>
            ) : (
              <div className="table-container">

                <table>

                  <thead>
                    <tr>
                      <th>Alert ID</th>
                      <th>Alert</th>
                      <th>Transaction</th>
                      <th>Location</th>
                      <th>Amount</th>
                      <th>Risk</th>
                      <th>Severity</th>
                    </tr>
                  </thead>

                  <tbody>

                    {alerts.map((alert) => (
                      <tr key={alert.id}>

                        <td>
                          {alert.id}
                        </td>

                        <td>
                          {alert.title}
                        </td>

                        <td>
                          {alert.transaction}
                        </td>

                        <td>
                          {alert.location}
                        </td>

                        <td>
                          {alert.amount}
                        </td>

                        <td>
                          <span
                            className={getRiskClass(
                              alert.risk
                            )}
                          >
                            {alert.risk}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`status ${getSeverityClass(
                              alert.severity
                            )}`}
                          >
                            {alert.severity}
                          </span>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}


            {/* MODAL FOOTER */}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "22px",
              }}
            >

              <button
                className="secondary-btn"
                type="button"
                onClick={() =>
                  setShowAllAlerts(false)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default RiskAlerts;