import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading user profile...</div>;
  }

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
