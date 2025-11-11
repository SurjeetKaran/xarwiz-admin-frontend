
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ onLogout, onTabChange, role, activeTab }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [logoutHover, setLogoutHover] = useState(false);
  const [indexDropdownOpen, setIndexDropdownOpen] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const styles = {
    sidebar: {
      width: collapsed ? "80px" : "240px",
      height: "100vh",
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
      // --- UPDATED: Justify content based on state ---
      justifyContent: collapsed ? "center" : "space-between",
      padding: "0.5rem",
      // Add a transition for hover
      transition: "background-color 0.2s",
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
      color: "#e0e7ff",
    },
    navItemHover: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    activeItem: {
      backgroundColor: "#ffffff",
      color: "#1351d8",
      fontWeight: "600",
    },
    logoutBtn: {
      marginTop: "auto",
      padding: "0.85rem 1rem",
      backgroundColor: "transparent",
      border: "2px solid rgba(255, 107, 107, 0.8)",
      borderRadius: "8px",
      cursor: "pointer",
      color: "#ffcbca",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      transition: "background-color 0.2s, color 0.2s",
    },
    logoutHover: {
      backgroundColor: "#dc2626",
      color: "#ffffff",
      borderColor: "#dc2626",
    },
    // --- UPDATED: Simplified label style ---
    label: {
      display: "inline",
      whiteSpace: "nowrap",
    },
    // --- REMOVED: iconLabel style is no longer needed ---
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
    subNavActive: {
      backgroundColor: "#ffffff",
      color: "#1351d8",
      fontWeight: "600",
    },
    // --- NEW: Style for collapsed sub-nav item icons ---
    subNavIcon: {
      display: collapsed ? "inline" : "none",
      fontSize: "1.25rem",
      fontWeight: "600",
    },
    // --- NEW: Style for expanded sub-nav item labels ---
    subNavLabel: {
      display: collapsed ? "none" : "inline",
      whiteSpace: "nowrap",
    },
  };

  const handleTabClick = (label) => {
    if (onTabChange) onTabChange(label);
  };

  const handleLogoutClick = () => {
    setLoggingOut(true);
    setTimeout(() => {
      onLogout();
      navigate("/admin-login");
    }, 1000);
  };

  // Helper constants for active sections
  const isIndexSectionActive = ["Testimonials", "Stats", "General Settings", "Footer Links"].includes(activeTab);
  const isBlogSectionActive = ["Authors", "Blog Posts", "Categories", "Tags"].includes(activeTab);
  const isServiceSectionActive = ["Guest Posting", "Niche Edit", "About Content"].includes(activeTab);

  return (
    <div style={styles.sidebar}>
      {/* --- UPDATED: Collapse Button --- */}
      <button 
        style={{
          ...styles.toggleBtn,
          ...(hoverIndex === 'toggle' ? styles.navItemHover : {})
        }}
        onMouseEnter={() => setHoverIndex('toggle')}
        onMouseLeave={() => setHoverIndex(null)}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          // Collapsed view: Show hamburger icon
          <span style={{ fontSize: '1.5rem' }}>☰</span>
        ) : (
          // Expanded view: Show title and arrow
          <>
            <span style={{...styles.label, fontWeight: '600', fontSize: '1.25rem'}}>Xarwiz Admin</span>
            <span style={{...styles.label, fontSize: '1.5rem'}}>←</span>
          </>
        )}
      </button>

      {/* --- RENDER CONTENT BASED ON ROLE --- */}

      {/* --- ADMIN-ONLY TABS --- */}
      {role === "admin" && (
        <>
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
            <span style={styles.subNavLabel}>Dashboard</span>
            <span style={styles.subNavIcon}>D</span>
          </div>

          {/* Index Edit */}
          <div
            style={{
              ...styles.navItem,
              ...(hoverIndex === 1 ? styles.navItemHover : {}),
              ...(isIndexSectionActive ? styles.activeItem : {}),
              justifyContent: collapsed ? "center" : "space-between",
            }}
            onMouseEnter={() => setHoverIndex(1)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={() => setIndexDropdownOpen(!indexDropdownOpen)} // This is the toggle logic
          >
            <span style={styles.subNavLabel}>Index Edit</span>
            <span style={styles.subNavIcon}>I</span>
          </div>

          {(indexDropdownOpen || isIndexSectionActive) && (
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
                    <span style={styles.subNavLabel}>{tab}</span>
                    <span style={styles.subNavIcon}>{tab.charAt(0)}</span>
                  </div>
                )
              )}
            </div>
          )}

          {/* Blog Management (Admin View) */}
          <div
            style={{
              ...styles.navItem,
              ...(hoverIndex === 2 ? styles.navItemHover : {}),
              ...(isBlogSectionActive ? styles.activeItem : {}),
              justifyContent: collapsed ? "center" : "space-between",
            }}
            onMouseEnter={() => setHoverIndex(2)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={() => setBlogDropdownOpen(!blogDropdownOpen)} // This is the toggle logic
          >
            <span style={styles.subNavLabel}>Blog Management</span>
            <span style={styles.subNavIcon}>B</span>
          </div>

          {(blogDropdownOpen || isBlogSectionActive) && (
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
                    <span style={styles.subNavLabel}>{tab}</span>
                    <span style={styles.subNavIcon}>{tab.charAt(0)}</span>
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
              ...(isServiceSectionActive ? styles.activeItem : {}),
              justifyContent: collapsed ? "center" : "space-between",
            }}
            onMouseEnter={() => setHoverIndex(3)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={() => setServiceDropdownOpen(!serviceDropdownOpen)} // This is the toggle logic
          >
            <span style={styles.subNavLabel}>Service Content</span>
            <span style={styles.subNavIcon}>S</span>
          </div>

          {(serviceDropdownOpen || isServiceSectionActive) && (
            <div style={styles.subNav}>
              {["Guest Posting", "Niche Edit", "About Content"].map(
                (tab, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...styles.subNavItem,
                      ...(activeTab === tab ? styles.subNavActive : {}),
                    }}
                    onClick={() => handleTabClick(tab)}
                  >
                    <span style={styles.subNavLabel}>{tab}</span>
                    <span style={styles.subNavIcon}>{tab.charAt(0)}</span>
                  </div>
                )
              )}
            </div>
          )}
        </>
      )}

      {/* --- AUTHOR-ONLY TAB --- */}
      {role === "author" && (
        <div
          style={{
            ...styles.navItem,
            ...(activeTab === "Blog Posts" ? styles.activeItem : {}),
            justifyContent: collapsed ? "center" : "space-between",
          }}
          onClick={() => handleTabClick("Blog Posts")}
        >
          <span style={styles.subNavLabel}>Blog Posts</span>
          <span style={styles.subNavIcon}>B</span>
        </div>
      )}

      {/* Logout Button (Visible to both) */}
      <button
        style={{
          ...styles.logoutBtn,
          ...(logoutHover ? styles.logoutHover : {}),
          opacity: loggingOut ? 0.7 : 1,
          justifyContent: 'center', // Always center logout
        }}
        disabled={loggingOut}
        onMouseEnter={() => setLogoutHover(true)}
        onMouseLeave={() => setLogoutHover(false)}
        onClick={handleLogoutClick}
      >
        <span style={styles.subNavLabel}>
          {loggingOut ? "Logging out..." : "Logout"}
        </span>
        {/* --- UPDATED: Use subNavIcon style --- */}
        <span style={styles.subNavIcon}>L</span>
      </button>
    </div>
  );
}