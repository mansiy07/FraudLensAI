import { useEffect, useState } from "react";
import "./Dashboard.css";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH AUDIT LOGS
  // ==========================================

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login again");
        }

        const response = await fetch(
          "http://localhost:5000/api/audit-logs",
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
            data.message || "Failed to load audit logs"
          );
        }

        setLogs(data.logs || []);
      } catch (err) {
        console.error("Audit logs fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    if (status === "Blocked") {
      return "blocked";
    }

    if (status === "Detected") {
      return "review";
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
              SECURITY ACTIVITY
            </p>

            <h1>
              Audit Logs
            </h1>

            <p className="page-subtitle">
              Loading system activity...
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

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>

          <p className="eyebrow">
            SECURITY ACTIVITY
          </p>

          <h1>
            Audit Logs
          </h1>

          <p className="page-subtitle">
            Monitor system activity and security events.
          </p>

        </div>

      </div>


      {/* ================= PANEL ================= */}

      <div className="panel">

        <div className="panel-header">

          <div>

            <p className="eyebrow">
              SYSTEM LOGS
            </p>

            <h2>
              Recent Activity
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

        {!error && (

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

                {logs.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                      }}
                    >
                      No audit logs found
                    </td>

                  </tr>

                ) : (

                  logs.map((log, index) => (

                    <tr
                      key={log.id || index}
                    >

                      <td>
                        {log.id}
                      </td>

                      <td>
                        {log.action}
                      </td>

                      <td>
                        {log.user}
                      </td>

                      <td>
                        {log.time ||
                          "Recently"}
                      </td>

                      <td>

                        <span
                          className={`status ${getStatusClass(
                            log.status
                          )}`}
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

        )}

      </div>

    </div>
  );
}

export default AuditLogs;