import { useState, useEffect } from "react";
import axios from "axios";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", subcategories: [""] });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const API_URL = "http://localhost:3000/api/admin/categories";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle subcategory changes
  const handleSubChange = (index, value) => {
    const updatedSubs = [...formData.subcategories];
    updatedSubs[index] = value;
    setFormData((prev) => ({ ...prev, subcategories: updatedSubs }));
  };

  // Add new subcategory field
  const addSubField = () => {
    setFormData((prev) => ({
      ...prev,
      subcategories: [...prev.subcategories, ""],
    }));
  };

  // Remove subcategory field
  const removeSubField = (index) => {
    const updatedSubs = formData.subcategories.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, subcategories: updatedSubs }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: "", subcategories: [""] });
    setEditMode(false);
    setEditId(null);
  };

  // Create or Update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setLoading(true);

    try {
      const slug = formData.name.trim().toLowerCase().replace(/\s+/g, "-");

      // Build subcategory array with slugs
      const subcategories = formData.subcategories
        .filter((sub) => sub.trim())
        .map((sub) => ({
          name: sub.trim(),
          slug: sub.trim().toLowerCase().replace(/\s+/g, "-"),
        }));

      if (editMode) {
        await axios.put(`${API_URL}/${editId}`, {
          name: formData.name,
          slug,
          subcategories,
        });
      } else {
        await axios.post(API_URL, { name: formData.name, slug, subcategories });
      }

      resetForm();
      fetchCategories();
    } catch (err) {
      console.error(editMode ? "Error updating category:" : "Error creating category:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit existing category
  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      subcategories:
        category.subcategories.length > 0
          ? category.subcategories.map((sub) => sub.name)
          : [""],
    });
    setEditId(category._id);
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? This will also remove it from any posts.")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };
  
  // --- STYLES UPDATED ---
  const styles = {
    wrapper: {
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
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
      flexDirection: "column",
      gap: "1rem",
    },
    subField: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "0.5rem",
    },
    input: {
      padding: "10px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      boxSizing: "border-box",
      width: "100%",
      fontFamily: "'Inter', sans-serif",
      flex: "1",
    },
    button: {
      backgroundColor: "#1351d8",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 16px",
      fontSize: "16px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "background-color 0.3s ease",
      alignSelf: "flex-start",
    },
    cancelBtn: {
      backgroundColor: "#6b7280",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 16px",
      fontSize: "16px",
      cursor: "pointer",
      fontWeight: "600",
    },
    addBtn: {
      backgroundColor: "#10b981",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "8px 12px",
      cursor: "pointer",
      marginTop: "0.5rem",
      fontWeight: "500",
    },
    removeBtn: {
      backgroundColor: "#dc2626",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "6px 10px",
      cursor: "pointer",
      fontWeight: "500",
    },
    editBtn: {
      backgroundColor: "#10b981",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "8px 12px",
      marginRight: "0.5rem",
      cursor: "pointer",
      fontWeight: "500",
    },
    table: { 
      width: "100%", 
      borderCollapse: "collapse",
      fontFamily: "'Inter', sans-serif",
    },
    th: {
      textAlign: "left",
      padding: "12px 16px",
      background: "#f9fafb",
      borderBottom: "2px solid #e5e7eb",
      color: "#374151",
      fontWeight: "600",
    },
    td: {
      padding: "12px 16px",
      borderBottom: "1px solid #e5e7eb",
      verticalAlign: "top",
      color: "#1f2937",
    },
    deleteBtn: {
      backgroundColor: "#dc2626",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "500",
    },
  };
  // --- END OF STYLES ---

  return (
    <div style={styles.wrapper}>
      {/* === Add/Update Category === */}
      <div style={styles.card}>
        <h2 style={styles.heading}>
          {editMode ? "Edit Category" : "Add Category"}
        </h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {/* Subcategories */}
          <div style={{ width: "100%" }}>
            <label style={{ fontWeight: "600", color: "#374151", marginBottom: "0.5rem", display: "block" }}>
              Subcategories:
            </label>
            {formData.subcategories.map((sub, idx) => (
              <div key={idx} style={styles.subField}>
                <input
                  type="text"
                  placeholder={`Subcategory ${idx + 1} (optional)`}
                  value={sub}
                  onChange={(e) => handleSubChange(idx, e.target.value)}
                  style={styles.input}
                />
                {formData.subcategories.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubField(idx)}
                    style={styles.removeBtn}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addSubField} style={styles.addBtn}>
              + Add Subcategory
            </button>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="submit" disabled={loading} style={{...styles.button, opacity: loading ? 0.7 : 1}}>
              {loading
                ? "Saving..."
                : editMode
                ? "Update Category"
                : "Save Category"}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* === Category List === */}
      <div style={styles.card}>
        <h3 style={styles.subHeading}>Existing Categories</h3>
        {categories.length === 0 ? (
          <p style={{ color: "#555" }}>No categories found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Subcategories</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td style={styles.td}><strong>{cat.name}</strong></td>
                  <td style={styles.td}>
                    {cat.subcategories && cat.subcategories.length > 0 ? (
                      <ul style={{ margin: "0.5rem 0", paddingLeft: "1.2rem", color: "#4b5563" }}>
                        {cat.subcategories.map((sub, idx) => (
                          <li key={idx}>{sub.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <em style={{ color: "#9ca3af" }}>No subcategories</em>
                    )}
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleEdit(cat)}
                      style={styles.editBtn}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
