import React, { useEffect, useState } from "react";
import axios from "axios";
// Icons removed

const NicheEditManager = () => {
  const API_URL = "/api/service-content/niche-edit"; // Ensure this matches your backend route

  const defaultForm = {
    featuresHeading: "",
    featuresSubtext: "",
    featureCards: [{ iconPath: "", title: "", content: "" }], // iconPath will hold Base64
    faqs: [{ id: "", question: "", answer: "" }], // Ensure ID is generated or handled properly
  };

  const [data, setData] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCards, setShowCards] = useState(true);
  const [showFaqs, setShowFaqs] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState(null); // Added message state

   // Function to show temporary messages
   const showTempMessage = (msg, type = "success") => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(null), 3000); // Display for 3 seconds
  };


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const fetchedData = res.data?.data || null;
      setData(fetchedData);
      if (!fetchedData) {
        setEditMode(true); // show form if empty DB
        setForm(defaultForm);
      } else {
        // Ensure fetched data structure matches form state
        setForm({
          featuresHeading: fetchedData.featuresHeading || "",
          featuresSubtext: fetchedData.featuresSubtext || "",
          featureCards: fetchedData.featureCards && fetchedData.featureCards.length > 0 ? fetchedData.featureCards : [{ iconPath: "", title: "", content: "" }],
          faqs: fetchedData.faqs && fetchedData.faqs.length > 0 ? fetchedData.faqs : [{ id: `faq${Date.now()}`, question: "", answer: "" }],
        });
        setEditMode(false); // Start in view mode if data exists
      }
    } catch {
      setData(null);
      setEditMode(true); // Go to create mode on fetch error
      setForm(defaultForm);
       showTempMessage("⚠️ Could not fetch Niche Edit data. Starting in create mode.", "warning");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFeatureChange = (i, field, value) => {
    const updated = [...form.featureCards];
    updated[i] = { ...updated[i], [field]: value };
    setForm({ ...form, featureCards: updated });
  };

  const handleFaqChange = (i, field, value) => {
    const updated = [...form.faqs];
     updated[i] = { ...updated[i], [field]: value };
    setForm({ ...form, faqs: updated });
  };

  const handleIconUpload = (i, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => handleFeatureChange(i, "iconPath", reader.result); // Save as Base64
    reader.readAsDataURL(file);
  };

  const handleAddCard = () => {
     if (form.featureCards.length >= 6) {
         showTempMessage("⚠️ Maximum number of feature cards reached.", "warning");
         return;
     }
    setForm({
      ...form,
      featureCards: [...form.featureCards, { iconPath: "", title: "", content: "" }],
    });
  }

  const handleAddFaq = () => {
     if (form.faqs.length >= 10) {
        showTempMessage("⚠️ Maximum number of FAQs reached.", "warning");
        return;
    }
    setForm({
      ...form,
      faqs: [...form.faqs, { id: `faq${Date.now()}`, question: "", answer: "" }],
    });
  };

  const handleCardDelete = (i) => {
    if (form.featureCards.length <= 1) {
        showTempMessage("⚠️ At least one feature card is required.", "warning");
        return;
    }
    const updated = form.featureCards.filter((_, index) => index !== i);
    setForm({ ...form, featureCards: updated });
  };

  const handleFaqDelete = (i) => {
     if (form.faqs.length <= 1) {
        showTempMessage("⚠️ At least one FAQ is required.", "warning");
        return;
    }
    const updated = form.faqs.filter((_, index) => index !== i);
    setForm({ ...form, faqs: updated });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.featuresHeading?.trim()) newErrors.featuresHeading = "Heading is required";
    if (!form.featuresSubtext?.trim()) newErrors.featuresSubtext = "Subtext is required";

    form.featureCards.forEach((card, i) => {
      if (!card.title?.trim() || !card.content?.trim() || !card.iconPath)
        newErrors[`featureCard${i}`] = `Card ${i + 1}: Icon, Title, and Content are required`;
    });

    form.faqs.forEach((faq, i) => {
      if (!faq.question?.trim() || !faq.answer?.trim())
        newErrors[`faq${i}`] = `FAQ ${i + 1}: Question and Answer are required`;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
        showTempMessage("❌ Please fix the validation errors.", "error");
    }
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async () => {
  if (!validateForm()) return;
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const payload = { ...form };

    if (data) {
      await axios.put(API_URL, payload, { headers }); // ✅ updated
      showTempMessage("✅ Content updated successfully!");
    } else {
      await axios.post(API_URL, payload, { headers }); // ✅ updated
      showTempMessage("✅ Content created successfully!");
    }

    setEditMode(false);
    fetchData();
  } catch (error) {
    console.error("Error saving content:", error.response?.data || error.message);
    showTempMessage(
      `❌ Failed to save content: ${error.response?.data?.message || error.message}`,
      "error"
    );
  } finally {
    setLoading(false);
  }
};


const handleDeleteConfirmed = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    await axios.delete(API_URL, { headers: { Authorization: `Bearer ${token}` } }); // ✅ updated
    setData(null);
    setForm(defaultForm);
    setEditMode(true);
    setShowDeleteConfirm(false);
    showTempMessage("🗑️ Content deleted successfully!");
  } catch (error) {
    console.error("Error deleting content:", error.response?.data || error.message);
    showTempMessage(
      `❌ Failed to delete content: ${error.response?.data?.message || error.message}`,
      "error"
    );
  } finally {
    setLoading(false);
  }
};


  const startEditing = () => {
    // Load current data into form for editing, or default if no data
    setForm(data ? {
        featuresHeading: data.featuresHeading || "",
        featuresSubtext: data.featuresSubtext || "",
        featureCards: data.featureCards && data.featureCards.length > 0 ? data.featureCards : [{ iconPath: "", title: "", content: "" }],
        faqs: data.faqs && data.faqs.length > 0 ? data.faqs : [{ id: `faq${Date.now()}`, question: "", answer: "" }],
    } : defaultForm);
    setEditMode(true);
    setErrors({});
  };

  // --- STYLES (Copied from GuestPostingManager and adjusted slightly if needed) ---
   const styles = {
     container: {
      padding: "1rem 2rem",
      fontFamily: "'Inter', sans-serif",
    },
    header: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#1351d8", // Primary Blue
      borderBottom: "1px solid #e5e7eb", // Light border bottom
      paddingBottom: "0.75rem",
      marginBottom: "1.5rem",
    },
    card: { // General card style for edit sections and preview
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      borderRadius: "12px",
      boxShadow: "0 6px 24px rgba(0,0,0,0.07)",
      padding: "1.5rem",
      marginBottom: "1.5rem",
    },
     subHeader: {
        fontSize: "18px",
        fontWeight: "600",
        marginBottom: "0.5rem",
        color: "#1f2937", // Dark Gray
     },
     paragraph: {
         color: "#4b5563", // Medium Gray
         lineHeight: 1.6,
         marginBottom: '1rem',
     },
    input: {
      padding: "10px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      boxSizing: "border-box",
      width: "100%",
      fontFamily: "'Inter', sans-serif",
      marginBottom: "1rem",
    },
    textarea: {
      padding: "10px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      boxSizing: "border-box",
      width: "100%",
      fontFamily: "'Inter', sans-serif",
      minHeight: "100px",
      resize: "vertical",
      marginBottom: "1rem",
    },
    inputSmall: { // For side-by-side inputs
      flex: 1,
      padding: "8px 12px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "14px",
    },
    cardEditSection: { // Section for adding/editing cards/FAQs
        marginBottom: '1.5rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid #e5e7eb',
    },
    cardEditItem: { // Container for one card/FAQ in edit mode
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "1rem",
      backgroundColor: "#f9fafb", // Light background for item
      padding: "1rem",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
    },
     imgPlaceholder: {
      width: "60px",
      height: "60px",
      border: "2px dashed #d1d5db",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      backgroundColor: "#fff",
      color: "#6b7280",
      fontWeight: "500",
      flexShrink: 0,
    },
    imgPreviewSmall: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '6px', // Match placeholder radius
    },
    deleteSmall: {
      background: "#fee2e2", // Light Red background
      color: "#dc2626", // Dark Red text
      border: "none",
      padding: "8px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "600",
    },
    primaryButton: {
      backgroundColor: "#1351d8", // Primary Blue
      color: "white",
      border: "none",
      padding: "12px 18px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "16px",
    },
    secondaryButton: {
      backgroundColor: "#e5e7eb", // Light Gray
      color: "#1f2937", // Dark Gray text
      border: "none",
      padding: "10px 16px", // Slightly smaller padding
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
       fontSize: "15px",
    },
    addButton: { // Specific style for Add buttons
       backgroundColor: "#d1fae5", // Light Green background
      color: "#065f46", // Dark Green text
       border: "none",
      padding: "10px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
       fontSize: "15px",
       display: 'block', // Make add buttons block level
       width: 'fit-content', // Fit content width
       marginTop: '0.5rem', // Margin top
    },
    deleteButton: {
      backgroundColor: "#dc2626", // Danger Red
      color: "white",
      border: "none",
      padding: "12px 18px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "16px",
    },
     collapseSection: { marginBottom: "1.5rem" },
    toggleBtn: {
      backgroundColor: "#f3f4f6", // Lighter Gray
      border: "1px solid #e5e7eb",
      padding: "8px 14px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "0.5rem", // Add margin below toggle
    },
    listBox: {
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "1rem",
      marginTop: "0.5rem",
      background: "#fff", // White background for list box
    },
    previewCard: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      borderBottom: "1px solid #f3f4f6", // Very light border
      padding: "1rem 0",
      '&:last-child': {
        borderBottom: 'none',
        paddingBottom: '0.5rem',
      },
       '&:first-child': {
        paddingTop: '0.5rem',
      },
    },
    previewImg: {
      width: "50px",
      height: "50px",
      borderRadius: "8px",
      objectFit: "cover",
      border: "1px solid #e5e7eb",
      flexShrink: 0,
    },
    previewTextContainer: {
        flex: 1,
        minWidth: 0,
    },
     previewTitle: {
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '0.25rem',
     },
     previewContent: {
         color: '#4b5563',
         fontSize: '14px',
         margin: 0,
     },
    actions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      marginTop: "2rem",
      paddingTop: "1.5rem",
      borderTop: "1px solid #e5e7eb",
    },
     dialogOverlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },
    dialogBox: {
      background: "#fff",
      padding: "2rem",
      borderRadius: "12px",
      width: "90%",
      maxWidth: "400px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
      textAlign: 'center',
    },
     dialogTitle: {
        marginTop: 0,
        marginBottom: '1rem',
        color: '#1f2937',
        fontSize: '1.25rem',
        fontWeight: '600',
    },
    dialogText: {
        color: '#4b5563',
        marginBottom: '1.5rem',
        fontSize: '1rem',
    },
    dialogActions: {
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
    },
    error: {
      color: "#dc2626", // Danger Red
      fontSize: "13px",
      marginTop: "-0.5rem",
      marginBottom: "0.5rem",
    },
     loadingOverlay: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '12px',
        zIndex: 10,
        color: '#1351d8',
        fontWeight: '600',
    },
     message: { // General message style
      padding: "10px 15px",
      borderRadius: "8px",
      marginBottom: "1.5rem",
      textAlign: "center",
      fontWeight: "500",
    },
    successMessage: {
       backgroundColor: "#d1fae5",
       color: "#065f46",
    },
    errorMessage: {
        backgroundColor: "#fde2e2",
       color: "#b91c1c",
    },
    warningMessage: {
        backgroundColor: "#fef3c7",
        color: "#92400e",
    }
  };
  // --- END OF STYLES ---


  return (
    <div style={styles.container}>
       {loading && !editMode && <div style={styles.loadingOverlay}>Loading...</div>}
      <h2 style={styles.header}>Niche Edit Service Content</h2>

      {message && (
             <div style={{
                 ...styles.message,
                 backgroundColor: message.type === 'error' ? styles.errorMessage.backgroundColor : (message.type === 'warning' ? styles.warningMessage.backgroundColor : styles.successMessage.backgroundColor),
                 color: message.type === 'error' ? styles.errorMessage.color : (message.type === 'warning' ? styles.warningMessage.color : styles.successMessage.color),
             }}>
                 {message.text}
             </div>
        )}

      {/* =================== PREVIEW =================== */}
      {!editMode && data && (
        <div style={styles.card}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={styles.subHeader}>{data.featuresHeading}</h3>
            <p style={styles.paragraph}>{data.featuresSubtext}</p>
          </div>

          <div style={styles.collapseSection}>
            <button onClick={() => setShowCards(!showCards)} style={styles.toggleBtn}>
              {showCards ? "Hide Feature Cards" : "Show Feature Cards"}
            </button>
            {showCards && (
              <div style={styles.listBox}>
                {data.featureCards?.map((c, i) => (
                  <div key={i} style={styles.previewCard}>
                    <img src={c.iconPath || 'https://placehold.co/50x50/e0e7ff/1351d8?text=Icon'} alt="icon" style={styles.previewImg} />
                    <div style={styles.previewTextContainer}>
                      <b style={styles.previewTitle}>{c.title}</b>
                      <p style={styles.previewContent}>{c.content}</p>
                    </div>
                  </div>
                ))}
                {(!data.featureCards || data.featureCards.length === 0) && <p style={{color: '#6b7280', textAlign: 'center'}}>No feature cards available.</p>}
              </div>
            )}
          </div>

          <div style={styles.collapseSection}>
            <button onClick={() => setShowFaqs(!showFaqs)} style={styles.toggleBtn}>
              {showFaqs ? "Hide FAQs" : "Show FAQs"}
            </button>
            {showFaqs && (
              <div style={styles.listBox}>
                {data.faqs?.map((f, i) => (
                  <div key={i} style={styles.previewCard}>
                     <div style={styles.previewTextContainer}>
                      <b style={styles.previewTitle}>Q: {f.question}</b>
                      <p style={styles.previewContent}><b>A:</b> {f.answer}</p>
                    </div>
                  </div>
                ))}
                 {(!data.faqs || data.faqs.length === 0) && <p style={{color: '#6b7280', textAlign: 'center'}}>No FAQs available.</p>}
              </div>
            )}
          </div>

          <div style={styles.actions}>
            <button style={styles.primaryButton} onClick={startEditing}>Edit Content</button>
            <button style={styles.deleteButton} onClick={() => setShowDeleteConfirm(true)}>Delete Content</button>
          </div>
        </div>
      )}

      {/* Message when no data and not loading */}
        {!loading && !data && !editMode && (
             <div style={{...styles.card, textAlign: 'center'}}>
                 <p style={{ color: "#6b7280", fontSize: '1rem' }}>No Niche Edit content found.</p>
                 <button style={{...styles.primaryButton, marginTop: '1rem'}} onClick={startEditing}>
                     Create New Content
                 </button>
             </div>
        )}

      {/* =================== EDIT / CREATE =================== */}
      {editMode && (
        <div style={styles.card}>
           {loading && <div style={styles.loadingOverlay}>Saving...</div>}
           <h3 style={styles.subHeader}>{data ? "Edit Niche Edit Content" : "Create Niche Edit Content"}</h3>
          <input
            name="featuresHeading"
            value={form.featuresHeading}
            onChange={handleChange}
            placeholder="Features Section Heading"
            style={styles.input}
          />
          {errors.featuresHeading && <p style={styles.error}>{errors.featuresHeading}</p>}

          <textarea
            name="featuresSubtext"
            value={form.featuresSubtext}
            onChange={handleChange}
            placeholder="Features Section Subtext"
            style={styles.textarea}
          />
          {errors.featuresSubtext && <p style={styles.error}>{errors.featuresSubtext}</p>}

          {/* Edit Feature Cards */}
          <div style={styles.cardEditSection}>
            <h4 style={styles.subHeader}>Feature Cards</h4>
            {form.featureCards.map((c, i) => (
              <div key={i}>
                <div style={styles.cardEditItem}>
                  <div onClick={() => document.getElementById(`niche-icon${i}`).click()} style={styles.imgPlaceholder}>
                    {c.iconPath ? <img src={c.iconPath} alt="preview" style={styles.imgPreviewSmall} /> : <span>Icon</span>}
                  </div>
                  <input type="file" id={`niche-icon${i}`} style={{ display: "none" }} accept="image/*" onChange={(e) => handleIconUpload(i, e.target.files[0])} />
                  <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                      <input value={c.title} onChange={(e) => handleFeatureChange(i, "title", e.target.value)} placeholder="Card Title" style={{...styles.inputSmall, width: '100%'}} />
                      <input value={c.content} onChange={(e) => handleFeatureChange(i, "content", e.target.value)} placeholder="Card Content" style={{...styles.inputSmall, width: '100%'}} />
                  </div>
                  <button onClick={() => handleCardDelete(i)} style={styles.deleteSmall}>Remove</button>
                </div>
                 {errors[`featureCard${i}`] && <p style={styles.error}>{errors[`featureCard${i}`]}</p>}
              </div>
            ))}
            <button onClick={handleAddCard} style={styles.addButton}>+ Add Card</button>
          </div>

          {/* Edit FAQs */}
           <div style={styles.cardEditSection}>
            <h4 style={styles.subHeader}>FAQs</h4>
            {form.faqs.map((f, i) => (
              <div key={f.id || i}> {/* Use provided ID or index as key */}
                 <div style={styles.cardEditItem}>
                    <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                      <input value={f.question} onChange={(e) => handleFaqChange(i, "question", e.target.value)} placeholder="FAQ Question" style={{...styles.inputSmall, width: '100%'}} />
                      <textarea value={f.answer} onChange={(e) => handleFaqChange(i, "answer", e.target.value)} placeholder="FAQ Answer" style={{...styles.textarea, minHeight: '60px', marginBottom: 0, fontSize: '14px'}} />
                    </div>
                    <button onClick={() => handleFaqDelete(i)} style={styles.deleteSmall}>Remove</button>
                 </div>
                 {errors[`faq${i}`] && <p style={styles.error}>{errors[`faq${i}`]}</p>}
              </div>
            ))}
            <button onClick={handleAddFaq} style={styles.addButton}>+ Add FAQ</button>
          </div>

          <div style={styles.actions}>
            <button onClick={handleSubmit} style={{...styles.primaryButton, opacity: loading ? 0.7 : 1 }} disabled={loading}>
               {loading ? "Saving..." : (data ? "Update Content" : "Create Content")}
            </button>
            {data && (
              <button onClick={() => { setEditMode(false); setErrors({}); fetchData(); }} style={styles.secondaryButton} disabled={loading}>
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* =================== DELETE CONFIRM =================== */}
      {showDeleteConfirm && (
        <div style={styles.dialogOverlay}>
          <div style={styles.dialogBox}>
             <h3 style={styles.dialogTitle}>Confirm Deletion</h3>
            <p style={styles.dialogText}>Are you sure you want to permanently delete all Niche Edit service content?</p>
            <div style={styles.dialogActions}>
               <button style={styles.secondaryButton} onClick={() => setShowDeleteConfirm(false)} disabled={loading}>Cancel</button>
              <button style={{...styles.deleteButton, opacity: loading ? 0.7 : 1}} onClick={handleDeleteConfirmed} disabled={loading}>
                  {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NicheEditManager;
