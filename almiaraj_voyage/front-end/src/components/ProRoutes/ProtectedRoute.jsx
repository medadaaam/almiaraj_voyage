import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LOGIN_ROUTE } from "@/router";

export default function ProtectedRoute({ children }) {
  const { authenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }


  // if (!authenticated) {
  //   return <Navigate to={LOGIN_ROUTE} />;
  // }

  return children;
}
