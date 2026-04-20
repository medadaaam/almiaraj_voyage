import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./layout.css";
import { useAuth } from "@/context/AuthContext";
import { LOGIN_ROUTE } from "@/router";
import Footer from "@/pages/footer";
import { useState, useEffect } from "react";

export default function Layout() {
  const { authenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [showSticky, setShowSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoutCallback = async () => {
    await logout();
    navigate(LOGIN_ROUTE);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Top Bar */}
      <div className={`top-bar-fixed ${showSticky ? "top-bar-hidden" : ""}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">
          <div className="flex items-center gap-6">
            <a href="mailto:almiarajvoyage.fes@gmail.com" className="group flex items-center gap-2 transition duration-300">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#fb923c] transition duration-300">
                <i className="fa-solid fa-envelope text-sm group-hover:text-white"></i>
              </span>
              <span className="relative text-white group-hover:text-[#fb923c] transition duration-300">
                almiarajvoyage.fes@gmail.com
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#fb923c] group-hover:w-full transition-all duration-300"></span>
              </span>
            </a>
            <a href="tel:+212535657979" className="group flex items-center gap-2 transition duration-300">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#fb923c] transition duration-300">
                <i className="fa-solid fa-phone text-sm group-hover:text-white"></i>
              </span>
              <span className="relative text-white group-hover:text-[#fb923c] transition duration-300">
                05 35 65 79 79
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#fb923c] group-hover:w-full transition-all duration-300"></span>
              </span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#fb923c] transition duration-500 cursor-pointer hover:scale-110">
              <i className="fa-brands fa-whatsapp text-white text-sm"></i>
            </div>
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#fb923c] transition duration-500 cursor-pointer hover:scale-110">
              <i className="fa-brands fa-instagram text-white text-sm"></i>
            </div>
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#fb923c] transition duration-300 cursor-pointer hover:scale-110">
              <i className="fa-brands fa-tiktok text-white text-sm"></i>
            </div>
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#fb923c] transition duration-300 cursor-pointer hover:scale-110">
              <i className="fa-brands fa-x-twitter text-white text-sm"></i>
            </div>
          </div>
          <button className="bg-[#fb923c] text-white px-4 py-1 rounded-md font-medium hover:bg-orange-600 transition">
            Personnaliser un voyage →
          </button>
        </div>
      </div>

      {/* Main Header */}
      <header className={`main-header ${showSticky ? "main-header-hidden" : ""}`}>
        <div className="max-w-7xl mx-auto header-container px-6 py-4">
          <div className="logo-container">
            <a href="/">
              <img src="/images/logo.png" alt="logo" className="h-14" />
            </a>
          </div>
          <div className="nav-container">
            <nav>
              <ul className="flex gap-6">
                <li><NavLink to="/" className="aa">Accueil</NavLink></li>
                <li><NavLink to="/services" className="aa">Services</NavLink></li>
                <li><NavLink to="/about" className="aa">À propos</NavLink></li>
                <li><NavLink to="/contact" className="aa">Contact</NavLink></li>
                <li>
                  <select className="lang-select">
                    <option value="ar">العربية</option>
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </li>
              </ul>
            </nav>
          </div>
          <div className="auth-container">
            <nav>
              <ul className="flex gap-4">
                {!authenticated ? (
                  <>
                    <li><NavLink to="/register" className="btn-outline">S'inscrire</NavLink></li>
                    <li><NavLink to="/login" className="btn-primary">Se connecter</NavLink></li>
                  </>
                ) : (
                  <li>
                    <button onClick={logoutCallback} className="btn-outline">Logout</button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)} />

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <a href="/" className="mobile-logo" onClick={() => setMobileMenuOpen(false)}>
            <img src="/images/logo.png" alt="logo" />
          </a>
          <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mobile-nav">
          <ul>
            <li><NavLink to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Accueil</NavLink></li>
            <li><NavLink to="/services" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Services</NavLink></li>
            <li><NavLink to="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>À propos</NavLink></li>
            <li><NavLink to="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</NavLink></li>
            <li className="mobile-lang-item">
              <select className="mobile-lang-select">
                <option value="ar">العربية</option>
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </li>
            <li className="mobile-auth-section">
              {!authenticated ? (
                <>
                  <NavLink to="/register" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>S'inscrire</NavLink>
                  <NavLink to="/login" className="mobile-nav-link btn-mobile-primary" onClick={() => setMobileMenuOpen(false)}>Se connecter</NavLink>
                </>
              ) : (
                <button onClick={() => { logoutCallback(); setMobileMenuOpen(false); }} className="mobile-nav-link">
                  Logout
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Sticky Header */}
      <div className={`sticky-header ${showSticky ? "visible" : ""}`}>
        <div className="max-w-7xl mx-auto header-container px-6 py-3">
          <div className="logo-container">
            <a href="/">
              <img src="/images/logo.png" alt="logo" className="h-10" />
            </a>
          </div>
          <div className="nav-container">
            <div className="flex gap-6">
              <NavLink to="/" className="aa text-sm">Accueil</NavLink>
              <NavLink to="/services" className="aa text-sm">Services</NavLink>
              <NavLink to="/about" className="aa text-sm">À propos</NavLink>
              <NavLink to="/contact" className="aa text-sm">Contact</NavLink>
            </div>
          </div>
          <div className="auth-container">
            {!authenticated ? (
              <>
                <NavLink to="/register" className="btn-outline-sm">S'inscrire</NavLink>
                <NavLink to="/login" className="btn-primary-sm">Se connecter</NavLink>
              </>
            ) : (
              <button onClick={logoutCallback} className="btn-outline-sm">Logout</button>
            )}
          </div>
          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
