import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hover, setHover] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      navigate("/adminpanel");
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage({ text: "Please enter username and password", type: "error" });
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:3000/api/admin/login", {
        username,
        password,
      });

      if (data?.token) {
        localStorage.setItem("token", data.token);
        setMessage({ text: "Login successful!", type: "success" });
        setIsLoggedIn(true);
        setTimeout(() => navigate("/adminpanel"), 800);
      } else {
        setMessage({ text: "Invalid credentials.", type: "error" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage({ text: "Login failed. Please try again.", type: "error" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setLoggedOut(true);
    setMessage({ text: "You have been logged out successfully.", type: "success" });

    setTimeout(() => {
      setLoggedOut(false);
      setMessage(null);
      navigate("/adminlogin");
    }, 1500);
  };

  // ---------------- Styles ----------------
  const styles = {
    page: {
      margin: 0,
      padding: 0,
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      background:
        "linear-gradient(135deg, #e3eeff 0%, #f9fbff 50%, #ffffff 100%)",
      color: "#333",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      width: "100%",
      maxWidth: "400px",
      padding: "3rem 2.5rem",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: "16px",
      boxShadow:
        "0 12px 32px rgba(19, 81, 216, 0.1), 0 2px 8px rgba(0,0,0,0.05)",
      textAlign: "center",
      transition: "all 0.3s ease",
    },
    logo: {
      width: "110px",
      height: "auto",
      marginBottom: "1.8rem",
      userSelect: "none",
    },
    heading: {
      fontSize: "1.8rem",
      marginBottom: "2rem",
      fontWeight: "700",
      color: "#1351d8",
      letterSpacing: "0.5px",
    },
    input: {
      width: "100%",
      padding: "0.9rem 1rem",
      marginBottom: "1.2rem",
      border: "1px solid #d0d7e2",
      borderRadius: "10px",
      fontSize: "1rem",
      outline: "none",
      backgroundColor: "#f9fbff",
      transition: "all 0.2s ease",
    },
    inputFocus: {
      borderColor: "#1351d8",
      boxShadow: "0 0 0 3px rgba(19, 81, 216, 0.15)",
    },
    button: {
      width: "100%",
      padding: "0.9rem 1rem",
      backgroundColor: hover ? "#1044b0" : "#1351d8",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: hover
        ? "0 6px 16px rgba(19, 81, 216, 0.25)"
        : "0 4px 12px rgba(19, 81, 216, 0.15)",
    },
    messageBox: {
      position: "fixed",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: message?.type === "error" ? "#fee2e2" : "#dcfce7",
      color: message?.type === "error" ? "#b91c1c" : "#166534",
      padding: "0.75rem 1.5rem",
      borderRadius: "8px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      zIndex: 9999,
      fontSize: "0.95rem",
      fontWeight: "500",
      transition: "opacity 0.3s ease",
    },
  };

  // ---------------- Render ----------------
  return (
    <div style={styles.page}>
      {message && <div style={styles.messageBox}>{message.text}</div>}

      <div style={styles.container}>
        {/* 🔹 Clean rectangular logo */}
        <img src="/xarvis-fav.png" alt="Xarvis Logo" style={styles.logo} />

        <h1 style={styles.heading}>Admin Login</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onFocus={(e) =>
            (e.target.style.boxShadow = styles.inputFocus.boxShadow)
          }
          onBlur={(e) => (e.target.style.boxShadow = "none")}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={(e) =>
            (e.target.style.boxShadow = styles.inputFocus.boxShadow)
          }
          onBlur={(e) => (e.target.style.boxShadow = "none")}
          style={styles.input}
        />
        <button
          style={styles.button}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
