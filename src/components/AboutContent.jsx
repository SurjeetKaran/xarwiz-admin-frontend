
import React, { useEffect, useState } from 'react';

// --- Helper functions to create default items ---
const createEmptyCard = () => ({
  iconPath: '', // Will hold the Base64 string
  title: '',
  content: ''
});

const createEmptyPlan = () => ({
  name: '',
  description: '',
  price: 0,
  priceLabel: '/Monthly',
  ctaUrl: '',
  features: [{ text: 'Default Feature' }] // MUST have at least one
});

// --- Initial state matches model validation ---
const initialFormState = {
  featuresMainHeading: '',
  featuresSubHeading: '',
  featureCards: [ // Must have >= 4 based on previous strict model setup
    createEmptyCard(),
    createEmptyCard(),
    createEmptyCard(),
    createEmptyCard()
  ],
  pricingMainHeading: '',
  pricingSubHeading: '',
  pricingPlans: [ // Must have >= 3 based on previous strict model setup
    createEmptyPlan(),
    createEmptyPlan(),
    createEmptyPlan()
  ]
};

export default function AboutContent() {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // Use string for message

  const [mode, setMode] = useState('loading');
  const [isFeaturesCollapsed, setIsFeaturesCollapsed] = useState(true);
  const [isPricingCollapsed, setIsPricingCollapsed] = useState(true);

  const API_URL = 'https://xarwiz-admin-backend.onrender.com/api/about-content';

    // Function to show temporary messages
   const showTempMessage = (msg, type = "success") => {
    // We only have one message state, store type info if needed elsewhere or simplify
    setMessage(`${type === 'error' ? '❌' : (type === 'warning' ? '⚠️' : '✅')} ${msg}`);
    setTimeout(() => setMessage(""), 3000); // Display for 3 seconds
  };

  // 1. Fetch Content (GET)
  const fetchContent = async () => {
    setMode('loading');
    setMessage('');
    try {
      const token = localStorage.getItem("token"); // Auth token might be needed
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        if (res.status === 404) {
          setFormData(initialFormState);
          setMode('create');
           showTempMessage("No existing content found. Starting in create mode.", "warning");
          return;
        }
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }

      const data = await res.json();
      if (data?.data) {
         // Merge fetched data, ensuring minimum array lengths and nested structures
         const fetchedCards = data.data.featureCards || [];
         const fetchedPlans = data.data.pricingPlans || [];
        const mergedData = {
          ...initialFormState,
          ...data.data,
           featureCards: fetchedCards.length >= 4 ? fetchedCards : [...fetchedCards, ...Array(4 - fetchedCards.length).fill(null).map(createEmptyCard)],
           pricingPlans: fetchedPlans.length >= 3 ? fetchedPlans : [...fetchedPlans, ...Array(3 - fetchedPlans.length).fill(null).map(createEmptyPlan)],
        };
         mergedData.pricingPlans = mergedData.pricingPlans.map(plan => ({
            ...plan,
            features: (plan.features && plan.features.length > 0) ? plan.features : [{ text: 'Default Feature' }]
         }));

        setFormData(mergedData);
        setMode('view');
      } else {
        setFormData(initialFormState);
        setMode('create');
        showTempMessage("No content data found. Starting in create mode.", "warning");
      }
    } catch (err) {
       console.error("Fetch error:", err);
      showTempMessage(`Failed to fetch data: ${err.message}. Please try creating content.`, 'error');
      setFormData(initialFormState);
      setMode('create');
    }
  };


  useEffect(() => {
    fetchContent();
  }, []);

  // --- Form Handlers ---

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    const updatedArray = [...formData[arrayName]];
    if (updatedArray[index]) {
       updatedArray[index] = { ...updatedArray[index], [field]: value };
       setFormData({ ...formData, [arrayName]: updatedArray });
    }
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleArrayChange('featureCards', index, 'iconPath', reader.result); // Save Base64 to iconPath
    };
    reader.readAsDataURL(file);
  };

  // --- Feature Card Handlers ---
  const addFeatureCard = () => {
    setMessage('');
    setFormData({
      ...formData,
      featureCards: [ ...formData.featureCards, createEmptyCard() ]
    });
  };

  const removeFeatureCard = (index) => {
    if (formData.featureCards.length <= 4) {
      showTempMessage('Validation Failed: Minimum of 4 feature cards is required.', 'error');
      return;
    }
    setMessage('');
    const updatedCards = formData.featureCards.filter((_, i) => i !== index);
    setFormData({ ...formData, featureCards: updatedCards });
  };

  // --- Pricing Plan Handlers ---
  const addPlan = () => {
    setMessage('');
    setFormData({
      ...formData,
      pricingPlans: [ ...formData.pricingPlans, createEmptyPlan() ]
    });
  };

  const removePlan = (index) => {
    if (formData.pricingPlans.length <= 3) {
      showTempMessage('Validation Failed: Minimum of 3 pricing plans is required.', 'error');
      return;
    }
    setMessage('');
    const updatedPlans = formData.pricingPlans.filter((_, i) => i !== index);
    setFormData({ ...formData, pricingPlans: updatedPlans });
  };

  // --- Handlers for Nested pricingPlans.features ---

  const handlePlanFeatureChange = (planIndex, featureIndex, value) => {
    const updatedPlans = [...formData.pricingPlans];
     if (updatedPlans[planIndex] && updatedPlans[planIndex].features) {
         if (updatedPlans[planIndex].features[featureIndex]) {
            updatedPlans[planIndex].features[featureIndex] = { ...updatedPlans[planIndex].features[featureIndex], text: value };
            setFormData({ ...formData, pricingPlans: updatedPlans });
         }
     }
  };

  const addPlanFeature = (planIndex) => {
    setMessage('');
    const updatedPlans = [...formData.pricingPlans];
     if (updatedPlans[planIndex]) {
        if (!updatedPlans[planIndex].features) {
            updatedPlans[planIndex].features = [];
        }
        updatedPlans[planIndex].features.push({ text: '' });
        setFormData({ ...formData, pricingPlans: updatedPlans });
    }
  };

  const removePlanFeature = (planIndex, featureIndex) => {
    const updatedPlans = [...formData.pricingPlans];
    if (updatedPlans[planIndex] && updatedPlans[planIndex].features && updatedPlans[planIndex].features.length > 1) {
        setMessage('');
        updatedPlans[planIndex].features = updatedPlans[planIndex].features.filter((_, i) => i !== featureIndex);
        setFormData({ ...formData, pricingPlans: updatedPlans });
    } else {
         showTempMessage('Validation Failed: At least one feature is required per plan.', 'error');
    }
  };

  // --- Frontend Validation ---
   const validateForm = () => {
    setMessage('');
    const errors = [];
    if (!formData.featuresMainHeading?.trim()) errors.push('Feature Section Heading required.');
    if (!formData.pricingMainHeading?.trim()) errors.push('Pricing Section Heading required.');
    if (!formData.pricingSubHeading?.trim()) errors.push('Pricing Section Sub-Heading required.');
    if (!formData.featureCards || formData.featureCards.length < 4) errors.push('At least 4 feature cards required.');
    else formData.featureCards.forEach((c, i) => {
        if (!c.iconPath) errors.push(`Card ${i+1}: Icon required.`);
        if (!c.title?.trim()) errors.push(`Card ${i+1}: Title required.`);
        if (!c.content?.trim()) errors.push(`Card ${i+1}: Content required.`);
    });
    if (!formData.pricingPlans || formData.pricingPlans.length < 3) errors.push('At least 3 pricing plans required.');
    else formData.pricingPlans.forEach((p, i) => {
        if (!p.name?.trim()) errors.push(`Plan ${i+1}: Name required.`);
        if (p.price === null || p.price === undefined || p.price < 0) errors.push(`Plan ${i+1}: Valid Price required.`);
        if (!p.ctaUrl?.trim()) errors.push(`Plan ${i+1}: CTA URL required.`);
        if (!p.features || p.features.length < 1) errors.push(`Plan ${i+1}: At least 1 feature required.`);
        else p.features.forEach((f, j) => { if (!f.text?.trim()) errors.push(`Plan ${i+1}, Feature ${j+1}: Text required.`); });
    });
    if (errors.length > 0) { showTempMessage(`Validation Failed: ${errors.join(' ')}`, 'error'); return false; }
    return true;
  };

  // --- API Handlers ---
  const handleApiCall = async (method) => {
      if (!validateForm()) return;
      setLoading(true);
      try {
          const token = localStorage.getItem("token");
          const config = {
              method: method,
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              }
          };
          // Only add body for POST and PUT
          if (method === 'POST' || method === 'PUT') {
              config.body = JSON.stringify(formData);
          }

          const res = await fetch(API_URL, config);
          const data = await res.json();

          if (!res.ok) throw new Error(data.message || `Failed to ${method.toLowerCase()} content`);

          showTempMessage(data.message || `Content ${method === 'POST' ? 'created' : 'updated'}!`, 'success');
          // Update state with potentially modified data from backend
          setFormData(data.data || (method === 'POST' ? initialFormState : formData));
          setMode('view'); // Go to view mode after successful save/update
           if (method === 'DELETE') { // Special handling for delete success
               setFormData(initialFormState);
               setMode('create');
               showTempMessage('Content deleted successfully!', 'success');
           } else {
               fetchContent(); // Re-fetch to ensure consistency after POST/PUT
           }

      } catch (e) {
          console.error(`${method} error:`, e);
          showTempMessage(`${method} failed: ${e.message}`, 'error');
           if (method === 'DELETE') {
               // Stay in view mode on delete failure unless 404
                if (e.message.includes('404')) { // Example check, adjust based on actual error
                    setFormData(initialFormState);
                    setMode('create');
                }
           }
      } finally {
          setLoading(false);
      }
  };


  const handleCreate = () => handleApiCall('POST');
  const handleUpdate = () => handleApiCall('PUT');
  const handleDelete = () => {
       if (window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
            handleApiCall('DELETE');
       }
  };

  // Correct definition of isFormDisabled before use
  const isFormDisabled = mode === 'view' || mode === 'loading' || loading;

  // --- STYLES UPDATED ---
  const styles = {
    container: {
      padding: "1rem 2rem",
      fontFamily: "'Inter', sans-serif",
    },
    pageHeading: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#1351d8",
      marginBottom: "1.5rem",
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
    sectionHeading: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1f2937",
      marginBottom: "1rem",
      paddingBottom: "0.5rem",
      borderBottom: "1px solid #e5e7eb",
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' },
    subCard: {
      backgroundColor: "#f9fafb",
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      position: 'relative'
     },
    input: {
      padding: "10px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      boxSizing: "border-box",
      width: "100%",
      fontFamily: "'Inter', sans-serif",
       margin: '6px 0',
    },
    textarea: {
       padding: "10px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      boxSizing: "border-box",
      width: "100%",
      fontFamily: "'Inter', sans-serif",
      minHeight: '80px',
      resize: 'vertical',
      margin: '6px 0',
    },
    disabledInput: { background: '#f3f4f6', color: '#6b7280', cursor: 'not-allowed' },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #e5e7eb'
    },
    button: { // General button style
      padding: "10px 16px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "15px",
      transition: 'background-color 0.3s ease, opacity 0.3s ease', // Added opacity transition
    },
     primaryButton: {
      backgroundColor: "#1351d8",
      color: "#fff",
    },
     secondaryButton: {
       backgroundColor: "#6b7280",
       color: "#fff",
    },
     dangerButton: {
       backgroundColor: "#dc2626",
       color: "#fff",
    },
    addButton: {
        backgroundColor: "#d1fae5",
        color: "#065f46",
        border: '1px solid #a7f3d0',
        padding: "8px 14px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "15px",
        display: 'block',
        width: 'fit-content',
        marginTop: '1rem',
    },
    removeBtn: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: '#fee2e2',
      color: '#dc2626',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      padding: '6px 10px',
      zIndex: 10
     },
     message: {
      marginBottom: "1.5rem",
      padding: "10px 15px",
      borderRadius: "8px",
      fontWeight: "500",
      textAlign: "center",
      border: '1px solid',
    },
    successMessage: {
       backgroundColor: "#d1fae5",
       color: "#065f46",
       borderColor: '#a7f3d0',
    },
    errorMessage: {
        backgroundColor: "#fde2e2",
       color: "#b91c1c",
       borderColor: '#fecaca',
    },
     warningMessage: {
        backgroundColor: "#fef3c7",
        color: "#92400e",
        borderColor: '#fde68a',
    },
    collapsibleHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
    },
    toggleBtn: {
      backgroundColor: "#f3f4f6",
      color: "#374151",
      border: "1px solid #e5e7eb",
      borderRadius: "6px",
      padding: '6px 12px',
      cursor: 'pointer',
      fontWeight: '500',
       fontSize: '14px',
     },

     nestedSection: {
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1rem',
        marginTop: '1rem'
    },
    nestedHeader: {
        margin: '0 0 1rem 0',
        fontSize: '1rem',
        fontWeight: '600',
        color: '#374151'
    },
    nestedItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.5rem',
    },
    nestedRemoveBtn: {
       background: '#fee2e2',
       color: '#dc2626',
       border: 'none',
       borderRadius: '6px',
       cursor: 'pointer',
       padding: '6px 10px',
       fontSize: '14px',
       fontWeight: '600',
     },
    nestedAddBtn: {
       backgroundColor: "#d1fae5",
       color: "#065f46",
       border: '1px solid #a7f3d0',
       borderRadius: '8px',
       cursor: 'pointer',
       padding: '8px 14px',
       fontSize: '15px',
       fontWeight: '600',
       width: '100%',
       marginTop: '0.5rem'
     },

    imagePreviewContainer: {
      boxSizing: 'border-box',
      width: '100%',
      height: '100px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9fafb',
      margin: '6px 0',
      overflow: 'hidden',
    },
    imagePreview: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    imagePlaceholder: {
      color: '#6b7280',
      textAlign: 'center',
      fontSize: '14px',
      padding: '5px',
    },
    imagePickerLabel: {
      cursor: 'pointer',
      border: '2px dashed #1351d8',
    }
  };
  // --- END OF STYLES ---

  // Adjust styles based on mode (re-defined here to ensure it uses updated styles object)
  const inputStyle = isFormDisabled ? { ...styles.input, ...styles.disabledInput } : styles.input;
  const textareaStyle = isFormDisabled ? { ...styles.textarea, ...styles.disabledInput } : styles.textarea;

  const showFeatures = (mode === 'edit' || mode === 'create') || (mode === 'view' && !isFeaturesCollapsed);
  const showPricing = (mode === 'edit' || mode === 'create') || (mode === 'view' && !isPricingCollapsed);


  return (
    <div style={styles.container}>
      <h2 style={styles.pageHeading}>About Page Content Manager</h2>

      {message && (
        <p style={{
          ...styles.message,
          ...(message.includes('Validation Failed') || message.includes('failed') ? styles.errorMessage : (message.includes('⚠️') ? styles.warningMessage : styles.successMessage))
        }}>
          {message}
        </p>
      )}

      {mode === 'loading' && <p>Loading content...</p>}

      {mode !== 'loading' && (
        <>
          <section style={styles.card}>
            <h3 style={styles.sectionHeading}>Feature Section Headings</h3>
            <input style={inputStyle} placeholder="Heading (Required)" value={formData.featuresMainHeading || ''} onChange={e => handleChange('featuresMainHeading', e.target.value)} disabled={isFormDisabled} />
            <input style={inputStyle} placeholder="Sub Heading" value={formData.featuresSubHeading || ''} onChange={e => handleChange('featuresSubHeading', e.target.value)} disabled={isFormDisabled} />
          </section>

          <div style={styles.card}>
            <div style={styles.collapsibleHeader}>
              <h3 style={styles.sectionHeading}>Feature Cards (Min: 4)</h3>
              {mode === 'view' && (
                <button style={styles.toggleBtn} onClick={() => setIsFeaturesCollapsed(!isFeaturesCollapsed)}>
                  {isFeaturesCollapsed ? 'Show' : 'Hide'}
                </button>
              )}
            </div>

            {showFeatures && (
              <>
                <div style={styles.grid}>
                  {formData.featureCards?.map((card, i) => (
                    <div style={styles.subCard} key={i}>
                      {!isFormDisabled && (
                        <button style={styles.removeBtn} onClick={() => removeFeatureCard(i)}>Remove</button>
                      )}
                      {isFormDisabled ? (
                        <div style={styles.imagePreviewContainer}>
                          {card.iconPath ? <img src={card.iconPath} alt="Icon" style={styles.imagePreview} /> : <div style={styles.imagePlaceholder}>No image</div>}
                        </div>
                      ) : (
                        <>
                          <input type="file" accept="image/*" style={{ display: 'none' }} id={`icon-picker-${i}`} onChange={(e) => handleImageChange(i, e)} />
                          <label htmlFor={`icon-picker-${i}`} style={{...styles.imagePreviewContainer, ...styles.imagePickerLabel}}>
                            {card.iconPath ? <img src={card.iconPath} alt="Icon Preview" style={styles.imagePreview} /> : <div style={styles.imagePlaceholder}>Click to select (Required)</div>}
                          </label>
                        </>
                      )}
                      <input style={inputStyle} placeholder="Title (Required)" value={card.title || ''} onChange={e => handleArrayChange('featureCards', i, 'title', e.target.value)} disabled={isFormDisabled} />
                      <textarea style={textareaStyle} placeholder="Content (Required)" value={card.content || ''} onChange={e => handleArrayChange('featureCards', i, 'content', e.target.value)} disabled={isFormDisabled} />
                    </div>
                  ))}
                </div>
                 {!isFormDisabled && <button style={styles.addButton} onClick={addFeatureCard}>+ Add Feature Card</button>}
              </>
            )}
          </div>

          <section style={styles.card}>
            <h3 style={styles.sectionHeading}>Pricing Section Headings</h3>
            <input style={inputStyle} placeholder="Heading (Required)" value={formData.pricingMainHeading || ''} onChange={e => handleChange('pricingMainHeading', e.target.value)} disabled={isFormDisabled} />
            <input style={inputStyle} placeholder="Sub Heading (Required)" value={formData.pricingSubHeading || ''} onChange={e => handleChange('pricingSubHeading', e.target.value)} disabled={isFormDisabled} />
          </section>

          <div style={styles.card}>
            <div style={styles.collapsibleHeader}>
              <h3 style={styles.sectionHeading}>Pricing Plans (Min: 3)</h3>
              {mode === 'view' && (
                <button style={styles.toggleBtn} onClick={() => setIsPricingCollapsed(!isPricingCollapsed)}>
                  {isPricingCollapsed ? 'Show' : 'Hide'}
                </button>
              )}
            </div>

            {showPricing && (
             <>
                <div style={styles.grid}>
                  {formData.pricingPlans?.map((plan, i) => (
                    <div style={styles.subCard} key={i}>
                      {!isFormDisabled && <button style={styles.removeBtn} onClick={() => removePlan(i)}>Remove</button>}
                      <input style={inputStyle} placeholder="Plan Name (Required)" value={plan.name || ''} onChange={e => handleArrayChange('pricingPlans', i, 'name', e.target.value)} disabled={isFormDisabled} />
                      <input style={inputStyle} placeholder="Description" value={plan.description || ''} onChange={e => handleArrayChange('pricingPlans', i, 'description', e.target.value)} disabled={isFormDisabled} />
                      <input style={inputStyle} type="number" placeholder="Price (Required)" value={plan.price === undefined ? '' : plan.price} onChange={e => handleArrayChange('pricingPlans', i, 'price', e.target.value)} disabled={isFormDisabled} />
                      <input style={inputStyle} placeholder="Price Label (e.g., /Month)" value={plan.priceLabel || ''} onChange={e => handleArrayChange('pricingPlans',i, 'priceLabel', e.target.value)} disabled={isFormDisabled} />
                      <input style={inputStyle} placeholder="CTA URL (Required)" value={plan.ctaUrl || ''} onChange={e => handleArrayChange('pricingPlans', i, 'ctaUrl', e.target.value)} disabled={isFormDisabled} />
                      <div style={styles.nestedSection}>
                        <h5 style={styles.nestedHeader}>Plan Features (Min: 1)</h5>
                        {plan.features?.map((feature, f_idx) => (
                          <div key={f_idx} style={styles.nestedItem}>
                            <input style={inputStyle} placeholder="Feature Text (Required)" value={feature.text || ''} onChange={e => handlePlanFeatureChange(i, f_idx, e.target.value)} disabled={isFormDisabled} />
                            {!isFormDisabled && <button style={styles.nestedRemoveBtn} onClick={() => removePlanFeature(i, f_idx)}>Remove</button>}
                          </div>
                        ))}
                        {!isFormDisabled && <button style={styles.nestedAddBtn} onClick={() => addPlanFeature(i)}>+ Add Feature</button>}
                      </div>
                    </div>
                  ))}
                </div>
                 {!isFormDisabled && <button style={styles.addButton} onClick={addPlan}>+ Add Pricing Plan</button>}
              </>
            )}
          </div>

          <div style={styles.buttonContainer}>
            {mode === 'create' && (
              <button style={{...styles.button, ...styles.primaryButton, opacity: loading ? 0.7 : 1}} onClick={handleCreate} disabled={loading}>
                {loading ? 'Creating...' : 'Create Content'}
              </button>
            )}
            {mode === 'view' && (
              <>
                <button style={{...styles.button, ...styles.primaryButton}} onClick={() => { setMode('edit'); setIsFeaturesCollapsed(false); setIsPricingCollapsed(false); }} disabled={loading}>
                  Edit
                </button>
                <button style={{...styles.button, ...styles.dangerButton, opacity: loading ? 0.7 : 1}} onClick={handleDelete} disabled={loading}>
                  {loading ? 'Deleting...' : 'Delete Content'}
                </button>
              </>
            )}
            {mode === 'edit' && (
              <>
                <button style={{...styles.button, ...styles.primaryButton, opacity: loading ? 0.7 : 1}} onClick={handleUpdate} disabled={loading}>
                  {loading ? 'Saving Update...' : 'Save Update'}
                </button>
                <button style={{...styles.button, ...styles.secondaryButton}} onClick={() => { setMode('view'); setIsFeaturesCollapsed(true); setIsPricingCollapsed(true); fetchContent(); }} disabled={loading}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}