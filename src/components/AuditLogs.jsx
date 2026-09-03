import "./Dashboard.css";

function AuditLogs() {
  const logs = [
    {
      id: "LOG-1001",
      action: "User Login",
      user: "Security Analyst",
      time: "31 Aug 2026, 09:42 PM",
      status: "Success",
    },
    {
      id: "LOG-1002",
      action: "Transaction Reviewed",
      user: "Security Analyst",
      time: "31 Aug 2026, 09:38 PM",
      status: "Success",
    },
    {
      id: "LOG-1003",
      action: "Risk Alert Generated",
      user: "AI Engine",
      time: "31 Aug 2026, 09:31 PM",
      status: "Detected",
    },
    {
      id: "LOG-1004",
      action: "AI Analysis Completed",
      user: "AI Engine",
      time: "31 Aug 2026, 09:24 PM",
      status: "Success",
    },
    {
      id: "LOG-1005",
      action: "Transaction Blocked",
      user: "AI Engine",
      time: "31 Aug 2026, 09:17 PM",
      status: "Blocked",
    },
  ];

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

              {logs.map((log) => (
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
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AuditLogs;