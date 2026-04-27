import { useAuth } from "@/context/AuthContext";
import LoadingPage from "@/pages/LoadingPage";

export default function GuestRoute({ children }) {
  const { initialLoading } = useAuth();

  if (initialLoading) {
    return <LoadingPage />;
  }


  return children;
}
