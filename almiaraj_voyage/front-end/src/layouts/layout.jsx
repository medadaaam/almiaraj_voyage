import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./layout.css";
import { useAuth } from "@/context/AuthContext";
import { LOGIN_ROUTE } from "@/router";
import Footer from "@/pages/footer";
import { useState, useEffect, useRef } from "react";

export default function Layout() {
  const { authenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [showSticky, setShowSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [stickyServicesOpen, setStickyServicesOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [stickyLangOpen, setStickyLangOpen] = useState(false);
  const servicesTimeout = useRef(null);
  const stickyServicesTimeout = useRef(null);
  const langTimeout = useRef(null);
  const stickyLangTimeout = useRef(null);

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

  // Main header services handlers
  const handleServicesMouseEnter = () => {
    if (servicesTimeout.current) clearTimeout(servicesTimeout.current);
    setServicesOpen(true);
  };

  const handleServicesMouseLeave = () => {
    servicesTimeout.current = setTimeout(() => {
      setServicesOpen(false);
    }, 200);
  };

  // Sticky header services handlers
  const handleStickyServicesMouseEnter = () => {
    if (stickyServicesTimeout.current)
      clearTimeout(stickyServicesTimeout.current);
    setStickyServicesOpen(true);
  };

  const handleStickyServicesMouseLeave = () => {
    stickyServicesTimeout.current = setTimeout(() => {
      setStickyServicesOpen(false);
    }, 200);
  };

  // Language handlers
  const handleLangMouseEnter = () => {
    if (langTimeout.current) clearTimeout(langTimeout.current);
    setLangOpen(true);
  };

  const handleLangMouseLeave = () => {
    langTimeout.current = setTimeout(() => {
      setLangOpen(false);
    }, 200);
  };

  const handleStickyLangMouseEnter = () => {
    if (stickyLangTimeout.current) clearTimeout(stickyLangTimeout.current);
    setStickyLangOpen(true);
  };

  const handleStickyLangMouseLeave = () => {
    stickyLangTimeout.current = setTimeout(() => {
      setStickyLangOpen(false);
    }, 200);
  };

  const services = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
          />
        </svg>
      ),
      title: "Vols & billets",
      desc: "Réservez facilement vos billets d'avion aux meilleurs prix avec notre assistance complète.",
      link: "/services/flights",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 512 512">
          {" "}
          <path d="M0 32C0 14.3 14.3 0 32 0L480 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 384c17.7 0 32 14.3 32 32s-14.3 32-32 32l-176 0 0-48c0-26.5-21.5-48-48-48s-48 21.5-48 48l0 48L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32L32 64C14.3 64 0 49.7 0 32z" />
        </svg>
      ),
      title: "Hôtels & séjours",
      desc: "Profitez d'un large choix d'hôtels et d'hébergements adaptés à tous les budgets.",
      link: "/services/hotels",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeWidth={1.5} d="M12 2l4 7h-8l4-7zm0 20v-6" />
        </svg>
      ),
      title: "Circuits touristiques",
      desc: "Découvrez des destinations uniques à travers des circuits organisés et inoubliables.",
      link: "/services/tours",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="8" r="3" strokeWidth={1.5} />
          <path strokeWidth={1.5} d="M6 20c0-3 3-5 6-5s6 2 6 5" />
        </svg>
      ),
      title: "Voyages sur mesure",
      desc: "Créez votre voyage personnalisé selon vos envies et votre budget.",
      link: "/services/custom",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      title: "Hajj & Omra",
      desc: "Organisez votre pèlerinage dans les meilleures conditions avec un accompagnement complet.",
      link: "/services/hajj-omra",
    },
  ];

  const languages = [
    { code: "fr", name: "Français", flag: "https://flagcdn.com/w20/fr.png" },
    { code: "en", name: "English", flag: "https://flagcdn.com/w20/us.png" },
    { code: "ar", name: "العربية", flag: "https://flagcdn.com/w20/sa.png" },
  ];

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Destinations", path: "/destinations" },
    { name: "À propos", path: "/about" },
    { name: "Contactez-nous", path: "/contact" },
  ];

  // Mega menu component
  const MegaMenu = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />

        {/* Menu */}
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl bg-white rounded-xl shadow-2xl border border-gray-100 z-50">

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-6">
            {services.map((service, index) => (
              <a
                key={index}
                href={service.link}
                className="block p-4 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="mb-3 text-[#fb923c]">
                  {service.icon}
                </div>

                <h4 className="font-semibold text-gray-800 text-sm mb-1">
                  {service.title}
                </h4>

                <p className="text-xs text-gray-500 leading-relaxed">
                  {service.desc}
                </p>
              </a>
            ))}
          </div>

        </div>
      </>
    );
  };

  return (
    <>
      {/* Top Bar */}
      <div className={`top-bar-fixed ${showSticky ? "top-bar-hidden" : ""}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">
          <div className="flex items-center gap-6">
            <a
              href="mailto:almiarajvoyage.fes@gmail.com"
              className="group flex items-center gap-2 transition duration-300"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#fb923c] transition duration-300">
                <i className="fa-solid fa-envelope text-sm group-hover:text-white"></i>
              </span>
              <span className="relative text-white group-hover:text-[#fb923c] transition duration-300 text-sm">
                almiarajvoyage.fes@gmail.com
              </span>
            </a>
            <a
              href="tel:+212535657979"
              className="group flex items-center gap-2 transition duration-300"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#fb923c] transition duration-300">
                <i className="fa-solid fa-phone text-sm group-hover:text-white"></i>
              </span>
              <span className="relative text-white group-hover:text-[#fb923c] transition duration-300 text-sm">
                05 35 65 79 79
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
          <button className="bg-[#fb923c] text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-orange-600 transition">
            Personnaliser un voyage →
          </button>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`main-header ${showSticky ? "main-header-hidden" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="he flex items-center justify-between">
            {/* Logo - Left */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center">
                <img src="/images/logo.png" alt="logo" className="h-12" />
              </a>
            </div>

            {/* Navigation - Center */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <ul className="flex items-center gap-8">
                <li>
                  <NavLink to="/" className="nav-link">
                    Accueil
                  </NavLink>
                </li>

                {/* Services Mega Menu */}
                <li
                  className="relative"
                  onMouseEnter={handleServicesMouseEnter}
                  onMouseLeave={handleServicesMouseLeave}
                >
                  <button className="nav-link flex items-center gap-1">
                    Nos services
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {servicesOpen && (
                    <MegaMenu
                      isOpen={servicesOpen}
                      onClose={() => setServicesOpen(false)}
                    />
                  )}
                </li>

                {navLinks.slice(1).map((link) => (
                  <li key={link.path}>
                    <NavLink to={link.path} className="nav-link">
                      {link.name}
                    </NavLink>
                  </li>
                ))}

                {/* Language Dropdown */}
                <li
                  className="relative"
                  onMouseEnter={handleLangMouseEnter}
                  onMouseLeave={handleLangMouseLeave}
                >
                  <button className="nav-link flex items-center gap-2">
                    <img
                      src="https://flagcdn.com/w20/fr.png"
                      alt="Français"
                      className="w-5 h-3 rounded-sm"
                    />
                    Français
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {langOpen && (
                    <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                      {languages.map((lang) => (
                        <a
                          key={lang.code}
                          href="#"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <img
                            src={lang.flag}
                            alt={lang.name}
                            className="w-5 h-3 rounded-sm"
                          />
                          {lang.name}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              </ul>
            </div>

            {/* Auth Buttons - Right */}
            <div className="hidden lg:flex items-center gap-4">
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
                  <NavLink to="/admin" className="btn-outline">
                    Dashboard
                  </NavLink>
                  <button onClick={logoutCallback} className="btn-outline">
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-toggle lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? "active" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <a
            href="/"
            className="mobile-logo"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src="/images/logo.png" alt="logo" />
          </a>
          <button
            className="mobile-menu-close"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="mobile-nav">
          <ul>
            <li>
              <NavLink
                to="/"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </NavLink>
            </li>
            <li className="mobile-dropdown">
              <details>
                <summary className="mobile-nav-link ">Nos services <svg
                      className={`w-4 h-4  transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg></summary>
                <div className="pl-4 mt-2 space-y-3">
                  {services.map((service, index) => (
                    <a
                      key={index}
                      href={service.link}
                      className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="text-[#fb923c] shrink-0">
                        {service.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">
                          {service.title}
                        </div>
                        <p className="text-xs text-gray-500">{service.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </details>
            </li>
            <li>
              <NavLink
                to="/destinations"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Destinations
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                À propos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contactez-nous
              </NavLink>
            </li>
            <li className="mobile-lang-item">
              <select className="mobile-lang-select">
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </li>
            <li className="mobile-auth-section">
              {!authenticated ? (
                <>
                  <NavLink
                    to="/register"
                    className="mobile-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    S'inscrire
                  </NavLink>
                  <NavLink
                    to="/login"
                    className="mobile-nav-link btn-mobile-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Se connecter
                  </NavLink>
                </>
              ) : (
                <button
                  onClick={() => {
                    logoutCallback();
                    setMobileMenuOpen(false);
                  }}
                  className="mobile-nav-link"
                >
                  Logout
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Sticky Header */}
      <div className={`sticky-header ${showSticky ? "visible" : ""}`}>
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            {/* Logo - Left */}
            <div className="flex-shrink-0">
              <a href="/">
                <img src="/images/logo.png" alt="logo" className="h-8" />
              </a>
            </div>

            {/* Navigation - Center */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <ul className="flex items-center gap-6">
                <li>
                  <NavLink to="/" className="nav-link text-sm">
                    Accueil
                  </NavLink>
                </li>

                {/* Services Mega Menu in Sticky */}
                <li
                  className="relative"
                  onMouseEnter={handleStickyServicesMouseEnter}
                  onMouseLeave={handleStickyServicesMouseLeave}
                >
                  <button className="nav-link text-sm flex items-center gap-1">
                    Nos services
                    <svg
                      className={`w-3 h-3 transition-transform duration-300 ${stickyServicesOpen ? "rotate-180" : ""}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {stickyServicesOpen && (
                    <MegaMenu
                      isOpen={stickyServicesOpen}
                      onClose={() => setStickyServicesOpen(false)}
                    />
                  )}
                </li>

                <li>
                  <NavLink to="/destinations" className="nav-link text-sm">
                    Destinations
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" className="nav-link text-sm">
                    À propos
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/contact" className="nav-link text-sm">
                    Contactez-nous
                  </NavLink>
                </li>

                {/* Language Dropdown in Sticky */}
                <li
                  className="relative"
                  onMouseEnter={handleStickyLangMouseEnter}
                  onMouseLeave={handleStickyLangMouseLeave}
                >
                  <button className="nav-link text-sm flex items-center gap-1">
                    <img
                      src="https://flagcdn.com/w20/fr.png"
                      alt="Français"
                      className="w-4 h-2.5 rounded-sm"
                    />
                    FR
                    <svg
                      className={`w-3 h-3 transition-transform duration-300 ${stickyLangOpen ? "rotate-180" : ""}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {stickyLangOpen && (
                    <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                      {languages.map((lang) => (
                        <a
                          key={lang.code}
                          href="#"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition"
                        >
                          <img
                            src={lang.flag}
                            alt={lang.name}
                            className="w-4 h-2.5 rounded-sm"
                          />
                          {lang.name}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              </ul>
            </div>

            {/* Auth Buttons - Right */}
            <div className="hidden lg:flex items-center gap-3">
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
                <button onClick={logoutCallback} className="btn-outline-sm">
                  Logout
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-toggle lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <main>
        <Outlet />
        <Footer />
      </main>
    </>
  );
}
