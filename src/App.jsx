import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";

// 🔒 Protected Route Wrapper
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/adminlogin" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/adminlogin" element={<AdminLogin />} />

        {/* Protected Admin Panel */}
        <Route
          path="/adminpanel"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Default redirect (root → login) */}
        <Route path="*" element={<Navigate to="/adminlogin" replace />} />
      </Routes>
    </Router>
  );
}





