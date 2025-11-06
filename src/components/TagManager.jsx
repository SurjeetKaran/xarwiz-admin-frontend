import { useState, useEffect } from "react";
import axios from "axios";

export default function TagManager() {
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [editingTag, setEditingTag] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:3000/api/admin/tags";

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await axios.get(API_URL);
      setTags(res.data);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setLoading(true);

    try {
      const slug = formData.name.trim().toLowerCase().replace(/\s+/g, "-");

      if (editingTag) {
        await axios.put(`${API_URL}/${editingTag._id}`, { name: formData.name, slug });
      } else {
        await axios.post(API_URL, { name: formData.name, slug });
      }

      setFormData({ name: "" });
      setEditingTag(null);
      fetchTags();
    } catch (err) {
      console.error("Error saving tag:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setFormData({ name: tag.name });
  };

  const cancelEdit = () => {
    setEditingTag(null);
    setFormData({ name: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tag?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTags((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting tag:", err);
    }
  };

  // --- STYLES UPDATED ---
  const styles = {
    wrapper: {
      padding: "1rem 2rem",
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
      fontFamily: "'Inter', sans-serif",
    },
    card: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      borderRadius: "12px",
      boxShadow: "0 6px 24px rgba(0,0,0,0.07)",
      padding: "1.5rem",
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
      display: "flex", 
      gap: "1rem", 
      flexWrap: "wrap", 
      alignItems: "center" 
    },
    input: {
      padding: "10px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      boxSizing: "border-box",
      fontFamily: "'Inter', sans-serif",
      flex: 1,
      minWidth: "200px",
    },
    button: {
      backgroundColor: "#1351d8",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "10px 16px",
      fontSize: "15px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "background-color 0.3s ease",
    },
    cancelBtn: {
      backgroundColor: "#6b7280",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "10px 16px",
      fontSize: "15px",
      cursor: "pointer",
      fontWeight: "600",
    },
    list: { 
      listStyle: "none", 
      padding: 0 
    },
    listItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #e5e7eb",
      padding: "12px 0",
      color: "#1f2937",
      fontWeight: "500",
    },
    actions: { 
      display: "flex", 
      gap: "0.5rem" 
    },
    editBtn: {
      background: "#10b981",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "6px 10px",
      cursor: "pointer",
      fontWeight: "500",
    },
    deleteBtn: {
      background: "#dc2626",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "6px 10px",
      cursor: "pointer",
      fontWeight: "500",
    },
  };
  // --- END OF STYLES ---

  return (
    <div style={styles.wrapper}>
      {/* === Tag Form === */}
      <div style={styles.card}>
        <h2 style={styles.heading}>
          {editingTag ? "Edit Tag" : "Add New Tag"}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter tag name"
            style={styles.input}
            required
          />

          <button type="submit" disabled={loading} style={{...styles.button, opacity: loading ? 0.7 : 1}}>
            {loading ? "Saving..." : editingTag ? "Update Tag" : "Add Tag"}
          </button>

          {editingTag && (
            <button type="button" onClick={cancelEdit} style={styles.cancelBtn}>
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* === Tag List === */}
      <div style={styles.card}>
        <h3 style={styles.subHeading}>Existing Tags</h3>
        {tags.length === 0 ? (
          <p style={{ color: "#555" }}>No tags available.</p>
        ) : (
          <ul style={styles.list}>
            {tags.map((tag) => (
              <li key={tag._id} style={styles.listItem}>
                <span>{tag.name}</span>
                <div style={styles.actions}>
                  <button
                    onClick={() => handleEdit(tag)}
                    style={styles.editBtn}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tag._id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
