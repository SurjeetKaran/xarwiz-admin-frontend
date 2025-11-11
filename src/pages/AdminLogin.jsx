import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  // --- UPDATED: 'username' is now 'email' ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // --- NEW: Added state for role ---
  const [role, setRole] = useState("author"); // Default to 'author'

  const [hover, setHover] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [loggedOut, setLoggedOut] = useState(false); // This state wasn't used, safe to remove if you want
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      navigate("/adminpanel");
    }
  }, [navigate]);

  const handleLogin = async () => {
    // --- UPDATED: Check for 'email' ---
    if (!email || !password) {
      setMessage({ text: "Please enter email and password", type: "error" });
      return;
    }

    try {
      const { data } = await axios.post(
        "https://xarwiz-admin-backend.onrender.com/api/admin/login",
        {
          // --- UPDATED: Send email, password, and role ---
          email,
          password,
          role,
        }
      );

      // --- UPDATED: Check for user object as well ---
      if (data?.token && data?.user) {
        localStorage.setItem("token", data.token);
        // --- NEW: Save the user info (which includes the role) ---
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage({ text: "Login successful!", type: "success" });
        setIsLoggedIn(true);
        setTimeout(() => navigate("/adminpanel"), 800);
      } else {
        setMessage({
          text: data.message || "Invalid credentials.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage({
        text: error.response?.data?.message || "Login failed. Please try again.",
        type: "error",
      });
    }
  };

  // Note: Your app should have a component with a logout button that calls this
  const handleLogout = () => {
    localStorage.removeItem("token");
    // --- NEW: Remove user info on logout ---
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    // setLoggedOut(true);
    setMessage({ text: "You have been logged out successfully.", type: "success" });

    setTimeout(() => {
      // setLoggedOut(false);
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
    // --- NEW: Style for the select dropdown ---
    select: {
      width: "100%",
      padding: "0.9rem 1rem",
      marginBottom: "1.2rem",
      border: "1px solid #d0d7e2",
      borderRadius: "10px",
      fontSize: "1rem",
      outline: "none",
      backgroundColor: "#f9fbff",
      transition: "all 0.2s ease",
      appearance: "none", // Removes default OS styling
      backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 1rem center",
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
      marginTop: '0.5rem', // Added margin-top
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
        <img src="/xarvis-fav.png" alt="Xarvis Logo" style={styles.logo} />

        {/* --- UPDATED: Heading is more generic --- */}
        <h1 style={styles.heading}>Login</h1>

        {/* --- NEW: Role Selector --- */}
        <select
          style={styles.select}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          onFocus={(e) =>
            (e.target.style.boxShadow = styles.inputFocus.boxShadow)
          }
          onBlur={(e) => (e.target.style.boxShadow = "none")}
        >
          <option value="author">Login as Author</option>
          <option value="admin">Login as Admin</option>
        </select>

        {/* --- UPDATED: Input for Email --- */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={(e) =>
            (e.target.style.boxShadow = styles.inputFocus.boxShadow)
          }
          onBlur={(e) => (e.target.style.boxShadow = "none")}
          style={styles.input}
        />

        {/* --- Input for Password (no changes needed) --- */}
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
