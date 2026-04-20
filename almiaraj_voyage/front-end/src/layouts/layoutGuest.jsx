import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./layout.css";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import Footer from "@/pages/footer";

export default function LayoutGuest() {
  const navigate = useNavigate();
  const { authenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && authenticated) {
      navigate("/");
    }
  }, [authenticated, loading]);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* <div className="w-full bg-[#2f6f85] text-white text-sm border-b border-[#25596b]">
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
          <button  className="bg-[#fb923c] text-white px-4 py-1 rounded-md font-medium hover:bg-orange-600 transition">
            Personnaliser un voyage →
          </button>
        </div>
      </div> */}

      <header className="absolute w-full">
        <div>
          <a href="/">
            <img src="/images/logo.png" alt="logo" />
          </a>
        </div>
        <div>
          <nav>
            <ul>
              <li>
                <NavLink to="/" className="aa">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/services" className="aa">
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="aa">
                  A propos
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="aa">
                  contact
                </NavLink>
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
        <div>
          <nav>
            <ul>
              <li>
                <a href="/register" className="btn-primary">
                  S'inscrire
                </a>
              </li>
              <li>
                <a href="/login" className="btn-outline">
                  Se connecter
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
}
