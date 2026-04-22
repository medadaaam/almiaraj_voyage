import { useAuth } from "@/context/AuthContext";
import LoadingPage from "@/pages/LoadingPage";

export default function LayoutRoute({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }
  return children;
}
