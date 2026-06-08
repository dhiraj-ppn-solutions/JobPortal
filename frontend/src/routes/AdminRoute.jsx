import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { token, user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role !== "admin") {
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
