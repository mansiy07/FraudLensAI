import { useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import RiskAlerts from "./components/RiskAlerts";
import AIAnalysis from "./components/AIAnalysis";
import AuditLogs from "./components/AuditLogs";
import DashboardLayout from "./components/DashboardLayout";

import "./App.css";

// Local → localhost backend
// Railway → same Railway domain
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [isCreateAccount, setIsCreateAccount] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register
  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Common
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ================= LOGIN =================

  const handleLogin = async () => {
    setError("");
    setSuccess("");

    if (!loginEmail.trim() || !loginPassword) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginEmail.trim(),
            password: loginPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      // Save login information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setIsLoggedIn(true);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  // ================= REGISTER =================

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (
      !name.trim() ||
      !registerEmail.trim() ||
      !registerPassword ||
      !confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (registerPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (registerPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: registerEmail.trim(),
            password: registerPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      // Save login information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setIsLoggedIn(true);

      navigate("/dashboard");
    } catch (error) {
      console.error("Register error:", error);
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setIsCreateAccount(false);

    setLoginEmail("");
    setLoginPassword("");

    navigate("/");
  };

  // ================= PROTECTED ROUTE =================

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <Routes>

      {/* ================= LOGIN / REGISTER ================= */}

      <Route
        path="/"
        element={
          <div className="app">

            <div className="login-card">

              {/* Brand */}

              <div className="brand">
                <div className="brand-icon">F</div>
                <span>FraudLens AI</span>
              </div>

              {/* ================= LOGIN ================= */}

              {!isCreateAccount ? (
                <>
                  <h1>Welcome back</h1>

                  <p className="subtitle">
                    Sign in to your fraud intelligence dashboard.
                  </p>

                  <div className="form-group">
                    <label>Email address</label>

                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        setError("");
                      }}
                    />
                  </div>

                  <div className="form-group">

                    <div className="password-label">
                      <label>Password</label>

                      <button
                        type="button"
                        className="forgot-btn"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleLogin();
                        }
                      }}
                    />

                  </div>

                  {/* ERROR */}

                  {error && (
                    <div
                      style={{
                        color: "#ff4d4f",
                        backgroundColor: "#fff1f0",
                        border: "1px solid #ffccc7",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        marginBottom: "15px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {/* SUCCESS */}

                  {success && (
                    <div
                      style={{
                        color: "#237804",
                        backgroundColor: "#f6ffed",
                        border: "1px solid #b7eb8f",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        marginBottom: "15px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {success}
                    </div>
                  )}

                  <button
                    type="button"
                    className="signin-btn"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>

                  <div className="create-account">
                    <span>Don't have an account?</span>

                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setSuccess("");
                        setIsCreateAccount(true);
                      }}
                    >
                      Create account
                    </button>
                  </div>
                </>

              ) : (

                /* ================= REGISTER ================= */

                <>
                  <h1>Create account</h1>

                  <p className="subtitle">
                    Create your FraudLens AI security account.
                  </p>

                  <div className="form-group">
                    <label>Full name</label>

                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError("");
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email address</label>

                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={registerEmail}
                      onChange={(e) => {
                        setRegisterEmail(e.target.value);
                        setError("");
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Password</label>

                    <input
                      type="password"
                      placeholder="Create a password"
                      value={registerPassword}
                      onChange={(e) => {
                        setRegisterPassword(e.target.value);
                        setError("");
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm password</label>

                    <input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                    />
                  </div>

                  {/* ERROR */}

                  {error && (
                    <div
                      style={{
                        color: "#ff4d4f",
                        backgroundColor: "#fff1f0",
                        border: "1px solid #ffccc7",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        marginBottom: "15px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {/* SUCCESS */}

                  {success && (
                    <div
                      style={{
                        color: "#237804",
                        backgroundColor: "#f6ffed",
                        border: "1px solid #b7eb8f",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        marginBottom: "15px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {success}
                    </div>
                  )}

                  <button
                    type="button"
                    className="signin-btn"
                    onClick={handleRegister}
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create account"}
                  </button>

                  <div className="create-account">
                    <span>Already have an account?</span>

                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setSuccess("");
                        setIsCreateAccount(false);
                      }}
                    >
                      Sign in
                    </button>
                  </div>
                </>
              )}

            </div>

            {/* Security */}

            <div className="security-message">
              <span className="status-dot"></span>
              Protected by AI-powered risk intelligence
            </div>

          </div>
        }
      />

      {/* ================================================= */}
      {/*              PROTECTED DASHBOARD AREA             */}
      {/* ================================================= */}

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >

        {/* ================= DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={<Dashboard onLogout={handleLogout} />}
        />

        {/* ================= TRANSACTIONS ================= */}

        <Route
          path="/transactions"
          element={<Transactions onLogout={handleLogout} />}
        />

        {/* ================= RISK ALERTS ================= */}

        <Route
          path="/risk-alerts"
          element={<RiskAlerts onLogout={handleLogout} />}
        />

        {/* ================= AI ANALYSIS ================= */}

        <Route
          path="/ai-analysis"
          element={<AIAnalysis onLogout={handleLogout} />}
        />

        {/* ================= AUDIT LOGS ================= */}

        <Route
          path="/audit-logs"
          element={<AuditLogs onLogout={handleLogout} />}
        />

      </Route>

      {/* ================= UNKNOWN URL ================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;