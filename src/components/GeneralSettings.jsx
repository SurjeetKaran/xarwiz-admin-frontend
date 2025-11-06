import React, { useEffect, useState } from "react";
import axios from "axios";
// Icons removed

const API_URL = "http://localhost:3000/api/index/site-info";

export default function SiteInfoSettings() {
  const [settings, setSettings] = useState({
    logoUrl: "",
    footerDescription: "",
    phone: "",
    email: "",
    copyrightText: "",
    // --- 1. ADDED SOCIAL LINKS OBJECT ---
    socialLinks: {
      facebook: "",
      instagram: "",
      linkedin: "",
    },
  });
  const [form, setForm] = useState(settings);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(API_URL);
      if (data && Object.keys(data).length > 0) {
        
        // --- 2. UPDATED MERGE LOGIC FOR NESTED OBJECT ---
        // This ensures we merge socialLinks deeply and keep defaults
        const initialData = {
          ...settings, // Start with all default keys
          ...data,     // Override with fetched data
          socialLinks: { // Explicitly merge the nested socialLinks
            ...settings.socialLinks,   // Default social keys
            ...(data.socialLinks || {}), // Fetched social keys
          },
        };
        // --- END OF UPDATE ---

        setSettings(initialData);
        setForm(initialData);
      } else {
        setForm(settings);
      }
    } catch (error) {
      console.error("Error fetching site info:", error);
      setForm(settings);
    }
  };

  const showTempMessage = (msg, type = "success") => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(null), 2500);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // --- 3. ADDED NEW HANDLER FOR NESTED STATE ---
  const handleSocialChange = (e) => {
    setForm({
      ...form,
      socialLinks: {
        ...form.socialLinks, // Keep other social links
        [e.target.name]: e.target.value, // Update the one that changed
      },
    });
  };
  // --- END OF NEW HANDLER ---

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, logoUrl: reader.result }); // Save as Base64
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put(API_URL, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(form);
      showTempMessage("✅ Site info updated successfully!");
    } catch (error) {
      console.error("Error updating site info:", error);
      showTempMessage("❌ Failed to update site info.", "error");
    }
  };

  const styles = {
    // ... (all your existing styles are fine)
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
      padding: "2rem",
      maxWidth: "700px",
      margin: "0 auto",
    },
    heading: {
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "1.5rem",
      color: "#1351d8", // Primary Blue
    },
    // --- ADDED NEW STYLE FOR SOCIALS SUB-HEADING ---
    socialHeading: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#374151", // Dark gray
      marginTop: "1.5rem",
      marginBottom: "1rem",
      borderTop: "1px solid #e5e7eb", // Separator
      paddingTop: "1.5rem",
    },
    // --- END OF NEW STYLE ---
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
    textArea: {
      padding: "10px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      boxSizing: "border-box",
      width: "100%",
      fontFamily: "'Inter', sans-serif",
      marginBottom: "1rem",
      minHeight: "100px",
      resize: "vertical",
    },
    button: {
      backgroundColor: "#1351d8",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 18px",
      fontSize: "16px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "background-color 0.3s ease",
      width: "100%",
      marginTop: "1rem",
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
    imagePickerContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    imagePicker: {
      width: "100px",
      height: "100px",
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
    },
    imagePreview: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    },
    imageLabel: {
      marginTop: '0.5rem',
      fontSize: '14px',
      color: '#6b7280',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>General Site Settings</h1>

        {message && (
          <div
            style={{
              ...styles.message,
              ...(message.type === "error"
                ? styles.errorMessage
                : styles.successMessage),
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdate}>
          {/* Logo Picker */}
          <div style={styles.imagePickerContainer}>
            <div
              style={styles.imagePicker}
              onClick={() => document.getElementById("logoInput").click()}
            >
              {form.logoUrl ? (
                <img
                  src={form.logoUrl}
                  alt="Logo Preview"
                  style={styles.imagePreview}
                />
              ) : (
                <span>Upload Logo</span>
              )}
            </div>
            <span style={styles.imageLabel}>Click to upload logo (Base64)</span>
          </div>
          <input
            type="file"
            id="logoInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />

          <textarea
            name="footerDescription"
            placeholder="Footer Description"
            value={form.footerDescription}
            onChange={handleChange}
            style={styles.textArea}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            style={styles.formInput}
          />
          <input
            type="email"
            name="email"
            placeholder="Contact Email"
            value={form.email}
            onChange={handleChange}
            style={styles.formInput}
          />
          <input
            type="text"
            name="copyrightText"
            placeholder="Copyright Text (e.g., © 2025 Your Company)"
            value={form.copyrightText}
            onChange={handleChange}
            style={styles.formInput}
          />

          {/* --- 4. ADDED SOCIAL LINK INPUTS --- */}
          <h2 style={styles.socialHeading}>Social Media Links</h2>
          
          <input
            type="text"
            name="facebook"
            placeholder="Facebook URL (e.g., https://facebook.com/xarwiz)"
            value={form.socialLinks.facebook} // Access nested value
            onChange={handleSocialChange}       // Use social handler
            style={styles.formInput}
          />
          <input
            type="text"
            name="instagram"
            placeholder="Instagram URL (e.g., https://instagram.com/xarwiz)"
            value={form.socialLinks.instagram} // Access nested value
            onChange={handleSocialChange}        // Use social handler
            style={styles.formInput}
          />
          <input
            type="text"
            name="linkedin"
            placeholder="LinkedIn URL (e.g., https://linkedin.com/company/xarwiz)"
            value={form.socialLinks.linkedin} // Access nested value
            onChange={handleSocialChange}       // Use social handler
            style={styles.formInput}
          />
          {/* --- END OF ADDED SECTION --- */}

          <button type="submit" style={styles.button}>
            Update Site Info
          </button>
        </form>
      </div>
    </div>
  );
}