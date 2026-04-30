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
    if (path === '/admin/avis') return 'Avis';
    if (path === '/admin/messages') return 'Messages';
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
    { path: "/admin/avis", icon: <Star size={20} />, label: "Avis" },
    { path: "/admin/messages", icon: <MessageCircle size={20} />, label: "Messages" },
  ];

  return (
    <div className={`admin-layout ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'} ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="admin-mobile-overlay" onClick={toggleMobileMenu}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${!sidebarOpen ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo-container">
            <img src="/images/logo.png" alt="Almiaraj" className="admin-logo-img" />
            {sidebarOpen && <span className="admin-logo-text">Almiaraj</span>}
          </div>
          {sidebarOpen && (
            <button className="admin-sidebar-toggle" onClick={toggleSidebar}>
              <ChevronRight size={20} />
            </button>
          )}
          {!sidebarOpen && (
            <button className="admin-sidebar-toggle collapsed" onClick={toggleSidebar}>
              <Menu size={20} />
            </button>
          )}
        </div>

        <div className="admin-sidebar-user">
          <div className="admin-user-avatar">
            {user?.name?.charAt(0) || 'A'}
          </div>
          {sidebarOpen && (
            <div className="admin-user-info">
              <p className="admin-user-name">{user?.name || 'Administrateur'}</p>
              <p className="admin-user-role">Administrateur</p>
            </div>
          )}
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="admin-nav-label">{item.label}</span>}
              {sidebarOpen && item.badge && (
                <span className="admin-nav-badge">{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-footer-btn" onClick={logout}>
            <LogOut size={20} />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-mobile-menu-btn" onClick={toggleMobileMenu}>
              <Menu size={24} />
            </button>
            <h1 className="admin-page-title">{getPageTitle()}</h1>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-notifications">
              <button className="admin-notif-btn">
                <Bell size={20} />
                {notifications > 0 && <span className="admin-notif-badge">{notifications}</span>}
              </button>
            </div>

            <div className="admin-user-dropdown">
              <button className="admin-user-btn">
                <div className="admin-user-avatar-small">
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