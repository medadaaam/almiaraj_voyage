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
  const [activeSection, setActiveSection] = useState("");

  const logoutCallback = async () => {
    await logout();
    navigate(LOGIN_ROUTE);
  };

  // Sticky header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      // Ki ywsel l 150px, yban sticky header w ykhtafo top bar w main header
      setShowSticky(window.scrollY > 150);

      // Scroll spy logic
      const sections = ['accueil', 'services', 'apropos', 'contact'];
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mobile menu effect
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [mobileMenuOpen]);

  // Smooth scroll function
  const handleSmoothScroll = (sectionId, e) => {
    e?.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Bar - yekhtafi ki yban sticky header */}
      <div className={`w-full bg-[#2f6f85] text-white text-sm border-b border-[#25596b] top-bar-fixed transition-all duration-300 ${showSticky ? 'top-bar-hidden' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">
          <div className="flex items-center gap-6">
            <a
              href="mailto:almiarajvoyage.fes@gmail.com"
              className="group flex items-center gap-2 transition duration-300"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#fb923c] transition duration-300">
                <i className="fa-solid fa-envelope text-sm group-hover:text-white"></i>
              </span>
              <span className="relative text-white group-hover:text-[#fb923c] transition duration-300">
                almiarajvoyage.fes@gmail.com
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#fb923c] group-hover:w-full transition-all duration-300"></span>
              </span>
            </a>

            <a
              href="tel:+212535657979"
              className="group flex items-center gap-2 transition duration-300"
            >
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

      {/* Main Header - yekhtafi ki yban sticky header */}
      <header className={`main-header  transition-all duration-300 ${showSticky ? 'main-header-hidden' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div>
            <a href="/">
              <img src="/images/logo.png" alt="logo" className="h-14" />
            </a>
          </div>
          <div className="hidden lg:block">
            <nav>
              <ul className="flex gap-6">
                <li>
                  <button
                    onClick={(e) => handleSmoothScroll('accueil', e)}
                    className={`aa ${activeSection === 'accueil' ? 'active-section' : ''}`}
                  >
                    Accueil
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => handleSmoothScroll('services', e)}
                    className={`aa ${activeSection === 'services' ? 'active-section' : ''}`}
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => handleSmoothScroll('apropos', e)}
                    className={`aa ${activeSection === 'apropos' ? 'active-section' : ''}`}
                  >
                    À propos
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => handleSmoothScroll('contact', e)}
                    className={`aa ${activeSection === 'contact' ? 'active-section' : ''}`}
                  >
                    Contact
                  </button>
                </li>
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
          <div className="hidden lg:block">
            <nav>
              <ul className="flex gap-4">
                {!authenticated ? (
                  <>
                    <li><NavLink to="/register" className="aa">S'inscrire</NavLink></li>
                    <li><NavLink to="/login" className="aa">Se connecter</NavLink></li>
                  </>
                ) : (
                  <li>
                    <button onClick={logoutCallback} className="aa">
                      Logout
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className="text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 right-0 bottom-0 bg-white z-50 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:hidden`}>
        <div className="flex justify-end p-4 border-b">
          <button onClick={() => setMobileMenuOpen(false)} className="text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-6">
          <ul className="flex flex-col gap-4">
            <li>
              <button
                onClick={(e) => handleSmoothScroll('accueil', e)}
                className={`aa block py-2 w-full text-left ${activeSection === 'accueil' ? 'active-section' : ''}`}
              >
                Accueil
              </button>
            </li>
            <li>
              <button
                onClick={(e) => handleSmoothScroll('services', e)}
                className={`aa block py-2 w-full text-left ${activeSection === 'services' ? 'active-section' : ''}`}
              >
                Services
              </button>
            </li>
            <li>
              <button
                onClick={(e) => handleSmoothScroll('apropos', e)}
                className={`aa block py-2 w-full text-left ${activeSection === 'apropos' ? 'active-section' : ''}`}
              >
                À propos
              </button>
            </li>
            <li>
              <button
                onClick={(e) => handleSmoothScroll('contact', e)}
                className={`aa block py-2 w-full text-left ${activeSection === 'contact' ? 'active-section' : ''}`}
              >
                Contact
              </button>
            </li>
            <li className="pt-4 border-t mt-2">
              {!authenticated ? (
                <div className="flex flex-col gap-3">
                  <NavLink to="/register" className="aa block py-2" onClick={() => setMobileMenuOpen(false)}>S'inscrire</NavLink>
                  <NavLink to="/login" className="aa block py-2" onClick={() => setMobileMenuOpen(false)}>Se connecter</NavLink>
                </div>
              ) : (
                <button onClick={() => { logoutCallback(); setMobileMenuOpen(false); }} className="aa text-left py-2">
                  Logout
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Sticky Header - yban ki tscroli */}
      <div className={`sticky-header ${showSticky ? 'visible' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <a href="/">
            <img src="/images/logo.png" alt="logo" className="h-10" />
          </a>
          <div className="hidden md:flex gap-6">
            <button
              onClick={(e) => handleSmoothScroll('accueil', e)}
              className={`aa text-sm ${activeSection === 'accueil' ? 'active-section' : ''}`}
            >
              Accueil
            </button>
            <button
              onClick={(e) => handleSmoothScroll('services', e)}
              className={`aa text-sm ${activeSection === 'services' ? 'active-section' : ''}`}
            >
              Services
            </button>
            <button
              onClick={(e) => handleSmoothScroll('apropos', e)}
              className={`aa text-sm ${activeSection === 'apropos' ? 'active-section' : ''}`}
            >
              À propos
            </button>
            <button
              onClick={(e) => handleSmoothScroll('contact', e)}
              className={`aa text-sm ${activeSection === 'contact' ? 'active-section' : ''}`}
            >
              Contact
            </button>
          </div>
          <div>
            {!authenticated ? (
              <>
                <NavLink to="/register" className="bg-[#fb923c] text-white px-4 py-1.5 rounded-md text-sm hover:bg-orange-600 transition">
                  S'inscrire
                </NavLink>
                <NavLink to="/login" className="bg-[#fb923c] text-white px-4 py-1.5 rounded-md text-sm hover:bg-orange-600 transition ml-2">
                  Se connecter
                </NavLink>
              </>
            ) : (
              <button onClick={logoutCallback} className="bg-[#fb923c] text-white px-4 py-1.5 rounded-md text-sm hover:bg-orange-600 transition">
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
