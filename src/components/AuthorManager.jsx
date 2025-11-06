import { useEffect, useState } from "react";
import axios from "axios";
// import { FaCamera } from "react-icons/fa"; // Icon removed as requested

export default function AuthorManager() {
  const [authors, setAuthors] = useState([]);
  const [formData, setFormData] = useState({
    displayName: "",
    title: "",
    bio: "",
    profileImage: "",
    socialLinks: { facebook: "", twitter: "", instagram: "", youtube: "" },
  });
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const API_URL = "http://localhost:3000/api/admin/authors";

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const res = await axios.get(API_URL);
      setAuthors(res.data);
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["facebook", "twitter", "instagram", "youtube"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData((prev) => ({ ...prev, profileImage: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingAuthor) {
        await axios.put(`${API_URL}/${editingAuthor._id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }

      setFormData({
        displayName: "",
        title: "",
        bio: "",
        profileImage: "",
        socialLinks: { facebook: "", twitter: "", instagram: "", youtube: "" },
      });
      setEditingAuthor(null);
      fetchAuthors();
    } catch (error) {
      console.error("Error saving author:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setFormData({
      displayName: author.displayName,
      title: author.title || "",
      bio: author.bio || "",
      profileImage: author.profileImage || "",
      socialLinks: author.socialLinks || {
        facebook: "",
        twitter: "",
        instagram: "",
        youtube: "",
      },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = (author) => {
    setConfirmDelete(author);
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    try {
      await axios.delete(`${API_URL}/${confirmDelete._id}`);
      fetchAuthors();
    } catch (error) {
      console.error("Error deleting author:", error);
    } finally {
      setConfirmDelete(null);
    }
  };

  // --- STYLES UPDATED ---
  const styles = {
    wrapper: {
      padding: "1rem 2rem",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
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
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    imageContainer: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      overflow: "hidden",
      border: "2px dashed #d1d5db",
      margin: "0 auto 10px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f9fafb",
      cursor: "pointer",
      color: "#6b7280",
    },
    imagePreview: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    input: {
      padding: "10px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      boxSizing: "border-box",
      width: "100%",
      fontFamily: "'Inter', sans-serif",
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
    },
    list: { 
      display: "flex", 
      flexDirection: "column", 
      gap: "1rem" 
    },
    listItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "1rem",
      borderBottom: "1px solid #e5e7eb",
      paddingBottom: "1rem",
    },
    avatar: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid #e5e7eb",
    },
    actions: { 
      display: "flex", 
      flexDirection: "column", 
      gap: "0.5rem",
      flexShrink: 0,
    },
    actionBtn: {
      border: "none",
      color: "#fff",
      padding: "6px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "background-color 0.3s ease",
    },
    editBtn: {
      backgroundColor: "#10b981",
    },
    deleteBtn: {
      backgroundColor: "#dc2626",
    },
    modalOverlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },
    modal: {
      backgroundColor: "#fff",
      padding: "2rem",
      borderRadius: "12px",
      textAlign: "center",
      width: "340px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      fontFamily: "'Inter', sans-serif",
    },
    confirmBtn: {
      backgroundColor: "#dc2626",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "10px 16px",
      cursor: "pointer",
      fontWeight: "600",
    },
    cancelBtn: {
      backgroundColor: "#6b7280",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "10px 16px",
      cursor: "pointer",
      fontWeight: "600",
    },
    socialContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "0.75rem",
    },
  };
  // --- END OF STYLES ---

  return (
    <div style={styles.wrapper}>
      {/* Add/Edit Form */}
      <div style={styles.card}>
        <h2 style={styles.heading}>
          {editingAuthor ? "Edit Author" : "Add New Author"}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div
            style={styles.imageContainer}
            onClick={() => document.getElementById("authorImageInput").click()}
          >
            {formData.profileImage ? (
              <img src={formData.profileImage} alt="Author" style={styles.imagePreview} />
            ) : (
              <span>Upload</span> // Icon removed
            )}
          </div>
          <input
            type="file"
            id="authorImageInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />

          <input
            type="text"
            name="displayName"
            placeholder="Display Name"
            value={formData.displayName}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="title"
            placeholder="Title (e.g., Blogger, Photographer)"
            value={formData.title}
            onChange={handleChange}
            style={styles.input}
          />
          <textarea
            name="bio"
            placeholder="Short Bio"
            value={formData.bio}
            onChange={handleChange}
            style={{ ...styles.input, height: "80px", resize: "vertical" }}
          />
          <div style={styles.socialContainer}>
            {["facebook", "twitter", "instagram", "youtube"].map((social) => (
              <input
                key={social}
                type="text"
                name={social}
                placeholder={`${social.charAt(0).toUpperCase() + social.slice(1)} URL`}
                value={formData.socialLinks[social] || ''} // Ensure value is controlled
                onChange={handleChange}
                style={styles.input}
              />
            ))}
          </div>

          <button 
            type="submit" 
            style={{...styles.button, opacity: loading ? 0.7 : 1}} 
            disabled={loading}
          >
            {loading ? "Saving..." : editingAuthor ? "Update Author" : "Add Author"}
          </button>
        </form>
      </div>

      {/* Author List */}
      <div style={styles.card}>
        <h2 style={styles.heading}>Author List</h2>
        {authors.length === 0 ? (
          <p style={{ color: "#555" }}>No authors found.</p>
        ) : (
          <div style={styles.list}>
            {authors.map((author) => (
              <div key={author._id} style={styles.listItem}>
                <img
                  src={author.profileImage || `https://placehold.co/60x60/e0e7ff/1351d8?text=${author.displayName.charAt(0)}`}
                  alt={author.displayName}
                  style={styles.avatar}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ margin: "0 0 5px", color: "#1f2937" }}>{author.displayName}</h3>
                  <p style={{ fontSize: "14px", color: "#4b5563", margin: 0 }}>
                    {author.title && <strong style={{color: "#1351d8"}}>{author.title}</strong>}
                    <br />
                    <span style={{whiteSpace: "pre-wrap", wordBreak: "break-word"}}>{author.bio}</span>
                  </p>
                </div>
                <div style={styles.actions}>
                  <button
                    onClick={() => handleEdit(author)}
                    style={{ ...styles.actionBtn, ...styles.editBtn }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(author)}
                    style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{color: "#1f2937", marginTop: 0}}>Confirm Deletion</h3>
            <p style={{color: "#4b5563", fontSize: "16px"}}>
              Are you sure you want to delete <b>{confirmDelete.displayName}</b>?
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1.5rem" }}>
              <button onClick={confirmDeleteAction} style={styles.confirmBtn}>
                Yes, Delete
              </button>
              <button onClick={() => setConfirmDelete(null)} style={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

