import React, { useEffect, useState } from "react";
import axios from "axios";
// import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"; // Icons removed

const API_URL = "https://xarwiz-admin-backend.onrender.com/api/index/footer-links";

export default function FooterLinks() {
  const [columns, setColumns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [form, setForm] = useState({ columnTitle: "", links: [{ text: "", url: "" }] });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchColumns();
  }, []);

  const fetchColumns = async () => {
    try {
      const { data } = await axios.get(API_URL);
      if (Array.isArray(data)) setColumns(data);
    } catch (error) {
      console.error("Error fetching footer columns:", error);
    }
  };

  const showTempMessage = (msg, type = "success") => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleChange = (e, index = null, field = null) => {
    if (index !== null && field) {
      const newLinks = [...form.links];
      newLinks[index][field] = e.target.value;
      setForm({ ...form, links: newLinks });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addLinkField = () => setForm({ ...form, links: [...form.links, { text: "", url: "" }] });
  const removeLinkField = (index) => {
    const newLinks = form.links.filter((_, i) => i !== index);
    setForm({ ...form, links: newLinks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (editingData) {
        await axios.put(`${API_URL}/${editingData._id}`, form, { headers: { Authorization: `Bearer ${token}` } });
        showTempMessage("✅ Footer column updated!");
      } else {
        await axios.post(API_URL, form, { headers: { Authorization: `Bearer ${token}` } });
        showTempMessage("✅ Footer column added!");
      }
      setForm({ columnTitle: "", links: [{ text: "", url: "" }] });
      setEditingData(null);
      setShowForm(false);
      fetchColumns();
    } catch (error) {
      console.error(error);
      showTempMessage("❌ Failed to save column.", "error");
    }
  };

  const handleEdit = (column) => {
    setForm({ columnTitle: column.columnTitle, links: column.links.length > 0 ? column.links : [{ text: "", url: "" }] });
    setEditingData(column);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this column?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      showTempMessage("🗑️ Column deleted!");
      fetchColumns();
    } catch (error) {
      console.error(error);
      showTempMessage("❌ Failed to delete column.", "error");
    }
  };

  // --- STYLES UPDATED ---
  const styles = {
    container: { 
      padding: "1rem 2rem", 
      fontFamily: "'Inter', sans-serif" 
    },
    header: {
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      marginBottom: "1.5rem"
    },
    pageHeading: { 
      fontSize: "20px", 
      fontWeight: "600",
      color: "#1351d8",
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
    addBtn: { 
      backgroundColor: "#1351d8", 
      color: "#fff", 
      border: "none", 
      borderRadius: "8px", 
      padding: "10px 16px", 
      cursor: "pointer", 
      display: "flex", 
      alignItems: "center", 
      gap: "6px",
      fontWeight: "600",
    },
    message: { 
      marginBottom: "1.5rem", 
      padding: "10px 15px", 
      borderRadius: "8px",
      fontWeight: "500",
    },
    formInput: {
      padding: "10px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      boxSizing: "border-box",
      width: "100%",
      fontFamily: "'Inter', sans-serif",
      marginBottom: "1rem",
    },
    buttonGroup: { 
      display: "flex", 
      gap: "1rem", 
      marginTop: "1rem" 
    },
    button: { 
      flex: 1, 
      padding: "12px", 
      borderRadius: "8px", 
      border: "none", 
      cursor: "pointer", 
      fontWeight: "600",
      fontSize: "15px",
    },
    primaryButton: { 
      backgroundColor: "#1351d8", 
      color: "#fff" 
    },
    secondaryButton: { 
      backgroundColor: "#6b7280", 
      color: "#fff" 
    },
    dangerButton: {
      backgroundColor: "#dc2626", 
      color: "#fff"
    },
    successButton: {
      backgroundColor: "#10b981", 
      color: "#fff"
    },
    linkColumnContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "1.5rem",
    },
    linkTitle: { 
      fontWeight: "600", 
      fontSize: "18px", 
      color: "#1f2937",
      borderBottom: "1px solid #e5e7eb",
      paddingBottom: "0.5rem",
      marginBottom: "1rem",
    },
    linkItem: { 
      fontSize: "15px", 
      color: "#4b5563", 
      marginBottom: "0.5rem" 
    },
    actions: { 
      display: "flex", 
      gap: "10px", 
      marginTop: "1.5rem" 
    },
    actionButton: {
      flex: "0 0 auto", 
      padding: "8px 12px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: "500",
    }
  };
  // --- END OF STYLES ---

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageHeading}>Manage Footer Columns</h1>
        <button style={styles.addBtn} onClick={() => { setShowForm(!showForm); setEditingData(null); setForm({ columnTitle: "", links: [{ text: "", url: "" }] }); }}>
          {showForm ? "Cancel" : "Add New Column"}
        </button>
      </div>

      {message && (
        <div style={{ ...styles.message, backgroundColor: message.type === "error" ? "#fde2e2" : "#d1fae5", color: message.type === "error" ? "#b91c1c" : "#065f46" }}>
          {message.text}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={styles.card}>
          <form onSubmit={handleSubmit}>
            <input type="text" name="columnTitle" placeholder="Column Title (e.g., Company)" value={form.columnTitle} onChange={handleChange} style={styles.formInput} required />

            {form.links.map((link, index) => (
              <div key={index} style={{ marginBottom: "1rem", borderBottom: "1px solid #e5e7eb", paddingBottom: "1rem" }}>
                <input type="text" placeholder={`Link ${index + 1} Text`} value={link.text} onChange={(e) => handleChange(e, index, "text")} style={styles.formInput} required />
                <input type= "text" placeholder={`Link ${index + 1} URL`} value={link.url} onChange={(e) => handleChange(e, index, "url")} style={styles.formInput} required />
                {form.links.length > 1 && (
                  <button type="button" onClick={() => removeLinkField(index)} style={{ ...styles.button, ...styles.dangerButton, flex: "none", padding: "8px 12px" }}>Remove Link</button>
                )}
              </div>
            ))}

            <button type="button" onClick={addLinkField} style={{ ...styles.button, ...styles.successButton, marginBottom: "1rem", flex: "none" }}>Add Another Link</button>

            <div style={styles.buttonGroup}>
              <button type="submit" style={{ ...styles.button, ...styles.primaryButton }}>{editingData ? "Update Column" : "Save Column"}</button>
            </div>
          </form>
        </div>
      )}

      {/* Footer Columns List */}
      <div style={styles.linkColumnContainer}>
        {columns.length === 0 && !showForm ? (
          <p style={{ color: "#555", fontSize: "16px" }}>No footer columns found. Click "Add New" to create one!</p>
        ) : (
          columns.map((col) => (
            <div key={col._id} style={styles.card}>
              <p style={styles.linkTitle}>{col.columnTitle}</p>
              {col.links.map((link, i) => (
                <p key={i} style={styles.linkItem}>{link.text}: <em style={{color: "#1351d8"}}>{link.url}</em></p>
              ))}
              <div style={styles.actions}>
                <button onClick={() => handleEdit(col)} style={{ ...styles.actionButton, ...styles.successButton }}>Edit</button>
                <button onClick={() => handleDelete(col._id)} style={{ ...styles.actionButton, ...styles.dangerButton }}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
