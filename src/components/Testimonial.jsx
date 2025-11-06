import React, { useEffect, useState } from "react";
import axios from "axios";
// Icons removed

const API_URL = "https://xarwiz-admin-backend.onrender.com/api/index/testimonials";

export default function Testimonial() {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [form, setForm] = useState({
    quote: "",
    authorName: "",
    authorInfo: "",
    authorImage: "", // Will hold Base64
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setTestimonials([]);
    }
  };

  const showTempMessage = (msg, type = "success") => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(null), 2500); // Increased duration slightly
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, authorImage: reader.result }); // Save Base64
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (editingData) {
        await axios.put(`${API_URL}/${editingData._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showTempMessage("✅ Testimonial updated!");
      } else {
        await axios.post(API_URL, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showTempMessage("✅ Testimonial added!");
      }
      setForm({ quote: "", authorName: "", authorInfo: "", authorImage: "" });
      setEditingData(null);
      setShowForm(false);
      fetchTestimonials();
    } catch (error) {
      console.error(error);
      showTempMessage(`❌ Failed to save testimonial: ${error.response?.data?.message || error.message}`, "error");
    }
  };

  const handleEdit = (t) => {
    setForm({
      quote: t.quote,
      authorName: t.authorName,
      authorInfo: t.authorInfo,
      authorImage: t.authorImage || "",
    });
    setEditingData(t);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to form on edit
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?"))
      return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      showTempMessage("🗑️ Testimonial deleted!");
      fetchTestimonials();
    } catch (error) {
      console.error(error);
       showTempMessage(`❌ Failed to delete testimonial: ${error.response?.data?.message || error.message}`, "error");
    }
  };

  // --- STYLES UPDATED ---
  const styles = {
    container: {
      padding: "1rem 2rem",
      fontFamily: "'Inter', sans-serif",
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
    formTextarea: {
      padding: "10px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      boxSizing: "border-box",
      width: "100%",
      fontFamily: "'Inter', sans-serif",
      marginBottom: "1rem",
      resize: "vertical",
      minHeight: "100px",
    },
    imageUploadContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
    },
    imagePicker: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      overflow: "hidden",
      border: "2px dashed #d1d5db",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f9fafb",
      color: "#6b7280",
      fontWeight: "500",
      flexShrink: 0, // Prevent shrinking
    },
     imagePreview: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
     },
    buttonGroup: { display: "flex", gap: "1rem", marginTop: "1rem" },
    button: {
      flex: 1,
      padding: "12px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "15px",
    },
    primaryButton: { backgroundColor: "#1351d8", color: "#fff" },
    secondaryButton: { backgroundColor: "#6b7280", color: "#fff" },
    dangerButton: { backgroundColor: "#dc2626", color: "#fff" },
    successButton: { backgroundColor: "#10b981", color: "#fff" },

    testimonialGrid: { // Use grid for testimonials
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
    },
    testimonialQuote: {
      fontStyle: "italic",
      marginBottom: "1rem",
      color: "#374151", // Darker Gray
      fontSize: "16px",
      lineHeight: 1.6,
      borderLeft: "3px solid #1351d8", // Blue accent line
      paddingLeft: "1rem",
    },
    testimonialAuthor: {
      fontWeight: "600",
      fontSize: "16px",
      color: "#1f2937", // Very Dark Gray
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem', // Space between image and text
    },
    authorImageSmall: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #e5e7eb',
    },
    authorTextContainer: {
       display: 'flex',
       flexDirection: 'column',
    },
    authorName: {
        margin: 0,
    },
    testimonialInfo: {
      fontSize: "14px",
      color: "#6b7280", // Medium Gray
      margin: '2px 0 0 0', // Adjust margin
    },
    testimonialActions: { display: "flex", gap: "10px", marginTop: "1rem" },
     actionButton: {
      flex: "0 0 auto",
      padding: "8px 12px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: "500",
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    }
  };
  // --- END OF STYLES ---

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.pageHeading}>Manage Testimonials</h1>
        <button
          style={styles.addBtn}
          onClick={() => {
            setShowForm(!showForm);
            setEditingData(null);
            setForm({ quote: "", authorName: "", authorInfo: "", authorImage: "" });
          }}
        >
          {showForm ? "Cancel" : "Add New Testimonial"}
        </button>
      </div>

      {message && (
        <div style={{ ...styles.message, ...(message.type === "error" ? styles.errorMessage : styles.successMessage) }}>
          {message.text}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={styles.card}>
          <form onSubmit={handleSubmit}>
            <textarea
              name="quote"
              placeholder="Enter testimonial quote"
              style={styles.formTextarea}
              value={form.quote}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="authorName"
              placeholder="Author Name"
              style={styles.formInput}
              value={form.authorName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="authorInfo"
              placeholder="Author Info (e.g., CEO, Company)"
              style={styles.formInput}
              value={form.authorInfo}
              onChange={handleChange}
              required
            />
             {/* Image Uploader */}
            <div style={styles.imageUploadContainer}>
              <div
                style={styles.imagePicker}
                onClick={() => document.getElementById("authorImageInput").click()}
              >
                {form.authorImage ? (
                  <img src={form.authorImage} alt="Author Preview" style={styles.imagePreview} />
                ) : (
                  <span>Upload</span> // Text fallback
                )}
              </div>
              <input
                type="file"
                id="authorImageInput"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
               <span style={{color: '#6b7280', fontSize: '14px'}}>Click circle to upload author image (Base64)</span>
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" style={{ ...styles.button, ...styles.primaryButton }}>{editingData ? "Update Testimonial" : "Add Testimonial"}</button>
               {editingData && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingData(null);
                    setForm({ quote: "", authorName: "", authorInfo: "", authorImage: "" });
                  }}
                  style={{ ...styles.button, ...styles.secondaryButton }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Testimonial List */}
      <div style={styles.testimonialGrid}>
        {(!Array.isArray(testimonials) || testimonials.length === 0) && !showForm ? (
          <p style={{ color: "#555", fontSize: "16px", gridColumn: '1 / -1', textAlign: 'center' }}>
            No testimonials found. Click "Add New" to create one!
          </p>
        ) : (
          testimonials.map((t) => (
            <div key={t._id} style={styles.card}>
              <p style={styles.testimonialQuote}>“{t.quote}”</p>
              <div style={styles.testimonialAuthor}>
                  <img
                    src={t.authorImage || `https://placehold.co/40x40/e0e7ff/1351d8?text=${t.authorName.charAt(0)}`}
                    alt={t.authorName}
                    style={styles.authorImageSmall}
                   />
                   <div style={styles.authorTextContainer}>
                        <span style={styles.authorName}>{t.authorName}</span>
                        <span style={styles.testimonialInfo}>{t.authorInfo}</span>
                   </div>
              </div>
              <div style={styles.testimonialActions}>
                <button
                  onClick={() => handleEdit(t)}
                  style={{ ...styles.actionButton, ...styles.successButton }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  style={{ ...styles.actionButton, ...styles.dangerButton }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
