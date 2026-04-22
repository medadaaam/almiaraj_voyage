import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLink() {
  const { authenticated, user } = useAuth();

  if (!authenticated) return null;

  return (
    <NavLink
      to={user?.role === "admin" ? "/admin" : "/client"}
    >
        {
            user.role === "admin" ? <span className="btn-outline">Dashboard</span>:<span className="btn-outline">Mon compte</span>
        }

    </NavLink>
  );
}
