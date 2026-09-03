import "./Dashboard.css";

function RiskAlerts() {
  const alerts = [
    {
      id: "ALT-501",
      title: "High-value transaction detected",
      transaction: "#TXN-84289",
      amount: "₹1,24,000",
      location: "Bengaluru, IN",
      risk: 89,
      severity: "Critical",
    },
    {
      id: "ALT-502",
      title: "Unusual transaction pattern",
      transaction: "#TXN-84287",
      amount: "₹72,300",
      location: "Hyderabad, IN",
      risk: 76,
      severity: "High",
    },
    {
      id: "ALT-503",
      title: "Multiple transactions from new location",
      transaction: "#TXN-84291",
      amount: "₹48,500",
      location: "Mumbai, IN",
      risk: 61,
      severity: "Medium",
    },
    {
      id: "ALT-504",
      title: "Suspicious login behaviour",
      transaction: "USER-1092",
      amount: "—",
      location: "Delhi, IN",
      risk: 54,
      severity: "Medium",
    },
  ];

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

      <div className="page-header">
        <div>
          <p className="eyebrow">THREAT MONITORING</p>

          <h1>Risk Alerts</h1>

          <p className="page-subtitle">
            Review suspicious activities detected by the AI engine.
          </p>
        </div>

        <span className="live-badge">
          LIVE
        </span>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-top">
            <span>Active Alerts</span>
            <div className="stat-icon danger">!</div>
          </div>

          <h2>24</h2>

          <p className="negative">
            Requires attention
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Critical</span>
            <div className="stat-icon danger">!</div>
          </div>

          <h2>3</h2>

          <p className="negative">
            Immediate action
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>High Risk</span>
            <div className="stat-icon danger">!</div>
          </div>

          <h2>8</h2>

          <p className="negative">
            Needs review
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <span>Resolved</span>
            <div className="stat-icon">✓</div>
          </div>

          <h2>142</h2>

          <p className="positive">
            This month
          </p>
        </div>

      </div>

      <div className="panel">

        <div className="panel-header">

          <div>
            <p className="eyebrow">AI DETECTIONS</p>

            <h2>Recent Risk Alerts</h2>
          </div>

          <button className="secondary-btn" type="button">
            View All
          </button>

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

              {alerts.map((alert) => (
                <tr key={alert.id}>

                  <td>{alert.id}</td>

                  <td>{alert.title}</td>

                  <td>{alert.transaction}</td>

                  <td>{alert.amount}</td>

                  <td>
                    <span className={getRiskClass(alert.risk)}>
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

      </div>

    </div>
  );
}

export default RiskAlerts;