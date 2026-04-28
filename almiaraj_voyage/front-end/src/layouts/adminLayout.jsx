import { NavLink, Outlet } from "react-router-dom";
import "./adminLayout.css";

export default function AdminLayout() {
    // Add a console log to verify the component is loading
    console.log("AdminLayout is rendering");

    return (
        <div className="admin-container">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src="/images/logo.png" alt="logo" className="logo-img" />
                    <h2 className="logo-text">Admin Panel</h2>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <NavLink to="/admin" end>Dashboard</NavLink>
                        </li>
                        <li className="nav-title">Gestion</li>
                        <li>
                            <NavLink to="/admin/users">Utilisateurs</NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/reservations">Réservations</NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/voyages">Voyages</NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/hotels">Hôtels</NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/hajj-omras">Hajj & Omra</NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/billets">Billets</NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* CONTENT */}
            <div className="main-content">
                <header className="topbar">
                    <h1>Dashboard Admin</h1>
                </header>
                <div className="content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}