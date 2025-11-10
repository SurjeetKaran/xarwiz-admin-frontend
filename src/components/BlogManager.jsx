
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Editor } from "@tinymce/tinymce-react";

// export default function BlogManager() {
//   const [formData, setFormData] = useState({
//     title: "",
//     slug: "", // --- CHANGED: Added slug field
//     summary: "",
//     author: "",
//     category: "",
//     subcategory: "",
//     tags: [],
//     content: "",
//     imageUrl: "",
//     readTime: "",
//     publishDate: "",
//     isFeatured: false,
//     status: "published",
//   });

//   const [authors, setAuthors] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [tags, setTags] = useState([]);
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [editingId, setEditingId] = useState(null);

//   // ... (fetch functions remain the same) ...
//   useEffect(() => {
//     fetchAuthors();
//     fetchCategories();
//     fetchTags();
//     fetchBlogs();
//   }, []);

//   const fetchAuthors = async () => {
//     try {
//       const res = await axios.get("https://xarwiz-admin-backend.onrender.com/api/admin/authors");
//       setAuthors(res.data);
//     } catch (err) {
//       console.error("Error fetching authors:", err);
//       setAuthors([]);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get("https://xarwiz-admin-backend.onrender.com/api/blog/categories");
//       setCategories(res.data);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//       setCategories([]);
//     }
//   };

//   const fetchSubcategories = async (categoryId) => {
//     if (!categoryId) return;
//     try {
//       const res = await axios.get(
//         `https://xarwiz-admin-backend.onrender.com/api/blog/categories/${categoryId}/subcategories`
//       );
//       setSubcategories(res.data);
//     } catch (err) {
//       console.error("Error fetching subcategories:", err);
//       setSubcategories([]);
//     }
//   };

//   const fetchTags = async () => {
//     try {
//       const res = await axios.get("https://xarwiz-admin-backend.onrender.com/api/blog/tags");
//       setTags(res.data);
//     } catch (err) {
//       console.error("Error fetching tags:", err);
//       setTags([]);
//     }
//   };

//   const fetchBlogs = async () => {
//     try {
//       const res = await axios.get("https://xarwiz-admin-backend.onrender.com/api/blog/posts");
//       setBlogs(res.data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching blogs:", err);
//       setLoading(false);
//     }
//   };


//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     const val = type === "checkbox" ? checked : value;
//     setFormData((prev) => ({ ...prev, [name]: val }));

//     if (name === "category") {
//       setFormData((prev) => ({ ...prev, subcategory: "" }));
//       fetchSubcategories(value);
//     }
//   };

//   const handleTagSelect = (tagSlug) => {
//     setFormData((prev) => {
//       const alreadySelected = prev.tags.includes(tagSlug);
//       return {
//         ...prev,
//         tags: alreadySelected
//           ? prev.tags.filter((s) => s !== tagSlug)
//           : [...prev.tags, tagSlug],
//       };
//     });
//   };

//   // Store image as Base64
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       title: formData.title,
//       // --- CHANGED: Use manual slug (still sanitize it)
//       slug: formData.slug.toLowerCase().trim().replace(/\s+/g, "-"),
//       summary: formData.summary,
//       content: formData.content,
//       imageUrl: formData.imageUrl, // This is now Base64
//       readTime: Number(formData.readTime),
//       category: formData.category,
//       subcategory: formData.subcategory || null, // Send null if empty
//       authorId: formData.author,
//       tags: tags
//         .filter((t) => formData.tags.includes(t.slug))
//         .map((t) => ({ name: t.name, slug: t.slug })),
//       isFeatured: formData.isFeatured,
//       status: formData.status,
//       publishDate: formData.publishDate || new Date().toISOString(), // Default to now
//     };

//     try {
//       if (editingId) {
//         await axios.put(
//           `https://xarwiz-admin-backend.onrender.com/api/admin/blog/posts/${editingId}`,
//           payload
//         );
//         setMessage("✅ Blog post updated successfully!");
//       } else {
//         await axios.post(
//           "https://xarwiz-admin-backend.onrender.com/api/admin/blog/posts",
//           payload
//         );
//         setMessage("✅ Blog post created successfully!");
//       }

//       setFormData({
//         title: "",
//         slug: "", // --- CHANGED: Reset slug
//         summary: "",
//         author: "",
//         category: "",
//         subcategory: "",
//         tags: [],
//         content: "",
//         imageUrl: "",
//         readTime: "",
//         publishDate: "",
//         isFeatured: false,
//         status: "published",
//       });
//       setEditingId(null);
//       setSubcategories([]);
//       fetchBlogs();

//       setTimeout(() => setMessage(""), 2500);
//     } catch (err) {
//       console.error("Error saving blog:", err.response?.data || err.message);
//       setMessage("❌ Failed to save blog post.");
//       setTimeout(() => setMessage(""), 2500);
//     }
//   };

//   const handleEdit = (blog) => {
//     setEditingId(blog._id);
//     setFormData({
//       title: blog.title,
//       slug: blog.slug || "", // --- CHANGED: Populate slug on edit
//       summary: blog.summary,
//       author: blog.author?._id || "",
//       category: blog.category?._id || "",
//       subcategory: blog.subcategory || "",
//       tags: blog.tags?.map((t) => t.slug) || [],
//       content: blog.content,
//       imageUrl: blog.imageUrl || "",
//       readTime: blog.readTime,
//       publishDate: blog.publishDate ? blog.publishDate.split("T")[0] : "", // Format for date input
//       isFeatured: blog.isFeatured,
//       status: blog.status,
//     });
//     fetchSubcategories(blog.category?._id);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    
//     setMessage("Deleting blog...");
//     try {
//       await axios.delete(`https://xarwiz-admin-backend.onrender.com/api/admin/blog/posts/${id}`);
//       setMessage("🗑️ Blog deleted successfully!");
//       fetchBlogs();
//     } catch (err)
//  {
//       console.error("Error deleting blog:", err);
//       setMessage("❌ Failed to delete blog.");
//     }
//     setTimeout(() => setMessage(""), 2500);
//   };

//   // --- (Styles remain the same) ---
//   const styles = {
//     container: { 
//       padding: "1rem 2rem", 
//       maxWidth: "1200px", 
//       margin: "auto",
//       fontFamily: "'Inter', sans-serif",
//     },
//     heading: { 
//       marginBottom: "1.5rem", 
//       color: "#1351d8",
//       fontSize: "20px",
//       fontWeight: "600",
//     },
//     message: {
//       padding: "10px 15px",
//       borderRadius: "8px",
//       marginBottom: "1.5rem",
//       textAlign: "center",
//       fontWeight: "500",
//       backgroundColor: "#d1fae5",
//       color: "#065f46",
//     },
//     errorMessage: {
//       backgroundColor: "#fde2e2",
//       color: "#b91c1c",
//     },
//     form: {
//       backgroundColor: "rgba(255, 255, 255, 0.9)",
//       backdropFilter: "blur(10px)",
//       border: "1px solid rgba(255, 255, 255, 0.5)",
//       borderRadius: "12px",
//       boxShadow: "0 6px 24px rgba(0,0,0,0.07)",
//       padding: "1.5rem",
//     },
//     row: { marginBottom: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" },
//     label: {
//       fontWeight: "600",
//       color: "#374151",
//     },
//     input: {
//       padding: "10px 14px",
//       border: "1px solid #d1d5db",
//       borderRadius: "8px",
//       fontSize: "15px",
//       boxSizing: "border-box",
//       width: "100%",
//       fontFamily: "'Inter', sans-serif",
//     },
//     select: {
//       padding: "10px 14px",
//       border: "1px solid #d1d5db",
//       borderRadius: "8px",
//       fontSize: "15px",
//       boxSizing: "border-box",
//       width: "100%",
//       fontFamily: "'Inter', sans-serif",
//       backgroundColor: "#fff",
//     },
//     tagContainer: {
//       display: "flex",
//       flexWrap: "wrap",
//       gap: "8px",
//       marginTop: "5px",
//       padding: "0.5rem",
//       backgroundColor: "#f9fafb",
//       borderRadius: "8px",
//     },
//     tag: {
//       padding: "6px 12px",
//       borderRadius: "20px",
//       border: "none",
//       cursor: "pointer",
//       fontSize: "14px",
//       fontWeight: "600",
//       transition: "background-color 0.2s, color 0.2s",
//     },
//     submitBtn: {
//       backgroundColor: "#1351d8",
//       color: "#fff",
//       border: "none",
//       padding: "12px 18px",
//       borderRadius: "8px",
//       cursor: "pointer",
//       fontSize: "16px",
//       fontWeight: "600",
//     },
//     blogList: { marginTop: "2.5rem" },
//     blogCard: {
//       backgroundColor: "rgba(255, 255, 255, 0.9)",
//       backdropFilter: "blur(10px)",
//       border: "1px solid rgba(255, 255, 255, 0.5)",
//       borderRadius: "12px",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//       padding: "1.5rem",
//       marginBottom: "1rem",
//     },
//     blogHeader: {
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       gap: "1rem",
//     },
//     blogTitle: {
//       fontSize: "1.2rem",
//       fontWeight: "600",
//       color: "#1f2937",
//       margin: 0,
//     },
//     blogMeta: {
//       fontSize: "0.9rem",
//       color: "#6b7280",
//       marginTop: "0.5rem",
//     },
//     btnGroup: { display: "flex", gap: "8px", flexShrink: 0 },
//     editBtn: {
//       background: "#10b981",
//       color: "white",
//       border: "none",
//       padding: "8px 12px",
//       borderRadius: "6px",
//       cursor: "pointer",
//       fontWeight: "500",
//     },
//     deleteBtn: {
//       background: "#dc2626",
//       color: "white",
//       border: "none",
//       padding: "8px 12px",
//       borderRadius: "6px",
//       cursor: "pointer",
//       fontWeight: "500",
//     },
//     checkboxLabel: {
//       display: "flex",
//       alignItems: "center",
//       gap: "0.5rem",
//       fontSize: "15px",
//       fontWeight: "600",
//       color: "#374151",
//     }
//   };


//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>
//         {editingId ? "Edit Blog Post" : "Create New Blog Post"}
//       </h2>

//       {message && <div style={{...styles.message, ...(message.startsWith("❌") || message.startsWith("Failed") ? styles.errorMessage : {})}}>{message}</div>}

//       <form style={styles.form} onSubmit={handleSubmit}>
//         {/* Title */}
//         <div style={styles.row}>
//           <label style={styles.label}>Title:</label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             placeholder="Enter blog title"
//             style={styles.input}
//             required
//           />
//         </div>

//         {/* --- CHANGED: ADDED SLUG INPUT --- */}
//         <div style={styles.row}>
//           <label style={styles.label}>Slug:</label>
//           <input
//             type="text"
//             name="slug"
//             value={formData.slug}
//             onChange={handleChange}
//             placeholder="e.g., my-awesome-post-slug"
//             style={styles.input}
//             required
//           />
//         </div>

//         {/* Summary */}
//         <div style={styles.row}>
//           <label style={styles.label}>Summary:</label>
//           <textarea
//             name="summary"
//             value={formData.summary}
//             onChange={handleChange}
//             placeholder="Short blog summary (for card previews)"
//             style={{ ...styles.input, height: "80px", resize: "vertical" }}
//             required
//           />
//         </div>
        
//         <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem"}}>
//           {/* Author */}
//           <div style={styles.row}>
//             <label style={styles.label}>Author:</label>
//             <select
//               name="author"
//               value={formData.author}
//               onChange={handleChange}
//               style={styles.select}
//               required
//             >
//               <option value="">
//                 {authors.length === 0 ? "No authors found" : "Select Author"}
//               </option>
//               {authors.map((a) => (
//                 <option key={a._id} value={a._id}>
//                   {a.displayName}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Category */}
//           <div style={styles.row}>
//             <label style={styles.label}>Category:</label>
//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               style={styles.select}
//               required
//             >
//               <option value="">
//                 {categories.length === 0
//                   ? "No categories found"
//                   : "Select Category"}
//               </option>
//               {categories.map((c) => (
//                 <option key={c._id} value={c._id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Subcategory */}
//           {subcategories.length > 0 && (
//             <div style={styles.row}>
//               <label style={styles.label}>Subcategory:</label>
//               <select
//                 name="subcategory"
//                 value={formData.subcategory}
//                 onChange={handleChange}
//                 style={styles.select}
//               >
//                 <option value="">Select Subcategory (Optional)</option>
//                 {subcategories.map((s) => (
//                   <option key={s.slug} value={s.slug}>
//                     {s.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {/* Read Time */}
//           <div style={styles.row}>
//             <label style={styles.label}>Read Time (minutes):</label>
//             <input
//               type="number"
//               name="readTime"
//               value={formData.readTime}
//               onChange={handleChange}
//               placeholder="e.g., 3"
//               style={styles.input}
//               required
//             />
//           </div>

//           {/* Publish Date */}
//           <div style={styles.row}>
//             <label style={styles.label}>Publish Date:</label>
//             <input
//               type="date"
//               name="publishDate"
//               value={formData.publishDate}
//               onChange={handleChange}
//               style={styles.input}
//             />
//           </div>

//           {/* Status */}
//           <div style={styles.row}>
//             <label style={styles.label}>Status:</label>
//             <select
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               style={styles.select}
//             >
//               <option value="draft">Draft</option>
//               <option value="published">Published</option>
//               <option value="archived">Archived</option>
//             </select>
//           </div>
//         </div>

//         {/* Featured */}
//         <div style={styles.row}>
//           <label style={styles.checkboxLabel}>
//             <input
//               type="checkbox"
//               name="isFeatured"
//               checked={formData.isFeatured}
//               onChange={handleChange}
//               style={{width: "16px", height: "16px"}}
//             />
//             Mark as Featured
//           </label>
//         </div>

//         {/* Tags */}
//         <div style={styles.row}>
//           <label style={styles.label}>Tags:</label>
//           <div style={styles.tagContainer}>
//             {tags.length === 0 ? (
//               <p style={{ color: "#777", margin: 0 }}>No tags found</p>
//             ) : (
//               tags.map((tag) => (
//                 <button
//                   type="button"
//                   key={tag.slug}
//                   style={{
//                     ...styles.tag,
//                     backgroundColor: formData.tags.includes(tag.slug)
//                       ? "#1351d8"
//                       : "#e0e7ff",
//                     color: formData.tags.includes(tag.slug)
//                       ? "#fff"
//                       : "#1351d8",
//                   }}
//                   onClick={() => handleTagSelect(tag.slug)}
//                 >
//                   {tag.name}
//                 </button>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Image Upload */}
//         <div style={styles.row}>
//           <label style={styles.label}>Blog Image (Converts to Base64):</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageUpload}
//             style={styles.input}
//           />
//           {formData.imageUrl && (
//             <div style={{ marginTop: "10px" }}>
//               <img
//                 src={formData.imageUrl}
//                 alt="Preview"
//                 style={{
//                   width: "100%",
//                   maxWidth: "400px",
//                   height: "auto",
//                   objectFit: "cover",
//                   borderRadius: "8px",
//                   border: "1px solid #e5e7eb"
//                 }}
//               />
//             </div>
//           )}
//         </div>

//         {/* TinyMCE Editor */}
//         <div style={styles.row}>
//           <label style={styles.label}>Content:</label>
//           <Editor
//             apiKey="qr48oji4df7g73dr2ifrjpnuj91rb96tyed8yi8azeqwls0h" // Use your own API key in production
//             value={formData.content}
//             onEditorChange={(content) =>
//               setFormData((prev) => ({ ...prev, content }))
//             }
//             init={{
//               height: 400,
//               menubar: false,
//               plugins:
//                 "link image code lists table preview fullscreen media wordcount",
//               toolbar:
//                 "undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image media | code preview fullscreen",
//             }}
//           />
//         </div>

//         <button type="submit" style={{...styles.submitBtn, opacity: loading ? 0.7 : 1}} disabled={loading}>
//           {editingId ? "Update Blog Post" : "Create Blog Post"}
//         </button>
//       </form>

//       {/* Blog List */}
//       <div style={styles.blogList}>
//         <h2 style={styles.heading}>Existing Blogs</h2>
//         {loading ? (
//           <p>Loading...</p>
//         ) : blogs.length === 0 ? (
//           <p>No blogs found.</p>
//         ) : (
//           blogs.map((blog) => (
//             <div key={blog._id} style={styles.blogCard}>
//               <div style={styles.blogHeader}>
//                 <div>
//                   <h4 style={styles.blogTitle}>{blog.title}</h4>
//                   <p style={styles.blogMeta}>
//                     By {blog.author?.displayName || 'N/A'} in {blog.category?.name || 'N/A'} | {blog.readTime} min read | <span style={{fontWeight: "bold", color: blog.status === 'published' ? '#10b981' : '#6b7280'}}>{blog.status}</span>
//                   </p>
//                 </div>
//                 <div style={styles.btnGroup}>
//                   <button
//                     style={styles.editBtn}
//                     onClick={() => handleEdit(blog)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     style={styles.deleteBtn}
//                     onClick={() => handleDelete(blog._id)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";

export default function BlogManager() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    author: "",
    category: "",
    subcategory: "",
    tags: [],
    content: "",
    imageUrl: "",
    readTime: "",
    publishDate: "",
    isFeatured: false,
    status: "published",
  });

  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  // --- NEW: State to manage form visibility ---
  const [isFormVisible, setIsFormVisible] = useState(false);

  // ... (fetch functions remain the same) ...
  useEffect(() => {
    fetchAuthors();
    fetchCategories();
    fetchTags();
    fetchBlogs();
  }, []);

  const fetchAuthors = async () => {
    try {
      const res = await axios.get(
        "https://xarwiz-admin-backend.onrender.com/api/admin/authors"
      );
      setAuthors(res.data);
    } catch (err) {
      console.error("Error fetching authors:", err);
      setAuthors([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://xarwiz-admin-backend.onrender.com/api/blog/categories"
      );
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) {
      setSubcategories([]); // Clear subcategories if no category is selected
      return;
    }
    try {
      const res = await axios.get(
        `https://xarwiz-admin-backend.onrender.com/api/blog/categories/${categoryId}/subcategories`
      );
      setSubcategories(res.data);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setSubcategories([]);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await axios.get(
        "https://xarwiz-admin-backend.onrender.com/api/blog/tags"
      );
      setTags(res.data);
    } catch (err) {
      console.error("Error fetching tags:", err);
      setTags([]);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true); // Start loading
    try {
      const res = await axios.get(
        "https://xarwiz-admin-backend.onrender.com/api/blog/posts"
      );
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
    setLoading(false); // End loading
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    if (name === "category") {
      setFormData((prev) => ({ ...prev, subcategory: "" }));
      fetchSubcategories(value);
    }
  };

  const handleTagSelect = (tagSlug) => {
    setFormData((prev) => {
      const alreadySelected = prev.tags.includes(tagSlug);
      return {
        ...prev,
        tags: alreadySelected
          ? prev.tags.filter((s) => s !== tagSlug)
          : [...prev.tags, tagSlug],
      };
    });
  };

  // Store image as Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- NEW: Resets form and hides it ---
  const resetAndHideForm = () => {
    setFormData({
      title: "",
      slug: "",
      summary: "",
      author: "",
      category: "",
      subcategory: "",
      tags: [],
      content: "",
      imageUrl: "",
      readTime: "",
      publishDate: "",
      isFeatured: false,
      status: "published",
    });
    setEditingId(null);
    setSubcategories([]);
    setIsFormVisible(false); // Hide form
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      slug: formData.slug.toLowerCase().trim().replace(/\s+/g, "-"),
      summary: formData.summary,
      content: formData.content,
      imageUrl: formData.imageUrl, // Base64
      readTime: Number(formData.readTime),
      category: formData.category,
      subcategory: formData.subcategory || null,
      authorId: formData.author,
      tags: tags
        .filter((t) => formData.tags.includes(t.slug))
        .map((t) => ({ name: t.name, slug: t.slug })),
      isFeatured: formData.isFeatured,
      status: formData.status,
      publishDate: formData.publishDate || new Date().toISOString(),
    };

    try {
      if (editingId) {
        await axios.put(
          `https://xarwiz-admin-backend.onrender.com/api/admin/blog/posts/${editingId}`,
          payload
        );
        setMessage("✅ Blog post updated successfully!");
      } else {
        await axios.post(
          "https://xarwiz-admin-backend.onrender.com/api/admin/blog/posts",
          payload
        );
        setMessage("✅ Blog post created successfully!");
      }

      resetAndHideForm(); // --- CHANGED: Use new function
      fetchBlogs();

      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error("Error saving blog:", err.response?.data || err.message);
      setMessage("❌ Failed to save blog post.");
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setFormData({
      title: blog.title,
      slug: blog.slug || "",
      summary: blog.summary,
      author: blog.author?._id || "",
      category: blog.category?._id || "",
      subcategory: blog.subcategory || "",
      tags: blog.tags?.map((t) => t.slug) || [],
      content: blog.content,
      imageUrl: blog.imageUrl || "",
      readTime: blog.readTime,
      publishDate: blog.publishDate ? blog.publishDate.split("T")[0] : "",
      isFeatured: blog.isFeatured,
      status: blog.status,
    });
    fetchSubcategories(blog.category?._id);
    setIsFormVisible(true); // --- CHANGED: Show form on edit
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?"))
      return;

    setMessage("Deleting blog...");
    try {
      await axios.delete(
        `https://xarwiz-admin-backend.onrender.com/api/admin/blog/posts/${id}`
      );
      setMessage("🗑️ Blog deleted successfully!");
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
      setMessage("❌ Failed to delete blog.");
    }
    setTimeout(() => setMessage(""), 2500);
  };

  // --- (Styles updated below) ---
  const styles = {
    container: {
      padding: "1rem 2rem",
      maxWidth: "1400px", // Increased max-width for 3 columns
      margin: "auto",
      fontFamily: "'Inter', sans-serif",
    },
    // --- NEW: Header style ---
    pageHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
      flexWrap: "wrap",
      gap: "1rem",
    },
    heading: {
      margin: 0, // Reset margin
      color: "#1351d8",
      fontSize: "20px",
      fontWeight: "600",
    },
    // --- NEW: Style for the "+ New Blog" button ---
    newBlogBtn: {
      backgroundColor: "#1351d8",
      color: "#fff",
      border: "none",
      padding: "10px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "15px",
      fontWeight: "600",
      transition: "background-color 0.2s",
    },
    message: {
      padding: "10px 15px",
      borderRadius: "8px",
      marginBottom: "1.5rem",
      textAlign: "center",
      fontWeight: "500",
      backgroundColor: "#d1fae5",
      color: "#065f46",
    },
    errorMessage: {
      backgroundColor: "#fde2e2",
      color: "#b91c1c",
    },
    form: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      borderRadius: "12px",
      boxShadow: "0 6px 24px rgba(0,0,0,0.07)",
      padding: "1.5rem",
      marginBottom: "2.5rem", // Add space between form and list
    },
    row: {
      marginBottom: "1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    label: {
      fontWeight: "600",
      color: "#374151",
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
    select: {
      padding: "10px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      boxSizing: "border-box",
      width: "100%",
      fontFamily: "'Inter', sans-serif",
      backgroundColor: "#fff",
    },
    tagContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      marginTop: "5px",
      padding: "0.5rem",
      backgroundColor: "#f9fafb",
      borderRadius: "8px",
    },
    tag: {
      padding: "6px 12px",
      borderRadius: "20px",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      transition: "background-color 0.2s, color 0.2s",
    },
    // --- NEW: Container for form buttons ---
    formButtonContainer: {
      display: "flex",
      gap: "10px",
      marginTop: "1rem",
    },
    submitBtn: {
      backgroundColor: "#1351d8",
      color: "#fff",
      border: "none",
      padding: "12px 18px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
    },
    // --- NEW: Cancel button style ---
    cancelBtn: {
      backgroundColor: "#6b7280",
      color: "#fff",
      border: "none",
      padding: "12px 18px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
    },
    blogList: { marginTop: "2.5rem" },
    // --- NEW: Grid container for cards ---
    blogListContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "1.5rem",
    },
    // --- UPDATED: Blog card styles ---
    blogCard: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      padding: 0, // Padding will be inside content
      overflow: "hidden", // To contain image border radius
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between", // Pushes buttons to bottom
      height: "100%",
    },
    // --- NEW: Card image style ---
    cardImage: {
      width: "100%",
      height: "200px",
      objectFit: "cover",
    },
    // --- NEW: Card content wrapper ---
    blogCardContent: {
      padding: "1rem 1.5rem",
    },
    blogTitle: {
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#1f2937",
      margin: "0 0 0.5rem 0",
    },
    blogMeta: {
      fontSize: "0.9rem",
      color: "#6b7280",
      margin: 0,
    },
    // --- NEW: Card summary style with truncation ---
    blogSummary: {
      fontSize: "0.9rem",
      color: "#4b5563",
      lineHeight: "1.5",
      marginTop: "0.75rem",
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textOverflow: "ellipsis",
      minHeight: "63px", // 3 lines * 1.5 lineHeight * 14px fontSize
    },
    // --- NEW: Status badge style ---
    statusBadge: {
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: "600",
      textTransform: "capitalize",
      display: "inline-block",
      marginTop: "1rem",
    },
    // --- NEW: Card footer for buttons ---
    blogCardFooter: {
      display: "flex",
      gap: "8px",
      padding: "0 1.5rem 1.5rem 1.5rem",
    },
    editBtn: {
      background: "#10b981",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
    },
    deleteBtn: {
      background: "#dc2626",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
    },
    checkboxLabel: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "15px",
      fontWeight: "600",
      color: "#374151",
    },
  };


  
  return (
    <div style={styles.container}>
      {/* --- MODIFIED: Dynamic Header --- */}
      <div style={styles.pageHeader}>
        <h2 style={styles.heading}>
          {isFormVisible
            ? editingId
              ? "Edit Blog Post"
              : "Create New Blog Post"
            : "Blog Posts"}
        </h2>
        {!isFormVisible && (
          <button
            style={styles.newBlogBtn}
            onClick={() => {
              resetAndHideForm(); // Clear form state
              setIsFormVisible(true); // Show clean form
            }}
          >
            + New Blog
          </button>
        )}
      </div>

      {message && (
        <div
          style={{
            ...styles.message,
            ...(message.startsWith("❌") || message.startsWith("Failed")
              ? styles.errorMessage
              : {}),
          }}
        >
          {message}
        </div>
      )}

      {/* --- MODIFIED: Conditional Form --- */}
      {isFormVisible && (
        <form style={styles.form} onSubmit={handleSubmit}>
          {/* Title */}
          <div style={styles.row}>
            <label style={styles.label}>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              style={styles.input}
              required
            />
          </div>

          {/* Slug */}
          <div style={styles.row}>
            <label style={styles.label}>Slug:</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="e.g., my-awesome-post-slug"
              style={styles.input}
              required
            />
          </div>

          {/* Summary */}
          <div style={styles.row}>
            <label style={styles.label}>Summary:</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="Short blog summary (for card previews)"
              style={{ ...styles.input, height: "80px", resize: "vertical" }}
              required
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.25rem",
            }}
          >
            {/* Author */}
            <div style={styles.row}>
              <label style={styles.label}>Author:</label>
              <select
                name="author"
                value={formData.author}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value="">
                  {authors.length === 0 ? "No authors found" : "Select Author"}
                </option>
                {authors.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.displayName}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div style={styles.row}>
              <label style={styles.label}>Category:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value="">
                  {categories.length === 0
                    ? "No categories found"
                    : "Select Category"}
                </option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory (Conditionally rendered) */}
            <div style={styles.row}>
              <label style={styles.label}>Subcategory:</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                style={styles.select}
                disabled={subcategories.length === 0} // Disable if no subcategories
              >
                <option value="">
                  {subcategories.length === 0
                    ? "No subcategories for this category"
                    : "Select Subcategory (Optional)"}
                </option>
                {subcategories.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Read Time */}
            <div style={styles.row}>
              <label style={styles.label}>Read Time (minutes):</label>
              <input
                type="number"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                placeholder="e.g., 3"
                style={styles.input}
                required
              />
            </div>

            {/* Publish Date */}
            <div style={styles.row}>
              <label style={styles.label}>Publish Date:</label>
              <input
                type="date"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {/* Status */}
            <div style={styles.row}>
              <label style={styles.label}>Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Featured */}
          <div style={styles.row}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                style={{ width: "16px", height: "16px" }}
              />
              Mark as Featured
            </label>
          </div>

          {/* Tags */}
          <div style={styles.row}>
            <label style={styles.label}>Tags:</label>
            <div style={styles.tagContainer}>
              {tags.length === 0 ? (
                <p style={{ color: "#777", margin: 0 }}>No tags found</p>
              ) : (
                tags.map((tag) => (
                  <button
                    type="button"
                    key={tag.slug}
                    style={{
                      ...styles.tag,
                      backgroundColor: formData.tags.includes(tag.slug)
                        ? "#1351d8"
                        : "#e0e7ff",
                      color: formData.tags.includes(tag.slug)
                        ? "#fff"
                        : "#1351d8",
                    }}
                    onClick={() => handleTagSelect(tag.slug)}
                  >
                    {tag.name}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div style={styles.row}>
            <label style={styles.label}>
              Blog Image (Converts to Base64):
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={styles.input}
            />
            {formData.imageUrl && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    height: "auto",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
              </div>
            )}
          </div>

          {/* TinyMCE Editor */}
          <div style={styles.row}>
            <label style={styles.label}>Content:</label>
            <Editor
              apiKey="qr48oji4df7g73dr2ifrjpnuj91rb96tyed8yi8azeqwls0h" // Replace with your API key
              value={formData.content}
              onEditorChange={(content) =>
                setFormData((prev) => ({ ...prev, content }))
              }
              init={{
                height: 400,
                menubar: false,
                plugins:
                  "link image code lists table preview fullscreen media wordcount",
                toolbar:
                  "undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image media | code preview fullscreen",
              }}
            />
          </div>

          {/* --- MODIFIED: Form buttons --- */}
          <div style={styles.formButtonContainer}>
            <button
              type="submit"
              style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {editingId ? "Update Blog Post" : "Create Blog Post"}
            </button>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={resetAndHideForm} // Use new reset function
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* --- MODIFIED: Blog List as Cards --- */}
      <div style={styles.blogList}>
        {/* Heading moved to top */}
        {loading ? (
          <p>Loading...</p>
        ) : blogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          <div style={styles.blogListContainer}>
            {blogs.map((blog) => (
              <div key={blog._id} style={styles.blogCard}>
                {/* Top part: Image and Content */}
                <div>
                  <img
                    src={
                      blog.imageUrl ||
                      "https://via.placeholder.com/400x200?text=No+Image"
                    }
                    alt={blog.title}
                    style={styles.cardImage}
                  />
                  <div style={styles.blogCardContent}>
                    <h4 style={styles.blogTitle}>{blog.title}</h4>
                    <p style={styles.blogMeta}>
                      By {blog.author?.displayName || "N/A"} |{" "}
                      {blog.readTime} min read
                    </p>
                    <p style={styles.blogSummary}>{blog.summary}</p>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor:
                          blog.status === "published" ? "#d1fae5" : "#f3f4f6",
                        color:
                          blog.status === "published" ? "#065f46" : "#374151",
                      }}
                    >
                      {blog.status}
                    </span>
                  </div>
                </div>

                {/* Bottom part: Buttons */}
                <div style={styles.blogCardFooter}>
                  <button
                    style={styles.editBtn}
                    onClick={() => handleEdit(blog)}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(blog._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}