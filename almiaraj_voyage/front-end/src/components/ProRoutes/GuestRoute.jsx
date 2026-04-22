import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingPage from "@/pages/LoadingPage";

export default function GuestRoute({ children }) {
  const { authenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingPage />;
  }

  // ✅ السماح لصفحات reset-password و forgot-password حتى لو كان المستخدم مسجل
  const allowedPaths = ["/reset-password", "/forgot-password", "/password-reset"];
  const isAllowedPath = allowedPaths.some(path => location.pathname.includes(path));

  if (authenticated && !isAllowedPath) {
    return <Navigate to="/" />;
  }

  return children;
}
