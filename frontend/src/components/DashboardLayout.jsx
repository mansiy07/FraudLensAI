import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard-layout">

      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-box">F</div>
          <h2>FraudLens AI</h2>
        </div>

        <nav className="sidebar-nav">

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">▦</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">◉</span>
            <span>Transactions</span>
          </NavLink>

          <NavLink
            to="/risk-alerts"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">△</span>
            <span>Risk Alerts</span>
          </NavLink>

          <NavLink
            to="/ai-analysis"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">✦</span>
            <span>AI Analysis</span>
          </NavLink>

          <NavLink
            to="/audit-logs"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">▤</span>
            <span>Audit Logs</span>
          </NavLink>

        </nav>

        <div className="sidebar-bottom">

          <div className="ai-status">
            <span className="status-dot"></span>
            <span>AI Engine Online</span>
          </div>

          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>

    </div>
  );
}

export default DashboardLayout;