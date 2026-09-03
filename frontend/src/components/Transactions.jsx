import { useEffect, useState } from "react";
import "./Dashboard.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/transactions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getRiskClass = (risk) => {
    if (risk >= 80) {
      return "risk-high";
    }

    if (risk >= 50) {
      return "risk-medium";
    }

    return "risk-low";
  };

  const getStatusClass = (status) => {
    if (status === "Blocked") {
      return "blocked";
    }

    if (status === "Review") {
      return "review";
    }

    return "safe";
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <div>
            <p className="eyebrow">
              TRANSACTION MONITORING
            </p>

            <h1>
              Transactions
            </h1>

            <p className="page-subtitle">
              Loading transactions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>
          <p className="eyebrow">
            TRANSACTION MONITORING
          </p>

          <h1>
            Transactions
          </h1>

          <p className="page-subtitle">
            Monitor and review all payment transactions
            processed by FraudLens AI.
          </p>
        </div>

        <button
          className="secondary-btn"
          type="button"
        >
          Export Data
        </button>

      </div>


      {/* ================= TRANSACTIONS PANEL ================= */}

      <div className="panel">

        <div className="panel-header">

          <div>
            <p className="eyebrow">
              TRANSACTION MONITOR
            </p>

            <h2>
              All Transactions
            </h2>
          </div>

          <span className="live-badge">
            LIVE
          </span>

        </div>


        {/* ================= ERROR ================= */}

        {error && (
          <p
            style={{
              color: "#ff4d4d",
              padding: "20px",
            }}
          >
            {error}
          </p>
        )}


        {/* ================= TABLE ================= */}

        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Merchant</th>
                <th>Location</th>
                <th>Risk Score</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {transactions.length === 0 ? (

                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    No transactions found
                  </td>
                </tr>

              ) : (

                transactions.map((transaction) => {

                  const risk =
                    transaction.riskScore || 0;

                  return (
                    <tr
                      key={transaction._id}
                    >

                      <td>
                        #
                        {transaction._id
                          .slice(-6)
                          .toUpperCase()}
                      </td>

                      <td>
                        ₹
                        {Number(
                          transaction.amount
                        ).toLocaleString("en-IN")}
                      </td>

                      <td>
                        {transaction.merchant}
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
                            transaction.status ||
                              "Safe"
                          )}`}
                        >
                          {transaction.status ||
                            "Safe"}
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

    </div>
  );
}

export default Transactions;