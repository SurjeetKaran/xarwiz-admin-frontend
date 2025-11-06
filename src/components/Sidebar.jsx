import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ onLogout, onTabChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [logoutHover, setLogoutHover] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [indexDropdownOpen, setIndexDropdownOpen] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  // --- STYLES UPDATED TO MATCH INDEX.HTML ---
  const styles = {
    sidebar: {
      width: collapsed ? "80px" : "240px",
      height: "100vh",
      // Professional blue gradient matching the site's primary color
      background: "linear-gradient(to top, #0a2a6e, #1351d8)", 
      color: "#ffffff",
      transition: "width 0.3s ease",
      display: "flex",
      flexDirection: "column",
      padding: collapsed ? "1rem 0.5rem" : "1.5rem 1rem",
      fontFamily: "'Inter', sans-serif",
      boxSizing: "border-box",
    },
    toggleBtn: {
      backgroundColor: "transparent",
      color: "#ffffff",
      border: "none",
      cursor: "pointer",
      marginBottom: "2rem",
      fontSize: "1.25rem",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0.5rem",
    },
    navItem: {
      padding: "0.85rem 1rem",
      cursor: "pointer",
      borderRadius: "8px",
      marginBottom: "0.5rem",
      transition: "background-color 0.2s, color 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontWeight: "500",
      color: "#e0e7ff", // A lighter, softer white for inactive text
    },
    // Hover: A subtle, semi-transparent white
    navItemHover: { 
      backgroundColor: "rgba(255, 255, 255, 0.1)" 
    },
    // Active: "Inverted" style. White background, primary blue text
    activeItem: { 
      backgroundColor: "#ffffff",
      color: "#1351d8",
      fontWeight: "600",
    },
    logoutBtn: {
      marginTop: "auto",
      padding: "0.85rem 1rem",
      backgroundColor: "transparent",
      border: "2px solid rgba(255, 107, 107, 0.8)", // Softer red border
      borderRadius: "8px",
      cursor: "pointer",
      color: "#ffcbca", // Soft red text
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      transition: "background-color 0.2s, color 0.2s",
    },
    logoutHover: { 
      backgroundColor: "#dc2626", // Solid red on hover
      color: "#ffffff",
      borderColor: "#dc2626",
    },
    label: { 
      display: collapsed ? "none" : "inline",
      whiteSpace: "nowrap",
    },
    // Icon-only view for collapsed state
    iconLabel: {
      display: collapsed ? "inline" : "none",
      fontSize: "1.25rem",
      fontWeight: "600",
    },
    subNav: {
      paddingLeft: collapsed ? "0" : "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
      margin: "0.25rem 0",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
    },
    subNavItem: {
      padding: "0.75rem 1rem",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background-color 0.2s, color 0.2s",
      color: "#e0e7ff",
      fontWeight: "500",
      textAlign: collapsed ? "center" : "left",
    },
    // Active sub-item: Matches the primary active style
    subNavActive: { 
      backgroundColor: "#ffffff",
      color: "#1351d8",
      fontWeight: "600",
    },
  };
  // --- END OF STYLE UPDATES ---

  const handleTabClick = (label) => {
    setActiveTab(label);
    if (onTabChange) onTabChange(label);
  };

  const handleLogoutClick = () => {
    setLoggingOut(true);
    setTimeout(() => {
      onLogout();
      navigate("/admin-login");
    }, 1000);
  };

  return (
    <div style={styles.sidebar}>
      {/* Collapse Button */}
      <button style={styles.toggleBtn} onClick={() => setCollapsed(!collapsed)}>
        <span style={styles.label}>{collapsed ? "X" : "Xarwiz Admin"}</span>
        <span style={styles.iconLabel}>{collapsed ? "X" : ""}</span>
      </button>

      {/* Dashboard */}
      <div
        style={{
          ...styles.navItem,
          ...(hoverIndex === 0 ? styles.navItemHover : {}),
          ...(activeTab === "Dashboard" ? styles.activeItem : {}),
          justifyContent: collapsed ? "center" : "space-between",
        }}
        onMouseEnter={() => setHoverIndex(0)}
        onMouseLeave={() => setHoverIndex(null)}
        onClick={() => handleTabClick("Dashboard")}
      >
        <span style={styles.label}>Dashboard</span>
        <span style={styles.iconLabel}>D</span>
      </div>

      {/* Index Edit */}
      <div
        style={{
          ...styles.navItem,
          ...(hoverIndex === 1 ? styles.navItemHover : {}),
          ...(indexDropdownOpen ? styles.activeItem : {}),
          justifyContent: collapsed ? "center" : "space-between",
        }}
        onMouseEnter={() => setHoverIndex(1)}
        onMouseLeave={() => setHoverIndex(null)}
        onClick={() => setIndexDropdownOpen(!indexDropdownOpen)}
      >
        <span style={styles.label}>Index Edit</span>
        <span style={styles.iconLabel}>I</span>
      </div>

      {indexDropdownOpen && (
        <div style={styles.subNav}>
          {["Testimonials", "Stats", "General Settings", "Footer Links"].map(
            (tab, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.subNavItem,
                  ...(activeTab === tab ? styles.subNavActive : {}),
                }}
                onClick={() => handleTabClick(tab)}
              >
                <span style={styles.label}>{tab}</span>
                <span style={styles.iconLabel}>{tab.charAt(0)}</span>
              </div>
            )
          )}
        </div>
      )}

      {/* Blog Management */}
      <div
        style={{
          ...styles.navItem,
          ...(hoverIndex === 2 ? styles.navItemHover : {}),
          ...(blogDropdownOpen ? styles.activeItem : {}),
          justifyContent: collapsed ? "center" : "space-between",
        }}
        onMouseEnter={() => setHoverIndex(2)}
        onMouseLeave={() => setHoverIndex(null)}
        onClick={() => setBlogDropdownOpen(!blogDropdownOpen)}
      >
        <span style={styles.label}>Blog Management</span>
        <span style={styles.iconLabel}>B</span>
      </div>

      {blogDropdownOpen && (
        <div style={styles.subNav}>
          {["Authors", "Blog Posts", "Categories", "Tags"].map(
            (tab, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.subNavItem,
                  ...(activeTab === tab ? styles.subNavActive : {}),
                }}
                onClick={() => handleTabClick(tab)}
              >
                <span style={styles.label}>{tab}</span>
                <span style={styles.iconLabel}>{tab.charAt(0)}</span>
              </div>
            )
          )}
        </div>
      )}

      {/* Service Content */}
      <div
        style={{
          ...styles.navItem,
          ...(hoverIndex === 3 ? styles.navItemHover : {}),
          ...(serviceDropdownOpen ? styles.activeItem : {}),
          justifyContent: collapsed ? "center" : "space-between",
        }}
        onMouseEnter={() => setHoverIndex(3)}
        onMouseLeave={() => setHoverIndex(null)}
        onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)}
      >
        <span style={styles.label}>Service Content</span>
        <span style={styles.iconLabel}>S</span>
      </div>

     {serviceDropdownOpen && (
        <div style={styles.subNav}>
          {["Guest Posting", "Niche Edit", "About Content"].map((tab, idx) => (
            <div
              key={idx}
              style={{
                ...styles.subNavItem,
                ...(activeTab === tab ? styles.subNavActive : {}),
              }}
              onClick={() => handleTabClick(tab)}
            >
              <span style={styles.label}>{tab}</span>
              <span style={styles.iconLabel}>{tab.charAt(0)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Logout Button */}
      <button
        style={{
          ...styles.logoutBtn,
          ...(logoutHover ? styles.logoutHover : {}),
          opacity: loggingOut ? 0.7 : 1,
        }}
        disabled={loggingOut}
        onMouseEnter={() => setLogoutHover(true)}
        onMouseLeave={() => setLogoutHover(false)}
        onClick={handleLogoutClick}
      >
        <span style={styles.label}>
          {loggingOut ? "Logging out..." : "Logout"}
        </span>
        <span style={styles.iconLabel}>L</span>
      </button> {/* <-- This was </T>, now corrected */}
    </div>
  );
}
