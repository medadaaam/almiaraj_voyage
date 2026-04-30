import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Hotel,
  Plane,
  Ticket,
  ChartNoAxesCombined,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Bell,
  Search,
  Moon,
  Sun,
  User,
  Settings,
  HelpCircle,
  Star,
  MessageCircle,
  Globe,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import "./adminLayout.css";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();
  const { logout, user } = useAuth();



  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin/dashboard') return 'Dashboard';
    if (path === '/admin/users') return 'Utilisateurs';
    if (path === '/admin/reservations') return 'Réservations';
    if (path === '/admin/destinations') return 'Destinations';
    if (path === '/admin/voyages') return 'Voyages';
    if (path === '/admin/hotels') return 'Hôtels';
    if (path === '/admin/hajj-omras') return 'Hajj & Omra';
    if (path === '/admin/billets') return 'Billets';
    return 'Administration';
  };

  const navItems = [
    { path: "/admin/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/admin/reservations", icon: <Calendar size={20} />, label: "Réservations", badge: notifications },
    { path: "/admin/users", icon: <Users size={20} />, label: "Clients" },
    { path: "/admin/destinations", icon: <Globe size={20} />, label: "Destinations" },
    { path: "/admin/voyages", icon: <Plane size={20} />, label: "Voyages" },
    { path: "/admin/hotels", icon: <Hotel size={20} />, label: "Hôtels" },
    { path: "/admin/hajj-omras", icon: <ChartNoAxesCombined size={20} />, label: "Hajj & Omra" },
    { path: "/admin/billets", icon: <Ticket size={20} />, label: "Billets" },
  ];

  return (
    <div className={`admin-layout ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'} ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={toggleMobileMenu}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${!sidebarOpen ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <img src="/images/logo.png" alt="Almiaraj" className="logo-img" />
            {sidebarOpen && <span className="logo-text">Almiaraj</span>}
          </div>
          {sidebarOpen && (
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              <ChevronRight size={20} />
            </button>
          )}
          {!sidebarOpen && (
            <button className="sidebar-toggle collapsed" onClick={toggleSidebar}>
              <Menu size={20} />
            </button>
          )}
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'A'}
          </div>
          {sidebarOpen && (
            <div className="user-info">
              <p className="user-name">{user?.name || 'Administrateur'}</p>
              <p className="user-role">Administrateur</p>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link-admin ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
              {sidebarOpen && item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="footer-btn" onClick={logout}>
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
              <Menu size={24} />
            </button>
            <h1 className="page-title">{getPageTitle()}</h1>
          </div>

          {/* <li>
            <NavLink to="/admin/avis">
              <Star size={20} />
              <span>Avis</span>
            </NavLink>
          </li> */}
          <li>
            <NavLink to="/admin/messages">
              <MessageCircle size={20} />
              <span>Messages</span>
            </NavLink>
          </li>

          <div className="topbar-right">

            <div className="notifications">
              <button className="notif-btn">
                <Bell size={20} />
                {notifications > 0 && <span className="notif-badge">{notifications}</span>}
              </button>
            </div>

            <div className="user-dropdown">
              <button className="user-btn">
                <div className="user-avatar-small">
                  {user?.name?.charAt(0) || 'A'}
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}