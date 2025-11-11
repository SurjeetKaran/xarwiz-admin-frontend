
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Editor } from "@tinymce/tinymce-react";

// export default function BlogManager() {
//   const [formData, setFormData] = useState({
//     title: "",
//     slug: "",
//     summary: "",
//     author: "", // This will be used by the admin
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
//   const [isFormVisible, setIsFormVisible] = useState(false);

//   // --- NEW: Add state for token and user ---
//   const [token, setToken] = useState(null);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // --- NEW: Get token and user from local storage ---
//     const storedToken = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");

//     if (storedToken && storedUser) {
//       setToken(storedToken);
//       setUser(JSON.parse(storedUser));
      
//       // Pass token to fetch functions
//       fetchAuthors(storedToken);
//       fetchCategories(storedToken);
//       fetchTags(storedToken);
//       fetchBlogs(storedToken); // Pass token to fetchBlogs as well
//     } else {
//       // Handle user not logged in
//       setMessage({ text: "You are not logged in.", type: "error" });
//       setLoading(false);
//     }
//   }, []);

//   // --- UPDATED: All fetch functions now use the token ---

//   const getAuthConfig = (authToken) => {
//     // Helper function to create auth headers
//     const currentToken = authToken || token;
//     if (!currentToken) return null;
//     return {
//       headers: {
//         Authorization: `Bearer ${currentToken}`
//       }
//     };
//   };

//   const fetchAuthors = async (authToken) => {
//     const config = getAuthConfig(authToken);
//     if (!config) return; // Don't fetch if no token

//     try {
//       const res = await axios.get(
//         "https://xarwiz-admin-backend.onrender.com/api/admin/authors",
//         config // --- ADDED CONFIG ---
//       );
//       setAuthors(res.data);
//     } catch (err) {
//       console.error("Error fetching authors:", err.response?.data?.message || err);
//       setAuthors([]);
//     }
//   };

//   const fetchCategories = async (authToken) => {
//     const config = getAuthConfig(authToken);
//     if (!config) return;

//     try {
//       const res = await axios.get(
//         "https://xarwiz-admin-backend.onrender.com/api/admin/categories", // Use the protected route
//         config // --- ADDED CONFIG ---
//       );
//       setCategories(res.data);
//     } catch (err) {
//       console.error("Error fetching categories:", err.response?.data?.message || err);
//       setCategories([]);
//     }
//   };

//   const fetchSubcategories = async (categoryId) => {
//     // This route is public, so no token is needed
//     if (!categoryId) {
//       setSubcategories([]);
//       return;
//     }
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

//   const fetchTags = async (authToken) => {
//     const config = getAuthConfig(authToken);
//     if (!config) return;

//     try {
//       const res = await axios.get(
//         "https://xarwiz-admin-backend.onrender.com/api/admin/tags", // Use the protected route
//         config // --- ADDED CONFIG ---
//       );
//       setTags(res.data);
//     } catch (err) {
//       console.error("Error fetching tags:", err.response?.data?.message || err);
//       setTags([]);
//     }
//   };

//   const fetchBlogs = async (authToken) => {
//     // NOTE: This hits the PUBLIC blog route.
//     // If you have a protected route to get *all* posts (including drafts),
//     // you should call that instead using the config.
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         "https://xarwiz-admin-backend.onrender.com/api/blog/posts"
//       );
//       setBlogs(res.data);
//     } catch (err) {
//       console.error("Error fetching blogs:", err);
//     }
//     setLoading(false);
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

//   const handleImageUpload = (e) => {
//     // ... (no changes needed here) ...
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const resetAndHideForm = () => {
//     // ... (no changes needed here) ...
//     setFormData({
//       title: "", slug: "", summary: "", author: "", category: "",
//       subcategory: "", tags: [], content: "", imageUrl: "",
//       readTime: "", publishDate: "", isFeatured: false, status: "published",
//     });
//     setEditingId(null);
//     setSubcategories([]);
//     setIsFormVisible(false);
//   };

//   // --- UPDATED: handleSubmit now sends token and checks role ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const config = getAuthConfig(); // Get auth config
//     if (!config) {
//       setMessage({ text: "You are not authorized. Please log in.", type: "error" });
//       return;
//     }

//     // --- UPDATED PAYLOAD LOGIC ---
//     const payload = {
//       title: formData.title,
//       slug: formData.slug.toLowerCase().trim().replace(/\s+/g, "-"),
//       summary: formData.summary,
//       content: formData.content,
//       imageUrl: formData.imageUrl,
//       readTime: Number(formData.readTime),
//       category: formData.category,
//       subcategory: formData.subcategory || null,
//       tags: tags
//         .filter((t) => formData.tags.includes(t.slug))
//         .map((t) => ({ name: t.name, slug: t.slug })),
//       isFeatured: formData.isFeatured,
//       status: formData.status,
//       publishDate: formData.publishDate || new Date().toISOString(),
//     };

//     // --- ROLE-BASED LOGIC ---
//     if (user.role === 'admin') {
//       // If admin, send the selected authorId
//       if (!formData.author) {
//          setMessage({ text: "Admin must select an author.", type: "error" });
//          return;
//       }
//       payload.authorId = formData.author;
//     }
//     // If user is 'author', we DON'T send authorId. 
//     // The backend's createPost controller will get it from the token.
    
//     try {
//       if (editingId) {
//         await axios.put(
//           `https://xarwiz-admin-backend.onrender.com/api/admin/blog/posts/${editingId}`,
//           payload,
//           config // --- ADDED CONFIG ---
//         );
//         setMessage("✅ Blog post updated successfully!");
//       } else {
//         await axios.post(
//           "https://xarwiz-admin-backend.onrender.com/api/admin/blog/posts",
//           payload,
//           config // --- ADDED CONFIG ---
//         );
//         setMessage("✅ Blog post created successfully!");
//       }

//       resetAndHideForm();
//       fetchBlogs(token); // Pass token

//       setTimeout(() => setMessage(""), 2500);
//     } catch (err) {
//       console.error("Error saving blog:", err.response?.data?.message || err.message);
//       setMessage(`❌ Failed to save blog: ${err.response?.data?.message || 'Server Error'}`);
//       setTimeout(() => setMessage(""), 2500);
//     }
//   };

//   const handleEdit = (blog) => {
//     setEditingId(blog._id);
//     setFormData({
//       title: blog.title,
//       slug: blog.slug || "",
//       summary: blog.summary,
//       author: blog.author?.id || blog.author?._id || "", // Use author.id for admin
//       category: blog.category?._id || "",
//       subcategory: blog.subcategory || "",
//       tags: blog.tags?.map((t) => t.slug) || [],
//       content: blog.content,
//       imageUrl: blog.imageUrl || "",
//       readTime: blog.readTime,
//       publishDate: blog.publishDate ? blog.publishDate.split("T")[0] : "",
//       isFeatured: blog.isFeatured,
//       status: blog.status,
//     });
//     fetchSubcategories(blog.category?._id);
//     setIsFormVisible(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // --- UPDATED: handleDelete now sends token ---
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this blog post?"))
//       return;

//     const config = getAuthConfig(); // Get auth config
//     if (!config) {
//       setMessage({ text: "You are not authorized. Please log in.", type: "error" });
//       return;
//     }

//     setMessage("Deleting blog...");
//     try {
//       await axios.delete(
//         `https://xarwiz-admin-backend.onrender.com/api/admin/blog/posts/${id}`,
//         config // --- ADDED CONFIG ---
//       );
//       setMessage("🗑️ Blog deleted successfully!");
//       fetchBlogs(token); // Pass token
//     } catch (err) {
//       console.error("Error deleting blog:", err.response?.data?.message || err);
//       setMessage(`❌ Failed to delete blog: ${err.response?.data?.message || 'Server Error'}`);
//     }
//     setTimeout(() => setMessage(""), 2500);
//   };

//   // --- (Styles remain the same) ---
//   const styles = {
//     container: {
//       padding: "1rem 2rem",
//       maxWidth: "1400px",
//       margin: "auto",
//       fontFamily: "'Inter', sans-serif",
//     },
//     pageHeader: {
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: "1.5rem",
//       flexWrap: "wrap",
//       gap: "1rem",
//     },
//     heading: {
//       margin: 0,
//       color: "#1351d8",
//       fontSize: "20px",
//       fontWeight: "600",
//     },
//     newBlogBtn: {
//       backgroundColor: "#1351d8",
//       color: "#fff",
//       border: "none",
//       padding: "10px 16px",
//       borderRadius: "8px",
//       cursor: "pointer",
//       fontSize: "15px",
//       fontWeight: "600",
//       transition: "background-color 0.2s",
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
//       marginBottom: "2.5rem",
//     },
//     row: {
//       marginBottom: "1.25rem",
//       display: "flex",
//       flexDirection: "column",
//       gap: "0.5rem",
//     },
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
//     formButtonContainer: {
//       display: "flex",
//       gap: "10px",
//       marginTop: "1rem",
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
//     cancelBtn: {
//       backgroundColor: "#6b7280",
//       color: "#fff",
//       border: "none",
//       padding: "12px 18px",
//       borderRadius: "8px",
//       cursor: "pointer",
//       fontSize: "16px",
//       fontWeight: "600",
//     },
//     blogList: { marginTop: "2.5rem" },
//     blogListContainer: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
//       gap: "1.5rem",
//     },
//     blogCard: {
//       backgroundColor: "rgba(255, 255, 255, 0.9)",
//       backdropFilter: "blur(10px)",
//       border: "1px solid rgba(255, 255, 255, 0.5)",
//       borderRadius: "12px",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//       padding: 0,
//       overflow: "hidden",
//       display: "flex",
//       flexDirection: "column",
//       justifyContent: "space-between",
//       height: "100%",
//     },
//     cardImage: {
//       width: "100%",
//       height: "200px",
//       objectFit: "cover",
//     },
//     blogCardContent: {
//       padding: "1rem 1.5rem",
//     },
//     blogTitle: {
//       fontSize: "1.2rem",
//       fontWeight: "600",
//       color: "#1f2937",
//       margin: "0 0 0.5rem 0",
//     },
//     blogMeta: {
//       fontSize: "0.9rem",
//       color: "#6b7280",
//       margin: 0,
//     },
//     blogSummary: {
//       fontSize: "0.9rem",
//       color: "#4b5563",
//       lineHeight: "1.5",
//       marginTop: "0.75rem",
//       display: "-webkit-box",
//       WebkitLineClamp: 3,
//       WebkitBoxOrient: "vertical",
//       overflow: "hidden",
//       textOverflow: "ellipsis",
//       minHeight: "63px",
//     },
//     statusBadge: {
//       padding: "4px 10px",
//       borderRadius: "20px",
//       fontSize: "0.8rem",
//       fontWeight: "600",
//       textTransform: "capitalize",
//       display: "inline-block",
//       marginTop: "1rem",
//     },
//     blogCardFooter: {
//       display: "flex",
//       gap: "8px",
//       padding: "0 1.5rem 1.5rem 1.5rem",
//     },
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
//     },
//   };

//   return (
//     <div style={styles.container}>
//       {/* ... (Header and Message JSX) ... */}
//        <div style={styles.pageHeader}>
//          <h2 style={styles.heading}>
//            {isFormVisible
//              ? editingId
//                ? "Edit Blog Post"
//                : "Create New Blog Post"
//              : "Blog Posts"}
//          </h2>
//          {!isFormVisible && (
//            <button
//              style={styles.newBlogBtn}
//              onClick={() => {
//                resetAndHideForm();
//                setIsFormVisible(true);
//              }}
//            >
//              + New Blog
//            </button>
//          )}
//        </div>
 
//        {message && (
//          <div
//            style={{
//              ...styles.message,
//              ...(message.startsWith("❌") || message.startsWith("Failed")
//                ? styles.errorMessage
//                : {}),
//            }}
//          >
//            {message}
//          </div>
//        )}
      
//       {isFormVisible && (
//         <form style={styles.form} onSubmit={handleSubmit}>
//           {/* ... (Title, Slug, Summary JSX) ... */}
//            <div style={styles.row}>
//              <label style={styles.label}>Title:</label>
//              <input
//                type="text" name="title" value={formData.title}
//                onChange={handleChange} placeholder="Enter blog title"
//                style={styles.input} required
//              />
//            </div>
//            <div style={styles.row}>
//              <label style={styles.label}>Slug:</label>
//              <input
//                type="text" name="slug" value={formData.slug}
//                onChange={handleChange} placeholder="e.g., my-awesome-post-slug"
//                style={styles.input} required
//              />
//            </div>
//            <div style={styles.row}>
//              <label style={styles.label}>Summary:</label>
//              <textarea
//                name="summary" value={formData.summary}
//                onChange={handleChange} placeholder="Short blog summary (for card previews)"
//                style={{ ...styles.input, height: "80px", resize: "vertical" }}
//                required
//              />
//            </div>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "1.25rem",
//             }}
//           >
//             {/* --- UPDATED: Conditional Author Dropdown --- */}
//             {user && user.role === 'admin' && (
//               <div style={styles.row}>
//                 <label style={styles.label}>Author:</label>
//                 <select
//                   name="author"
//                   value={formData.author}
//                   onChange={handleChange}
//                   style={styles.select}
//                   required
//                 >
//                   <option value="">
//                     {authors.length === 0 ? "No authors found" : "Select Author"}
//                   </option>
//                   {authors.map((a) => (
//                     <option key={a._id} value={a._id}>
//                       {a.displayName}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             {/* ... (Category, Subcategory, Read Time, Publish Date, Status JSX) ... */}
//              <div style={styles.row}>
//                <label style={styles.label}>Category:</label>
//                <select
//                  name="category" value={formData.category}
//                  onChange={handleChange} style={styles.select} required
//                >
//                  <option value="">
//                    {categories.length === 0
//                      ? "No categories found"
//                      : "Select Category"}
//                  </option>
//                  {categories.map((c) => (
//                    <option key={c._id} value={c._id}>
//                      {c.name}
//                    </option>
//                  ))}
//                </select>
//              </div>
 
//              <div style={styles.row}>
//                <label style={styles.label}>Subcategory:</label>
//                <select
//                  name="subcategory" value={formData.subcategory}
//                  onChange={handleChange} style={styles.select}
//                  disabled={subcategories.length === 0}
//                >
//                  <option value="">
//                    {subcategories.length === 0
//                      ? "No subcategories for this category"
//                      : "Select Subcategory (Optional)"}
//                  </option>
//                  {subcategories.map((s) => (
//                    <option key={s.slug} value={s.slug}>
//                      {s.name}
//                    </option>
//                  ))}
//                </select>
//              </div>
 
//              <div style={styles.row}>
//                <label style={styles.label}>Read Time (minutes):</label>
//                <input
//                  type="number" name="readTime" value={formData.readTime}
//                  onChange={handleChange} placeholder="e.g., 3"
//                  style={styles.input} required
//                />
//              </div>
 
//              <div style={styles.row}>
//                <label style={styles.label}>Publish Date:</label>
//                <input
//                  type="date" name="publishDate" value={formData.publishDate}
//                  onChange={handleChange} style={styles.input}
//                />
//              </div>
 
//              <div style={styles.row}>
//                <label style={styles.label}>Status:</label>
//                <select
//                  name="status" value={formData.status}
//                  onChange={handleChange} style={styles.select}
//                >
//                  <option value="draft">Draft</option>
//                  <option value="published">Published</option>
//                  <option value="archived">Archived</option>
//                </select>
//              </div>

//           </div>

//           {/* ... (Featured, Tags, Image Upload, TinyMCE, Buttons JSX) ... */}
//            <div style={styles.row}>
//              <label style={styles.checkboxLabel}>
//                <input
//                  type="checkbox" name="isFeatured"
//                  checked={formData.isFeatured} onChange={handleChange}
//                  style={{ width: "16px", height: "16px" }}
//                />
//                Mark as Featured
//              </label>
//            </div>
 
//            <div style={styles.row}>
//              <label style={styles.label}>Tags:</label>
//              <div style={styles.tagContainer}>
//                {tags.length === 0 ? (
//                  <p style={{ color: "#777", margin: 0 }}>No tags found</p>
//                ) : (
//                  tags.map((tag) => (
//                    <button
//                      type="button" key={tag.slug}
//                      style={{
//                        ...styles.tag,
//                        backgroundColor: formData.tags.includes(tag.slug)
//                          ? "#1351d8"
//                          : "#e0e7ff",
//                        color: formData.tags.includes(tag.slug)
//                          ? "#fff"
//                          : "#1351d8",
//                      }}
//                      onClick={() => handleTagSelect(tag.slug)}
//                    >
//                      {tag.name}
//                    </button>
//                  ))
//                )}
//              </div>
//            </div>
 
//            <div style={styles.row}>
//              <label style={styles.label}>
//                Blog Image (Converts to Base64):
//              </label>
//              <input
//                type="file" accept="image/*"
//                onChange={handleImageUpload} style={styles.input}
//              />
//              {formData.imageUrl && (
//                <div style={{ marginTop: "10px" }}>
//                  <img
//                    src={formData.imageUrl} alt="Preview"
//                    style={{
//                      width: "100%", maxWidth: "400px", height: "auto",
//                      objectFit: "cover", borderRadius: "8px",
//                      border: "1px solid #e5e7eb",
//                    }}
//                  />
//                </div>
//              )}
//            </div>
 
//            <div style={styles.row}>
//              <label style={styles.label}>Content:</label>
//              <Editor
//                apiKey="qr48oji4df7g73dr2ifrjpnuj91rb96tyed8yi8azeqwls0h" // Replace with your API key
//                value={formData.content}
//                onEditorChange={(content) =>
//                  setFormData((prev) => ({ ...prev, content }))
//                }
//                init={{
//                  height: 400,
//                  menubar: false,
//                  plugins:
//                    "link image code lists table preview fullscreen media wordcount",
//                  toolbar:
//                    "undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image media | code preview fullscreen",
//                }}
//              />
//            </div>
 
//            <div style={styles.formButtonContainer}>
//              <button
//                type="submit"
//                style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
//                disabled={loading}
//              >
//                {editingId ? "Update Blog Post" : "Create Blog Post"}
//              </button>
//              <button
//                type="button" style={styles.cancelBtn}
//                onClick={resetAndHideForm}
//              >
//                Cancel
//              </button>
//            </div>
//         </form>
//       )}

//       {/* ... (Blog List JSX) ... */}
//        <div style={styles.blogList}>
//          {loading ? (
//            <p>Loading...</p>
//          ) : blogs.length === 0 ? (
//            <p>No blogs found.</p>
//          ) : (
//            <div style={styles.blogListContainer}>
//              {blogs.map((blog) => (
//                <div key={blog._id} style={styles.blogCard}>
//                  <div>
//                    <img
//                      src={
//                        blog.imageUrl ||
//                        "https://via.placeholder.com/400x200?text=No+Image"
//                      }
//                      alt={blog.title}
//                      style={styles.cardImage}
//                    />
//                    <div style={styles.blogCardContent}>
//                      <h4 style={styles.blogTitle}>{blog.title}</h4>
//                      <p style={styles.blogMeta}>
//                        By {blog.author?.displayName || "N/A"} |{" "}
//                        {blog.readTime} min read
//                      </p>
//                      <p style={styles.blogSummary}>{blog.summary}</p>
//                      <span
//                        style={{
//                          ...styles.statusBadge,
//                          backgroundColor:
//                            blog.status === "published" ? "#d1fae5" : "#f3f4f6",
//                          color:
//                            blog.status === "published" ? "#065f46" : "#374151",
//                        }}
//                      >
//                        {blog.status}
//                      </span>
//                    </div>
//                  </div>
 
//                  <div style={styles.blogCardFooter}>
//                    <button
//                      style={styles.editBtn}
//                      onClick={() => handleEdit(blog)}
//                    >
//                      Edit
//                    </button>
//                    <button
//                      style={styles.deleteBtn}
//                      onClick={() => handleDelete(blog._id)}
//                    >
//                      Delete
//                    </button>
//                  </div>
//                </div>
//              ))}
//            </div>
//          )}
//        </div>
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
    author: "", // This will be used by the admin
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
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // --- UPDATED: First useEffect sets state ---
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      setMessage({ text: "You are not logged in.", type: "error" });
      setLoading(false);
    }
  }, []);

  // --- UPDATED: Second useEffect runs after state is set ---
  useEffect(() => {
    // This runs once token and user are confirmed
    if (token && user) {
      // Only admin needs the full author list for the dropdown
      if (user.role === 'admin') {
        fetchAuthors();
      }
      // Both roles need categories and tags for the form
      fetchCategories();
      fetchTags();
      // Fetch blogs based on role
      fetchBlogs();
    }
  }, [token, user]); // Dependency array

  
  const getAuthConfig = () => {
    // Helper function reads token from state
    if (!token) return null;
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchAuthors = async () => {
    const config = getAuthConfig();
    if (!config) return;

    try {
      const res = await axios.get(
        "https://xarwiz-admin-backend.onrender.com/api/admin/authors",
        config
      );
      setAuthors(res.data);
    } catch (err) {
      console.error("Error fetching authors:", err.response?.data?.message || err);
      setAuthors([]);
    }
  };

  const fetchCategories = async () => {
    const config = getAuthConfig();
    if (!config) return;

    try {
      const res = await axios.get(
        "https://xarwiz-admin-backend.onrender.com/api/admin/categories",
        config
      );
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err.response?.data?.message || err);
      setCategories([]);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) {
      setSubcategories([]);
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
    const config = getAuthConfig();
    if (!config) return;

    try {
      const res = await axios.get(
        "https://xarwiz-admin-backend.onrender.com/api/admin/tags",
        config
      );
      setTags(res.data);
    } catch (err) {
      console.error("Error fetching tags:", err.response?.data?.message || err);
      setTags([]);
    }
  };

  // --- UPDATED: fetchBlogs now uses the new author-specific route ---
  const fetchBlogs = async () => {
    if (!user) return; // Wait for user state

    setLoading(true);
    let apiUrl;

    if (user.role === 'author') {
      // Use the new public route for author-specific posts
      apiUrl = `https://xarwiz-admin-backend.onrender.com/api/blog/author/${user.id}/posts`;
    } else {
      // Admin uses the existing public route (fetches all published posts)
      apiUrl = "https://xarwiz-admin-backend.onrender.com/api/blog/posts";
      // Note: If you want admins to see drafts, you need a new protected GET route
    }
    
    try {
      // These routes are public, so no auth config is needed
      const res = await axios.get(apiUrl);
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    // ... (no changes needed) ...
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    if (name === "category") {
      setFormData((prev) => ({ ...prev, subcategory: "" }));
      fetchSubcategories(value);
    }
  };

  const handleTagSelect = (tagSlug) => {
    // ... (no changes needed) ...
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

  const handleImageUpload = (e) => {
    // ... (no changes needed) ...
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetAndHideForm = () => {
    // ... (no changes needed) ...
    setFormData({
      title: "", slug: "", summary: "", author: "", category: "",
      subcategory: "", tags: [], content: "", imageUrl: "",
      readTime: "", publishDate: "", isFeatured: false, status: "published",
    });
    setEditingId(null);
    setSubcategories([]);
    setIsFormVisible(false);
  };

  // --- This function is already correct and supports both roles ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const config = getAuthConfig();
    if (!config) {
      setMessage({ text: "You are not authorized. Please log in.", type: "error" });
      return;
    }

    const payload = {
      title: formData.title,
      slug: formData.slug.toLowerCase().trim().replace(/\s+/g, "-"),
      summary: formData.summary,
      content: formData.content,
      imageUrl: formData.imageUrl,
      readTime: Number(formData.readTime),
      category: formData.category,
      subcategory: formData.subcategory || null,
      tags: tags
        .filter((t) => formData.tags.includes(t.slug))
        .map((t) => ({ name: t.name, slug: t.slug })),
      isFeatured: formData.isFeatured,
      status: formData.status,
      publishDate: formData.publishDate || new Date().toISOString(),
    };

    if (user.role === 'admin') {
      if (!formData.author) {
         setMessage({ text: "Admin must select an author.", type: "error" });
         return;
      }
      payload.authorId = formData.author;
    }
    
    try {
      if (editingId) {
        await axios.put(
          `https://xarwiz-admin-backend.onrender.com/api/admin/blog/posts/${editingId}`,
          payload,
          config
        );
        setMessage("✅ Blog post updated successfully!");
      } else {
        await axios.post(
          "https://xarwiz-admin-backend.onrender.com/api/admin/blog/posts",
          payload,
          config
        );
        setMessage("✅ Blog post created successfully!");
      }

      resetAndHideForm();
      fetchBlogs(); // --- UPDATED: No longer needs token passed ---

      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error("Error saving blog:", err.response?.data?.message || err.message);
      setMessage(`❌ Failed to save blog: ${err.response?.data?.message || 'Server Error'}`);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleEdit = (blog) => {
    // ... (no changes needed) ...
    setEditingId(blog._id);
    setFormData({
      title: blog.title,
      slug: blog.slug || "",
      summary: blog.summary,
      author: blog.author?.id || blog.author?._id || "",
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
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    // ... (no changes needed, this is already correct) ...
    if (!window.confirm("Are you sure you want to delete this blog post?"))
      return;

    const config = getAuthConfig();
    if (!config) {
      setMessage({ text: "You are not authorized. Please log in.", type: "error" });
      return;
    }

    setMessage("Deleting blog...");
    try {
      await axios.delete(
        `https://xarwiz-admin-backend.onrender.com/api/admin/blog/posts/${id}`,
        config
      );
      setMessage("🗑️ Blog deleted successfully!");
      fetchBlogs(); // --- UPDATED: No longer needs token passed ---
    } catch (err) {
      console.error("Error deleting blog:", err.response?.data?.message || err);
      setMessage(`❌ Failed to delete blog: ${err.response?.data?.message || 'Server Error'}`);
    }
    setTimeout(() => setMessage(""), 2500);
  };

  // --- (Styles remain the same) ---
  const styles = {
    container: {
      padding: "1rem 2rem",
      maxWidth: "1400px",
      margin: "auto",
      fontFamily: "'Inter', sans-serif",
    },
    pageHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
      flexWrap: "wrap",
      gap: "1rem",
    },
    heading: {
      margin: 0,
      color: "#1351d8",
      fontSize: "20px",
      fontWeight: "600",
    },
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
      marginBottom: "2.5rem",
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
    blogListContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "1.5rem",
    },
    blogCard: {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      padding: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
    },
    cardImage: {
      width: "100%",
      height: "200px",
      objectFit: "cover",
    },
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
      minHeight: "63px",
    },
    statusBadge: {
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "0.8rem",
      fontWeight: "600",
      textTransform: "capitalize",
      display: "inline-block",
      marginTop: "1rem",
    },
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
      {/* ... (Header and Message JSX) ... */}
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
               resetAndHideForm();
               setIsFormVisible(true);
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
      
      {isFormVisible && (
        <form style={styles.form} onSubmit={handleSubmit}>
          {/* ... (Title, Slug, Summary JSX) ... */}
           <div style={styles.row}>
             <label style={styles.label}>Title:</label>
             <input
               type="text" name="title" value={formData.title}
               onChange={handleChange} placeholder="Enter blog title"
               style={styles.input} required
             />
           </div>
           <div style={styles.row}>
             <label style={styles.label}>Slug:</label>
             <input
               type="text" name="slug" value={formData.slug}
               onChange={handleChange} placeholder="e.g., my-awesome-post-slug"
               style={styles.input} required
             />
           </div>
           <div style={styles.row}>
             <label style={styles.label}>Summary:</label>
             <textarea
               name="summary" value={formData.summary}
               onChange={handleChange} placeholder="Short blog summary (for card previews)"
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
            {/* --- UPDATED: Conditional Author Display --- */}
            {user && user.role === 'admin' ? (
              // ADMIN VIEW: Show dropdown
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
            ) : user && (
              // AUTHOR VIEW: Show their name
              <div style={styles.row}>
                <label style={styles.label}>Author:</label>
                <input
                  type="text"
                  value={user.name || ''} // Get name from user state
                  readOnly
                  style={{...styles.input, backgroundColor: '#f9fafb', cursor: 'not-allowed'}}
                />
              </div>
            )}

            {/* ... (Category, Subcategory, Read Time, Publish Date, Status JSX) ... */}
             <div style={styles.row}>
               <label style={styles.label}>Category:</label>
               <select
                 name="category" value={formData.category}
                 onChange={handleChange} style={styles.select} required
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
 
             <div style={styles.row}>
               <label style={styles.label}>Subcategory:</label>
               <select
                 name="subcategory" value={formData.subcategory}
                 onChange={handleChange} style={styles.select}
                 disabled={subcategories.length === 0}
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
 
             <div style={styles.row}>
               <label style={styles.label}>Read Time (minutes):</label>
               <input
                 type="number" name="readTime" value={formData.readTime}
                 onChange={handleChange} placeholder="e.g., 3"
                 style={styles.input} required
               />
             </div>
 
             <div style={styles.row}>
               <label style={styles.label}>Publish Date:</label>
               <input
                 type="date" name="publishDate" value={formData.publishDate}
                 onChange={handleChange} style={styles.input}
               />
             </div>
 
             <div style={styles.row}>
               <label style={styles.label}>Status:</label>
               <select
                 name="status" value={formData.status}
                 onChange={handleChange} style={styles.select}
               >
                 <option value="draft">Draft</option>
                 <option value="published">Published</option>
                 <option value="archived">Archived</option>
               </select>
             </div>

          </div>

          {/* ... (Featured, Tags, Image Upload, TinyMCE, Buttons JSX) ... */}
           <div style={styles.row}>
             <label style={styles.checkboxLabel}>
               <input
                 type="checkbox" name="isFeatured"
                 checked={formData.isFeatured} onChange={handleChange}
                 style={{ width: "16px", height: "16px" }}
               />
               Mark as Featured
             </label>
           </div>
 
           <div style={styles.row}>
             <label style={styles.label}>Tags:</label>
             <div style={styles.tagContainer}>
               {tags.length === 0 ? (
                 <p style={{ color: "#777", margin: 0 }}>No tags found</p>
               ) : (
                 tags.map((tag) => (
                   <button
                     type="button" key={tag.slug}
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
 
           <div style={styles.row}>
             <label style={styles.label}>
               Blog Image (Converts to Base64):
             </label>
             <input
               type="file" accept="image/*"
               onChange={handleImageUpload} style={styles.input}
             />
             {formData.imageUrl && (
               <div style={{ marginTop: "10px" }}>
                 <img
                   src={formData.imageUrl} alt="Preview"
                   style={{
                     width: "100%", maxWidth: "400px", height: "auto",
                     objectFit: "cover", borderRadius: "8px",
                     border: "1px solid #e5e7eb",
                   }}
                 />
               </div>
             )}
           </div>
 
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
 
           <div style={styles.formButtonContainer}>
             <button
               type="submit"
               style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
               disabled={loading}
             >
               {editingId ? "Update Blog Post" : "Create Blog Post"}
             </button>
             <button
               type="button" style={styles.cancelBtn}
               onClick={resetAndHideForm}
             >
               Cancel
             </button>
           </div>
        </form>
      )}

      {/* ... (Blog List JSX) ... */}
       <div style={styles.blogList}>
         {loading ? (
           <p>Loading...</p>
         ) : blogs.length === 0 ? (
           <p>No blogs found.</p>
         ) : (
           <div style={styles.blogListContainer}>
             {blogs.map((blog) => (
               <div key={blog._id} style={styles.blogCard}>
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