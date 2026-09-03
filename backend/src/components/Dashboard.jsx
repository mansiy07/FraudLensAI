import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

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
            24,892
          </h2>

          <p className="positive">
            +12.8% this month
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
            187
          </h2>

          <p className="negative">
            +4.3% detected
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
            ₹18.4L
          </h2>

          <p className="positive">
            +18.2% protected
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
                23
              </strong>

              <span>
                / 100
              </span>

            </div>


            <div className="risk-info">

              <h3>
                Low Risk
              </h3>

              <p>
                AI models currently detect a low
                overall fraud probability.
              </p>

            </div>

          </div>


          <div className="risk-bar">
            <div className="risk-progress"></div>
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
                7 transactions show behavior
                similar to previously detected
                fraud patterns.
              </p>

            </div>

          </div>


          <button
            className="secondary-btn"
            type="button"
            onClick={() => navigate("/ai-analysis")}
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
            onClick={() => navigate("/transactions")}
          >
            View All
          </button>

        </div>


        <TransactionTable />

      </section>

    </div>
  );
}


/* ======================================================
   TRANSACTION TABLE
====================================================== */

function TransactionTable() {

  const transactions = [
    {
      id: "#TXN-84291",
      amount: "₹48,500",
      location: "Mumbai, IN",
      risk: 61,
      status: "Review",
    },

    {
      id: "#TXN-84290",
      amount: "₹8,200",
      location: "Delhi, IN",
      risk: 12,
      status: "Safe",
    },

    {
      id: "#TXN-84289",
      amount: "₹1,24,000",
      location: "Bengaluru, IN",
      risk: 89,
      status: "Blocked",
    },

    {
      id: "#TXN-84288",
      amount: "₹16,750",
      location: "Pune, IN",
      risk: 18,
      status: "Safe",
    },
  ];


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


  return (

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

          {transactions.map((transaction) => (

            <tr key={transaction.id}>

              <td>
                {transaction.id}
              </td>

              <td>
                {transaction.amount}
              </td>

              <td>
                {transaction.location}
              </td>

              <td>

                <span
                  className={getRiskClass(transaction.risk)}
                >
                  {transaction.risk}
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

          ))}

        </tbody>

      </table>

    </div>

  );
}


export default Dashboard;