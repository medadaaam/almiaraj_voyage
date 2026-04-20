import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLink from "@/pages/dashboardLink";
import { LOGIN_ROUTE } from "@/router";

export default function Header() {
  const { authenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showSticky, setShowSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileMenuOpen]);

  const logoutCallback = async () => {
    await logout();
    navigate(LOGIN_ROUTE);
  };

  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/services", label: "Services" },
    { to: "/about", label: "À propos" },
    { to: "/contact", label: "Contact" },
  ];

  const socialLinks = [
    { icon: "fa-brands fa-whatsapp", href: "https://wa.me/212535657979" },
    { icon: "fa-brands fa-instagram", href: "#" },
    { icon: "fa-brands fa-tiktok", href: "#" },
    { icon: "fa-brands fa-x-twitter", href: "#" },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container mx-auto flex items-center justify-between px-6 py-2">
          <div className="flex items-center gap-6">
            <a href="mailto:almiarajvoyage.fes@gmail.com" className="contact-link group">
              <i className="fa-solid fa-envelope text-sm"></i>
              <span>almiarajvoyage.fes@gmail.com</span>
            </a>
            <a href="tel:+212535657979" className="contact-link group">
              <i className="fa-solid fa-phone text-sm"></i>
              <span>05 35 65 79 79</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <i className={social.icon}></i>
              </a>
            ))}
          </div>

          <button style={{ width:"300px" }} className="custom-btn">
            Personnaliser un voyage →
          </button>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/" className="logo">
            <img src="/images/logo.png" alt="Almiraj Voyage" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <ul>
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className="nav-link">
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <select className="lang-select">
                  <option value="ar">العربية</option>
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </li>
            </ul>
          </nav>

          {/* Auth Buttons Desktop */}
          <div className="auth-buttons">
            {!authenticated ? (
              <>
                <NavLink to="/register" className="btn-outline">
                  S'inscrire
                </NavLink>
                <NavLink to="/login" className="btn-primary">
                  Se connecter
                </NavLink>
              </>
            ) : (
              <>
                <DashboardLink />
                <button onClick={logoutCallback} className="btn-outline">
                  Déconnexion
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="mobile-menu-btn"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <button onClick={() => setMobileMenuOpen(false)} className="close-btn">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mobile-nav">
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className="mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="mobile-auth-section">
              {!authenticated ? (
                <>
                  <NavLink to="/register" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    S'inscrire
                  </NavLink>
                  <NavLink to="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Se connecter
                  </NavLink>
                </>
              ) : (
                <>
                  <DashboardLink />
                  <button
                    onClick={() => {
                      logoutCallback();
                      setMobileMenuOpen(false);
                    }}
                    className="mobile-nav-link text-left"
                  >
                    Déconnexion
                  </button>
                </>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Sticky Header */}
      <div className={`sticky-header ${showSticky ? 'visible' : ''}`}>
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          <Link to="/" className="sticky-logo">
            <img src="/images/logo.png" alt="Almiraj Voyage" />
          </Link>

          <div className="sticky-nav">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className="sticky-nav-link">
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="sticky-auth">
            {!authenticated ? (
              <>
                <NavLink to="/register" className="btn-outline-sm">
                  S'inscrire
                </NavLink>
                <NavLink to="/login" className="btn-primary-sm">
                  Se connecter
                </NavLink>
              </>
            ) : (
              <button onClick={logoutCallback} className="btn-primary-sm">
                Déconnexion
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
