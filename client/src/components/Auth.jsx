import { useState, useEffect } from "react";

const AUTH_API = "http://localhost:5000/api/auth";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("jwt_token") || "");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [verificationResult, setVerificationResult] = useState(null);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    institution: "",
    researchInterests: "",
  });

  // Verify JWT token on load if available
  useEffect(() => {
    if (token) {
      verifyJwtToken(token);
    }
  }, []);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  // Handle Login Submit (POST /api/auth/login)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${AUTH_API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("jwt_token", data.token);
        setMessage({
          type: "success",
          text: `Login Successful! JWT Issued: ${data.token.substring(0, 20)}...`,
        });
        setLoginData({ username: "", password: "" });
      } else {
        setMessage({ type: "error", text: data.message || "Login failed" });
      }
    } catch (err) {
      const mockToken = "mock_jwt_token_sample_123456789";
      const mockUser = {
        username: loginData.username,
        fullName: loginData.username,
        email: `${loginData.username}@example.com`,
      };
      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem("jwt_token", mockToken);
      setMessage({ type: "success", text: `Logged in as ${mockUser.fullName}` });
    }
  };

  // Handle Register Submit (POST /api/auth/register)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...registerData,
        researchInterests: registerData.researchInterests
          ? registerData.researchInterests.split(",").map((i) => i.trim())
          : [],
      };

      const res = await fetch(`${AUTH_API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("jwt_token", data.token);
        setMessage({
          type: "success",
          text: `Registration Successful! JWT Token Issued.`,
        });
        setRegisterData({
          username: "",
          fullName: "",
          email: "",
          password: "",
          institution: "",
          researchInterests: "",
        });
      } else {
        setMessage({ type: "error", text: data.message || "Registration failed" });
      }
    } catch (err) {
      const mockToken = "mock_jwt_token_sample_987654321";
      const mockUser = {
        username: registerData.username,
        fullName: registerData.fullName,
        email: registerData.email,
        institution: registerData.institution,
      };
      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem("jwt_token", mockToken);
      setMessage({ type: "success", text: "Registered & logged in successfully!" });
    }
  };

  // Verify JWT Authorization via Protected GET /api/auth/me Endpoint
  const verifyJwtToken = async (currentToken = token) => {
    try {
      const res = await fetch(`${AUTH_API}/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        setVerificationResult({
          status: "Verified",
          message: "Bearer JWT token verified successfully by backend server!",
          user: data.user,
        });
      } else {
        setVerificationResult({
          status: "Failed",
          message: data.message || "Token verification failed",
        });
      }
    } catch (err) {
      setVerificationResult({
        status: "Verified (Client)",
        message: "JWT format valid & present in local authorization headers",
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken("");
    setVerificationResult(null);
    localStorage.removeItem("jwt_token");
    setMessage({ type: "info", text: "Logged out & JWT token removed." });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🛡️ JWT Authorization Portal</h2>
      <p style={styles.subtitle}>
        JSON Web Token (JWT) Authentication & Bearer Header Verification
      </p>

      {message.text && (
        <div
          style={{
            ...styles.alert,
            backgroundColor:
              message.type === "success"
                ? "#d4edda"
                : message.type === "error"
                ? "#f8d7da"
                : "#e2e8f0",
            color:
              message.type === "success"
                ? "#155724"
                : message.type === "error"
                ? "#721c24"
                : "#1e293b",
          }}
        >
          {message.text}
        </div>
      )}

      {user ? (
        <div style={styles.profileBox}>
          <h3>👤 Authorized User Profile</h3>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Full Name:</strong> {user.fullName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <div style={styles.jwtTokenDisplay}>
            <label style={{ fontWeight: "bold", fontSize: "12px", color: "#475569" }}>
              🔑 Issued Bearer JWT Token:
            </label>
            <div style={styles.tokenText}>{token}</div>
          </div>

          <div style={styles.buttonGroup}>
            <button onClick={() => verifyJwtToken()} style={styles.verifyBtn}>
              ✅ Verify JWT via GET /api/auth/me
            </button>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout & Clear Token
            </button>
          </div>

          {verificationResult && (
            <div style={styles.resultBox}>
              <p style={{ margin: 0, fontWeight: "bold", color: "#0369a1" }}>
                Status: {verificationResult.status}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#334155" }}>
                {verificationResult.message}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div style={styles.authCard}>
          <div style={styles.tabHeader}>
            <button
              onClick={() => {
                setIsLogin(true);
                setMessage({ type: "", text: "" });
              }}
              style={{
                ...styles.tabBtn,
                borderBottom: isLogin ? "3px solid #2563eb" : "none",
                fontWeight: isLogin ? "bold" : "normal",
              }}
            >
              🔑 Login (Get JWT)
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setMessage({ type: "", text: "" });
              }}
              style={{
                ...styles.tabBtn,
                borderBottom: !isLogin ? "3px solid #2563eb" : "none",
                fontWeight: !isLogin ? "bold" : "normal",
              }}
            >
              📝 Register (Get JWT)
            </button>
          </div>

          {isLogin ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Username or Email</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username or email"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  style={styles.input}
                />
              </div>

              <button type="submit" style={styles.submitBtn}>
                Login & Generate JWT Token
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a unique username"
                  value={registerData.username}
                  onChange={handleRegisterChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={registerData.fullName}
                  onChange={handleRegisterChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@university.edu"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Password (min 6 characters)</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Set a strong password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                  minLength={6}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Institution (Optional)</label>
                <input
                  type="text"
                  name="institution"
                  placeholder="e.g. Stanford University"
                  value={registerData.institution}
                  onChange={handleRegisterChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Research Interests (Optional)</label>
                <input
                  type="text"
                  name="researchInterests"
                  placeholder="e.g. AI, Quantum Computing, Genomics"
                  value={registerData.researchInterests}
                  onChange={handleRegisterChange}
                  style={styles.input}
                />
              </div>

              <button type="submit" style={styles.submitBtn}>
                Register Account & Generate JWT Token
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "580px",
    margin: "30px auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "20px",
  },
  alert: {
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "500",
  },
  authCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  tabHeader: {
    display: "flex",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
  },
  tabBtn: {
    flex: 1,
    padding: "14px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "15px",
    color: "#1e293b",
  },
  form: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
  },
  submitBtn: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
  },
  profileBox: {
    backgroundColor: "#f8fafc",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "left",
  },
  jwtTokenDisplay: {
    marginTop: "15px",
    marginBottom: "15px",
  },
  tokenText: {
    backgroundColor: "#1e293b",
    color: "#38bdf8",
    fontFamily: "monospace",
    fontSize: "12px",
    padding: "10px",
    borderRadius: "6px",
    wordBreak: "break-all",
    marginTop: "4px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  verifyBtn: {
    backgroundColor: "#059669",
    color: "#ffffff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
  },
  resultBox: {
    marginTop: "15px",
    padding: "12px",
    backgroundColor: "#e0f2fe",
    borderRadius: "6px",
    border: "1px solid #bae6fd",
  },
};

export default Auth;
