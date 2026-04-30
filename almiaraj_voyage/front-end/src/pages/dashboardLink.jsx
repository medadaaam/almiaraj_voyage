import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLink() {
  const { authenticated, user } = useAuth();

  if (!authenticated) return null;

  return (
    <NavLink
      to={user?.role === "admin" ? "/admin/dashboard" : "/client"}
    >
        {
            user.role === "admin" ? <span>Dashboard</span>:<span>Mon compte</span>
        }

    </NavLink>
  );
}
