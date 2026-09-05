import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
const API_BASE_URL = window.location.hostname === "localhost" ? "http://localhost:5000" : "";
function Dashboard() {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    highRiskTransactions: 0,
    fraudPrevented: 0,
    averageRiskScore: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login again");
        }

        // ==========================================
        // GET ALL TRANSACTIONS
        // ==========================================

        const transactionResponse = await fetch(
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

        const transactionData =
          await transactionResponse.json();

        if (!transactionResponse.ok) {
          throw new Error(
            transactionData.message ||
              "Failed to load transactions"
          );
        }

        setTransactions(
          transactionData.transactions || []
        );

        // ==========================================
        // GET REAL TRANSACTION STATS
        // ==========================================

        const statsResponse = await fetch(
          `${API_BASE_URL}/api/transactions/stats`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const statsData =
          await statsResponse.json();

        if (!statsResponse.ok) {
          throw new Error(
            statsData.message ||
              "Failed to load transaction stats"
          );
        }

        console.log(
          "Dashboard Stats:",
          statsData
        );

        setStats({
          totalTransactions:
            statsData.totalTransactions || 0,

          highRiskTransactions:
            statsData.highRiskTransactions || 0,

          fraudPrevented:
            statsData.fraudPrevented || 0,

          averageRiskScore:
            statsData.averageRiskScore || 0,
        });

      } catch (err) {
        console.error(
          "Dashboard fetch error:",
          err
        );

        setError(err.message);

      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ==========================================
  // RISK CLASS
  // ==========================================

  const getRiskClass = (risk) => {
    if (risk >= 80) {
      return "risk-high";
    }

    if (risk >= 50) {
      return "risk-medium";
    }

    return "risk-low";
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    if (status === "Blocked") {
      return "blocked";
    }

    if (status === "Pending") {
      return "review";
    }

    if (status === "Approved") {
      return "safe";
    }

    return "safe";
  };

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="dashboard-content">

      {/* ================= HEADER ================= */}

      <header className="dashboard-header">

        <div>

          <p className="eyebrow">
            SECURITY OVERVIEW
          </p>

          <h1>
            Fraud Intelligence Dashboard
          </h1>

        </div>


        <div className="profile">

          <div className="profile-avatar">
            M
          </div>

          <div className="profile-info">

            <strong>
              Security Analyst
            </strong>

            <span>
              Administrator
            </span>

          </div>

        </div>

      </header>


      {/* ================= ERROR ================= */}

      {error && (
        <p
          style={{
            color: "#ff4d4d",
            marginBottom: "20px",
          }}
        >
          {error}
        </p>
      )}


      {/* ================= STATISTICS ================= */}

      <section className="stats-grid">

        {/* TOTAL TRANSACTIONS */}

        <div className="stat-card">

          <div className="stat-top">

            <span>
              Total Transactions
            </span>

            <div className="stat-icon">
              ↗
            </div>

          </div>

          <h2>
            {loading
              ? "..."
              : stats.totalTransactions}
          </h2>

          <p className="positive">
            Live database count
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
            {loading
              ? "..."
              : stats.highRiskTransactions}
          </h2>

          <p className="negative">
            Risk score ≥ 80
          </p>

        </div>


        {/* FRAUD PREVENTED */}

        <div className="stat-card">

          <div className="stat-top">

            <span>
              Fraud Prevented
            </span>

            <div className="stat-icon">
              ✓
            </div>

          </div>

          <h2>
            {loading
              ? "..."
              : `₹${Number(
                  stats.fraudPrevented
                ).toLocaleString("en-IN")}`}
          </h2>

          <p className="positive">
            Blocked transactions
          </p>

        </div>


        {/* AI ACCURACY */}

        <div className="stat-card">

          <div className="stat-top">

            <span>
              AI Accuracy
            </span>

            <div className="stat-icon">
              ✦
            </div>

          </div>

          <h2>
            96.8%
          </h2>

          <p className="positive">
            Model confidence
          </p>

        </div>

      </section>


      {/* ================= RISK + AI ================= */}

      <section className="dashboard-grid">

        {/* ================= RISK LEVEL ================= */}

        <div className="panel">

          <div className="panel-header">

            <div>

              <p className="eyebrow">
                AI RISK ENGINE
              </p>

              <h2>
                Current Risk Level
              </h2>

            </div>

            <span className="live-badge">
              LIVE
            </span>

          </div>


          <div className="risk-content">

            <div className="risk-circle">

              <strong>
                {loading
                  ? "..."
                  : stats.averageRiskScore}
              </strong>

              <span>
                / 100
              </span>

            </div>


            <div className="risk-info">

              <h3>
                {stats.averageRiskScore < 50
                  ? "Low Risk"
                  : stats.averageRiskScore < 80
                  ? "Medium Risk"
                  : "High Risk"}
              </h3>

              <p>
                AI models currently calculate
                the average fraud risk from
                your transactions.
              </p>

            </div>

          </div>


          <div className="risk-bar">

            <div
              className="risk-progress"
              style={{
                width: `${Math.min(
                  stats.averageRiskScore,
                  100
                )}%`,
              }}
            ></div>

          </div>


          <div className="risk-labels">

            <span>
              Low
            </span>

            <span>
              Medium
            </span>

            <span>
              High
            </span>

            <span>
              Critical
            </span>

          </div>

        </div>


        {/* ================= AI INSIGHT ================= */}

        <div className="panel">

          <div className="panel-header">

            <div>

              <p className="eyebrow">
                AI INSIGHT
              </p>

              <h2>
                Threat Intelligence
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
                Unusual activity detected
              </h3>

              <p>
                {stats.highRiskTransactions}{" "}
                high-risk transaction
                {stats.highRiskTransactions !== 1
                  ? "s"
                  : ""}{" "}
                detected in the current data.
              </p>

            </div>

          </div>


          <button
            className="secondary-btn"
            type="button"
            onClick={() =>
              navigate("/ai-analysis")
            }
          >
            View AI Analysis →
          </button>

        </div>

      </section>


      {/* ================= RECENT TRANSACTIONS ================= */}

      <section className="panel transactions-panel">

        <div className="panel-header">

          <div>

            <p className="eyebrow">
              REAL-TIME MONITORING
            </p>

            <h2>
              Recent Transactions
            </h2>

          </div>


          <button
            className="secondary-btn"
            type="button"
            onClick={() =>
              navigate("/transactions")
            }
          >
            View All
          </button>

        </div>


        {/* ================= TABLE ================= */}

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>
                  Transaction ID
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Location
                </th>

                <th>
                  Risk Score
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    Loading transactions...
                  </td>

                </tr>

              ) : transactions.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No transactions found
                  </td>

                </tr>

              ) : (

                transactions
                  .slice(0, 4)
                  .map((transaction) => {

                    const risk =
                      transaction.riskScore ?? 0;

                    return (

                      <tr
                        key={transaction._id}
                      >

                        <td>
                          #
                          {transaction.transactionId}
                        </td>


                        <td>
                          ₹
                          {Number(
                            transaction.amount
                          ).toLocaleString("en-IN")}
                        </td>


                        <td>
                          {transaction.location}
                        </td>


                        <td>

                          <span
                            className={getRiskClass(
                              risk
                            )}
                          >
                            {risk}
                          </span>

                        </td>


                        <td>

                          <span
                            className={`status ${getStatusClass(
                              transaction.status
                            )}`}
                          >
                            {transaction.status}
                          </span>

                        </td>

                      </tr>

                    );

                  })

              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;