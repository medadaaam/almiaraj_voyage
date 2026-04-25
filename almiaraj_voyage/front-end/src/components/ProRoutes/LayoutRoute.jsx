import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingPage from "@/pages/LoadingPage";

export default function GuestRoute({ children }) {
  const { authenticated, initialLoading } = useAuth(); // ✅ استخدم initialLoading
  const location = useLocation();

  if (initialLoading) {
    return <LoadingPage />;
  }

  const allowedPaths = ["/reset-password", "/forgot-password", "/password-reset"];
  const isAllowedPath = allowedPaths.some(path => location.pathname.includes(path));

  if (authenticated && !isAllowedPath) {
    return <Navigate to="/" />;
  }

  return children;
}