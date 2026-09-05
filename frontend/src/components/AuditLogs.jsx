import { useEffect, useState } from "react";
import "./Dashboard.css";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "";

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_BASE_URL}/api/transactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();

        const transactions = Array.isArray(data)
          ? data
          : data.transactions || [];

        const generatedLogs = [];

        transactions.forEach((transaction, index) => {
          const transactionId =
            transaction.transactionId ||
            transaction._id ||
            `TXN-${index + 1}`;

          const createdAt =
            transaction.createdAt ||
            transaction.date ||
            new Date().toISOString();

          const formattedTime = new Date(createdAt).toLocaleString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }
          );

          const riskScore = Number(transaction.riskScore || 0);

          // Main transaction analysis log
          generatedLogs.push({
            id: `LOG-${transactionId}`,
            action: "AI Analysis Completed",
            user: "AI Engine",
            time: formattedTime,
            status: "Success",
          });

          // Risk-based activity
          if (riskScore >= 80) {
            generatedLogs.push({
              id: `RISK-${transactionId}`,
              action: "Transaction Blocked",
              user: "AI Engine",
              time: formattedTime,
              status: "Blocked",
            });
          } else if (riskScore >= 60) {
            generatedLogs.push({
              id: `RISK-${transactionId}`,
              action: "Transaction Requires Review",
              user: "AI Engine",
              time: formattedTime,
              status: "Detected",
            });
          }
        });

        // Latest activity first
        setLogs(generatedLogs.reverse());
      } catch (error) {
        console.error("Audit logs error:", error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <p className="eyebrow">SECURITY ACTIVITY</p>

          <h1>Audit Logs</h1>

          <p className="page-subtitle">
            Monitor system activity and security events.
          </p>
        </div>
      </div>

      <div className="panel">

        <div className="panel-header">
          <div>
            <p className="eyebrow">SYSTEM LOGS</p>

            <h2>Recent Activity</h2>
          </div>

          <span className="live-badge">
            LIVE
          </span>
        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Log ID</th>
                <th>Action</th>
                <th>User / Source</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="5">
                    Loading activity...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    No security activity found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>

                    <td>{log.id}</td>

                    <td>{log.action}</td>

                    <td>{log.user}</td>

                    <td>{log.time}</td>

                    <td>
                      <span
                        className={`status ${
                          log.status === "Blocked"
                            ? "blocked"
                            : log.status === "Detected"
                            ? "review"
                            : "safe"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AuditLogs;