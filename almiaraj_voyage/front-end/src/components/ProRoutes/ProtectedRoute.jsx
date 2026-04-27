import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LOGIN_ROUTE } from "@/router";
import LoadingPage from "@/pages/LoadingPage";

export default function ProtectedRoute({ children, role }) {
  const { authenticated, initialLoading, user } = useAuth();

  if (initialLoading) return <LoadingPage />;

  if (!authenticated) {
    return <Navigate to={LOGIN_ROUTE} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
