import { useAuth } from "@/context/AuthContext";

export default function LayoutRoute({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  return children;
}
