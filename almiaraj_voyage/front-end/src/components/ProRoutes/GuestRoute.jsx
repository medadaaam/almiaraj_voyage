import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function GuestRoute({ children }) {
  const { authenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // ✅ السماح لصفحات reset-password و forgot-password حتى لو كان المستخدم مسجل
  const allowedPaths = ["/reset-password", "/forgot-password", "/password-reset"];
  const isAllowedPath = allowedPaths.some(path => location.pathname.includes(path));

  if (authenticated && !isAllowedPath) {
    return <Navigate to="/" />;
  }

  return children;
}
