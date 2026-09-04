import { useEffect, useState } from "react";
import "./Dashboard.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState("");

  // ==========================================
  // FETCH TRANSACTIONS
  // ==========================================

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login again");
        }

        const response = await fetch(
          "http://localhost:5000/api/transactions",
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
            data.message || "Failed to load transactions"
          );
        }

        setTransactions(data.transactions || []);
      } catch (err) {
        console.error("Transaction fetch error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // ==========================================
  // EXPORT DATA
  // ==========================================

  const handleExport = () => {
    console.log("EXPORT BUTTON CLICKED");

    if (!transactions || transactions.length === 0) {
      setExportMessage("No transactions available to export.");
      return;
    }

    try {
      setExporting(true);
      setExportMessage("Preparing CSV file...");

      const headers = [
        "Transaction ID",
        "Amount",
        "Merchant",
        "Category",
        "Location",
        "Payment Method",
        "Risk Score",
        "Risk Level",
        "Status",
      ];

      const rows = transactions.map((transaction) => [
        transaction.transactionId ?? "",
        transaction.amount ?? "",
        transaction.merchant ?? "",
        transaction.category ?? "",
        transaction.location ?? "",
        transaction.paymentMethod ?? "",
        transaction.riskScore ?? 0,
        transaction.riskLevel ?? "",
        transaction.status ?? "",
      ]);

      const escapeCSV = (value) => {
        const text = String(value ?? "");
        return `"${text.replace(/"/g, '""')}"`;
      };

      const csvContent = [headers, ...rows]
        .map((row) => row.map(escapeCSV).join(","))
        .join("\r\n");

      // UTF-8 BOM so Excel displays ₹ and other Unicode correctly.
      const csvFile = "\uFEFF" + csvContent;

      const blob = new Blob([csvFile], {
        type: "text/csv;charset=utf-8;",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "FraudLens-Transactions.csv";
      link.style.display = "none";

      document.body.appendChild(link);

      // Native browser download.
      link.click();

      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 2000);

      setExportMessage("FraudLens-Transactions.csv downloaded successfully.");

      setTimeout(() => {
        setExportMessage("");
      }, 3000);
    } catch (err) {
      console.error("Export error:", err);
      setExportMessage("Unable to export transactions.");
    } finally {
      setExporting(false);
    }
  };

  // ==========================================
  // RISK CLASS
  // ==========================================

  const getRiskClass = (risk) => {
    const score = Number(risk) || 0;

    if (score >= 80) {
      return "risk-high";
    }

    if (score >= 50) {
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
  // LOADING
  // ==========================================

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

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="page-container">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="page-header">

        <div>

          <p className="eyebrow">
            TRANSACTION MONITORING
          </p>

          <h1>
            Transactions
          </h1>

          <p className="page-subtitle">
            Monitor and review all payment
            transactions processed by FraudLens AI.
          </p>

        </div>

        {/* ====================================
            EXPORT BUTTON
        ==================================== */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "8px",
            position: "relative",
            zIndex: 100000,
            pointerEvents: "auto",
          }}
        >
          <button
            type="button"
            className="secondary-btn"
            onClick={handleExport}
            disabled={transactions.length === 0 || exporting}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: 100001,
              pointerEvents:
                transactions.length === 0 || exporting
                  ? "none"
                  : "auto",
              cursor:
                transactions.length === 0 || exporting
                  ? "not-allowed"
                  : "pointer",
              minWidth: "120px",
            }}
          >
            {exporting
              ? "Exporting..."
              : transactions.length > 0
              ? "Export Data"
              : "No Data"}
          </button>

          {exportMessage && (
            <span
              style={{
                color: "#22c55e",
                fontSize: "12px",
                fontWeight: "600",
                textAlign: "right",
              }}
            >
              {exportMessage}
            </span>
          )}
        </div>

      </div>

      {/* ======================================
          TRANSACTIONS PANEL
      ====================================== */}

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

        {/* ====================================
            ERROR
        ==================================== */}

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

        {/* ====================================
            TABLE
        ==================================== */}

        {!error && (
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
                    Merchant
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

                {transactions.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                      }}
                    >
                      No transactions found
                    </td>

                  </tr>

                ) : (

                  transactions.map(
                    (transaction) => {

                      const risk =
                        Number(
                          transaction.riskScore
                        ) || 0;

                      return (
                        <tr
                          key={
                            transaction._id ||
                            transaction.transactionId
                          }
                        >

                          {/* TRANSACTION ID */}

                          <td>
                            #
                            {
                              transaction.transactionId
                            }
                          </td>

                          {/* AMOUNT */}

                          <td>
                            ₹
                            {Number(
                              transaction.amount
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          {/* MERCHANT */}

                          <td>
                            {
                              transaction.merchant
                            }
                          </td>

                          {/* LOCATION */}

                          <td>
                            {
                              transaction.location
                            }
                          </td>

                          {/* RISK SCORE */}

                          <td>

                            <span
                              className={getRiskClass(
                                risk
                              )}
                            >
                              {risk}
                            </span>

                          </td>

                          {/* STATUS */}

                          <td>

                            <span
                              className={`status ${getStatusClass(
                                transaction.status
                              )}`}
                            >
                              {
                                transaction.status ===
                                "Pending"
                                  ? "Review"
                                  : transaction.status
                              }
                            </span>

                          </td>

                        </tr>
                      );
                    }
                  )

                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default Transactions;