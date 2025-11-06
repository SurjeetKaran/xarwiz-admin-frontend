import React, { useEffect, useState } from "react";
import axios from "axios";
// Icons removed

const API_URL = "http://localhost:3000/api/index/stats";

export default function StatsManager() {
  const [stats, setStats] = useState([]);
  const [form, setForm] = useState({ value: "", label: "" });
  const [editingStat, setEditingStat] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(API_URL);
      if (Array.isArray(data)) setStats(data);
       else setStats([]); // Ensure stats is always an array
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats([]); // Set to empty array on error
       showTempMessage("❌ Failed to fetch stats.", "error");
    }
  };

  const showTempMessage = (msg, type = "success") => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(null), 2500);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
     if (!form.value.trim() || !form.label.trim()) {
        showTempMessage("❌ Both value and label are required.", "error");
        return;
    }

    const token = localStorage.getItem("token");
    try {
      if (editingStat) {
        await axios.put(`${API_URL}/${editingStat._id}`, form, { headers: { Authorization: `Bearer ${token}` } });
        showTempMessage("✅ Stat updated successfully!");
      } else {
        await axios.post(API_URL, form, { headers: { Authorization: `Bearer ${token}` } });
        showTempMessage("✅ Stat added successfully!");
      }
      setForm({ value: "", label: "" }); // Reset form
      setEditingStat(null); // Exit edit mode
      fetchStats(); // Refresh list
    } catch (error) {
      console.error("Error saving stat:", error.response?.data || error.message);
      showTempMessage(`❌ Failed to save stat: ${error.response?.data?.message || error.message}`, "error");
    }
  };

  const handleEdit = (stat) => {
    setForm({ value: stat.value, label: stat.label });
    setEditingStat(stat);
     window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to form
  };

   const cancelEdit = () => {
        setForm({ value: "", label: "" });
        setEditingStat(null);
    };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this stat?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      showTempMessage("🗑️ Stat deleted successfully!");
      fetchStats(); // Refresh list
       if (editingStat && editingStat._id === id) { // If deleting the item being edited, cancel edit
            cancelEdit();
        }
    } catch (error) {
       console.error("Error deleting stat:", error.response?.data || error.message);
      showTempMessage(`❌ Failed to delete stat: ${error.response?.data?.message || error.message}`, "error");
    }
  };

  // --- STYLES UPDATED ---
  const styles = {
    container: {
      padding: "1rem 2rem",
      fontFamily: "'Inter', sans-serif",
    },
    card: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      borderRadius: "12px",
      boxShadow: "0 6px 24px rgba(0,0,0,0.07)",
      padding: "1.5rem",
      marginBottom: "1.5rem"
    },
    heading: {
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "1.5rem",
      color: "#1351d8",
    },
     subHeading: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "1rem",
      color: "#1f2937",
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    formInput: {
      padding: "10px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      boxSizing: "border-box",
      width: "100%",
      fontFamily: "'Inter', sans-serif",
    },
     buttonGroup: {
        display: 'flex',
        gap: '1rem',
        marginTop: '0.5rem', // Add some space above buttons
    },
    button: {
      padding: "12px 18px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "15px",
       flex: 1, // Make buttons fill space
       transition: 'background-color 0.3s ease',
    },
    primaryButton: {
      backgroundColor: "#1351d8",
      color: "#fff",
    },
    secondaryButton: {
      backgroundColor: "#6b7280",
      color: "#fff",
    },
    successButton: {
       backgroundColor: "#10b981",
       color: "#fff",
    },
    dangerButton: {
       backgroundColor: "#dc2626",
       color: "#fff",
    },
    actions: {
        display: "flex",
        gap: "10px",
        marginTop: "1rem", // Add space above actions
    },
     actionButton: { // Smaller buttons for list items
      padding: "8px 12px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: '14px',
    },
    message: {
      marginBottom: "1.5rem",
      padding: "10px 15px",
      borderRadius: "8px",
      fontWeight: "500",
      textAlign: "center",
    },
    successMessage: {
       backgroundColor: "#d1fae5",
       color: "#065f46",
    },
    errorMessage: {
        backgroundColor: "#fde2e2",
       color: "#b91c1c",
    },
     statListContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Responsive grid
        gap: '1.5rem',
    },
     statItem: {
        display: 'flex',
        flexDirection: 'column', // Stack value and label
        alignItems: 'center', // Center content
        textAlign: 'center',
    },
    statValue: {
        fontSize: '1.75rem', // Larger font for value
        fontWeight: '700',
        color: '#1351d8', // Primary blue
        marginBottom: '0.25rem',
    },
    statLabel: {
        fontSize: '0.9rem',
        color: '#4b5563', // Medium gray
        textTransform: 'uppercase', // Uppercase label
        letterSpacing: '0.05em', // Add letter spacing
    },
  };
  // --- END OF STYLES ---


  return (
    <div style={styles.container}>
      {/* Form Card */}
      <div style={styles.card}>
        <h1 style={styles.heading}>{editingStat ? "Edit Stat" : "Add New Stat"}</h1>

        {message && (
          <div style={{ ...styles.message, ...(message.type === "error" ? styles.errorMessage : styles.successMessage) }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="value"
            placeholder="Stat Value (e.g., 7K+)"
            value={form.value}
            onChange={handleChange}
            style={styles.formInput}
            required />
          <input
            type="text"
            name="label"
            placeholder="Stat Label (e.g., Registered Users)"
            value={form.label}
            onChange={handleChange}
            style={styles.formInput}
            required />
           <div style={styles.buttonGroup}>
             <button type="submit" style={{...styles.button, ...styles.primaryButton}}>
                 {editingStat ? "Update Stat" : "Add Stat"}
             </button>
             {editingStat && (
                 <button type="button" onClick={cancelEdit} style={{...styles.button, ...styles.secondaryButton}}>
                     Cancel Edit
                 </button>
             )}
            </div>
        </form>
      </div>

      {/* Stats List Card */}
       <div style={styles.card}>
           <h2 style={styles.subHeading}>Current Stats</h2>
           {stats.length === 0 ? (
               <p style={{color: '#6b7280', textAlign: 'center'}}>No stats added yet.</p>
           ) : (
                <div style={styles.statListContainer}>
                {stats.map((stat) => (
                    <div key={stat._id} style={{...styles.card, padding: '1rem', marginBottom: 0}}> {/* Inner card for each stat */}
                        <div style={styles.statItem}>
                            <p style={styles.statValue}>{stat.value}</p>
                            <p style={styles.statLabel}>{stat.label}</p>
                        </div>
                        <div style={styles.actions}>
                            <button onClick={() => handleEdit(stat)} style={{...styles.actionButton, ...styles.successButton}}>Edit</button>
                            <button onClick={() => handleDelete(stat._id)} style={{ ...styles.actionButton, ...styles.dangerButton }}>Delete</button>
                        </div>
                    </div>
                ))}
                </div>
            )}
       </div>
    </div>
  );
}

