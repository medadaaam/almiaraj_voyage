import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LOGIN_ROUTE } from "@/router";
import LoadingPage from "@/pages/LoadingPage";

export default function ProtectedRoute({ children, role }) {
  const { authenticated, loading, user } = useAuth();

  if (loading) return <LoadingPage />;

  if (!authenticated) {
    return <Navigate to={LOGIN_ROUTE} />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}
