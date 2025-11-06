import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Testimonial from "../components/Testimonial.jsx";
import Stats from "../components/StatsCard.jsx";
import GeneralSettings from "../components/GeneralSettings.jsx";
import FooterLinks from "../components/FooterLinks.jsx";

// 🔹 New imports
import AuthorManager from "../components/AuthorManager.jsx";
import BlogManager from "../components/BlogManager.jsx";
import CategoryManager from "../components/CategoryManager.jsx";
import TagManager from "../components/TagManager.jsx";
import GuestPostingManager from "../components/GuestPostingManager.jsx";
import NicheEditManager from "../components/NicheEditManager.jsx";
import AboutContent from "../components/AboutContent.jsx";


export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/admin-login");
  };

  // --- STYLES UPDATED TO MATCH INDEX.HTML ---
  const styles = {
    page: {
      display: "flex",
      flexDirection: "row",
      minHeight: "100vh",
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      // Light gradient background matches Login page
      background: "linear-gradient(135deg, #f0f6ff 0%, #fdfdfd 100%)",
      color: "#1f2937", // Darker text for main content
    },
    sidebarWrapper: {
      position: "sticky",
      top: 0,
      height: "100vh",
      flexShrink: 0,
      zIndex: 2000, // Ensure sidebar is on top
    },
    container: {
      flex: 1,
      minWidth: 0,
      overflowY: "auto",
      height: "100vh", // Ensure container can scroll independently
    },
    navbar: {
      position: "sticky",
      top: 0,
      // "Glass" effect from index.html and login
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      padding: "1.5rem 2rem",
      marginBottom: "1.5rem",
      borderBottom: "1px solid rgba(229, 231, 235, 0.5)", // Lighter border
      boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
      zIndex: 1000,
    },
    navbarHeading: {
      fontSize: "24px",
      fontWeight: "700",
      // Use primary site blue
      color: "#1351d8",
      margin: 0,
    },
    // --- Dashboard Specific Styles ---
    dashboardContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "80vh",
      color: "#333",
      padding: "2rem",
    },
    dashboardHeading: {
      fontSize: "2rem",
      fontWeight: "700",
      marginBottom: "2rem",
      textAlign: "center",
      color: "#1f2937",
    },
    dashboardGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "1.5rem",
      width: "100%",
      maxWidth: "900px",
    },
    dashboardCard: {
      // Use the "glass" effect for cards
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(5px)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      borderRadius: "12px",
      boxShadow: "0 6px 24px rgba(0,0,0,0.07)",
      padding: "1.5rem",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    dashboardCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    },
    dashboardCardHeading: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "1rem",
      // Use primary site blue
      color: "#1351d8",
      borderBottom: "1px solid #e0e7ff",
      paddingBottom: "0.5rem",
    },
    dashboardCardList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      lineHeight: "1.8",
      color: "#374151", // Darker gray for better readability
      fontWeight: "500",
    }
  };
  // --- END OF STYLE UPDATES ---


  if (!loggedIn) return null;

  const getTabHeading = () => {
    switch (activeTab) {
      case "Dashboard":
        return "Welcome, Admin!";
      case "Testimonials":
        return "Manage Testimonials";
      case "Stats":
        return "Website Stats";
      case "General Settings":
        return "General Settings";
      case "Footer Links":
        return "Manage Footer Links";
      case "Authors":
        return "Manage Authors";
      case "Blog Posts":
        return "Manage Blog Posts";
      case "Categories":
        return "Manage Categories";
      case "Tags":
        return "Manage Tags";
      case "Guest Posting":
        return "Guest Posting Content";
      case "Niche Edit":
        return "Niche Edit Content";
      case "About Content":
        return "About Page Content";
      default:
        return "Admin Panel";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div style={styles.dashboardContainer}>
            <h2 style={styles.dashboardHeading}>
              Welcome Admin
            </h2>

            <div style={styles.dashboardGrid}>
              {/* Index Edit Tools */}
              <div
                style={styles.dashboardCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = styles.dashboardCardHover.transform;
                  e.currentTarget.style.boxShadow = styles.dashboardCardHover.boxShadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = styles.dashboardCard.boxShadow;
                }}
              >
                <h3 style={styles.dashboardCardHeading}>
                  Index Page Tools
                </h3>
                <ul style={styles.dashboardCardList}>
                  <li>Manage Testimonials</li>
                  <li>Update Stats section</li>
                  <li>Configure General Settings</li>
                  <li>Manage Footer Links</li>
                </ul>
              </div>

              {/* Blog Management */}
              <div
                style={styles.dashboardCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = styles.dashboardCardHover.transform;
                  e.currentTarget.style.boxShadow = styles.dashboardCardHover.boxShadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = styles.dashboardCard.boxShadow;
                }}
              >
                <h3 style={styles.dashboardCardHeading}>
                  Blog Management
                </h3>
                <ul style={styles.dashboardCardList}>
                  <li>Add or edit blog posts</li>
                  <li>Manage authors</li>
                  <li>Organize categories & tags</li>
                </ul>
              </div>

              {/* Service Content */}
              <div
                style={styles.dashboardCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = styles.dashboardCardHover.transform;
                  e.currentTarget.style.boxShadow = styles.dashboardCardHover.boxShadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = styles.dashboardCard.boxShadow;
                }}
              >
                <h3 style={styles.dashboardCardHeading}>
                  Service Content
                </h3>
                <ul style={styles.dashboardCardList}>
                  <li>Manage About Page</li>
                  <li>Edit Guest Posting Page</li>
                  <li>Edit Niche Edit Page</li>
                </ul>
              </div>

            </div>
          </div>
        );

      case "Testimonials":
        return <Testimonial />;
      case "Stats":
        return <Stats />;
      case "General Settings":
        return <GeneralSettings />;
      case "Footer Links":
        return <FooterLinks />;
      case "Authors":
        return <AuthorManager />;
      case "Blog Posts":
        return <BlogManager />;
      case "Categories":
        return <CategoryManager />;
      case "Tags":
        return <TagManager />;
      case "Guest Posting":
        return <GuestPostingManager />;
      {/* This was the line with the typo */}
      case "Niche Edit":
        return <NicheEditManager />;
      case "About Content":
        return <AboutContent />;  

      default:
        return <p style={{ color: "#555", padding: "2rem" }}>Select a tab from the sidebar.</p>;
    }
  };

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <div style={styles.sidebarWrapper}>
        <Sidebar onLogout={handleLogout} onTabChange={setActiveTab} />
      </div>

      {/* Main Content */}
      <div style={styles.container}>
        <div style={styles.navbar}>
          <h1 style={styles.navbarHeading}>{getTabHeading()}</h1>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
