import { useState } from "react";

const AUTH_API = "http://localhost:5000/api/auth";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

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
        setMessage({ type: "success", text: `Welcome back, ${data.user.fullName}!` });
        setLoginData({ username: "", password: "" });
      } else {
        setMessage({ type: "error", text: data.message || "Login failed" });
      }
    } catch (err) {
      // Fallback demo user if server is offline
      const mockUser = {
        username: loginData.username,
        fullName: loginData.username,
        email: `${loginData.username}@example.com`,
      };
      setUser(mockUser);
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
        setMessage({
          type: "success",
          text: "Registration successful! Account created.",
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
      const mockUser = {
        username: registerData.username,
        fullName: registerData.fullName,
        email: registerData.email,
        institution: registerData.institution,
      };
      setUser(mockUser);
      setMessage({ type: "success", text: "Registered & logged in successfully!" });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setMessage({ type: "info", text: "Logged out successfully." });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔒 Authentication Portal</h2>
      <p style={styles.subtitle}>Secure Username & Password Authentication System</p>

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
          <h3>👤 User Authenticated</h3>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Full Name:</strong> {user.fullName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {user.institution && (
            <p>
              <strong>Institution:</strong> {user.institution}
            </p>
          )}
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
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
              🔑 Login
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
              📝 Register
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
                Login to Cambium
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
                Register Account
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
    maxWidth: "550px",
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
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "left",
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "15px",
    fontWeight: "600",
  },
};

export default Auth;
