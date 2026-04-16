import { NavLink, Outlet } from "react-router-dom";
import "./adminLayout.css";

export default function AdminLayout() {
    return (
        <div className="admin-container">

            {/* SIDEBAR */}
            <aside className="sidebar">
                <h2 className="logo">Admin</h2>
                        <a href="/">
                            <img src="/images/logo.png" alt="logo" />
                        </a>

                <nav>
                    <ul>
                        <li><NavLink to="/admin" end>Dashboard</NavLink></li>

                        <li className="title">Gestion</li>

                        <li><NavLink to="/admin/users">Utilisateurs</NavLink></li>
                        <li><NavLink to="/admin/reservations">Réservations</NavLink></li>

                        <li className="title">Services</li>

                        <li><NavLink to="/admin/voyages">Voyages</NavLink></li>
                        <li><NavLink to="/admin/hotels">Hôtels</NavLink></li>
                        <li><NavLink to="/admin/hajj-omra">Hajj & Omra</NavLink></li>
                        <li><NavLink to="/admin/billets">Billets</NavLink></li>
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