import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] border-t border-[#2f6f85]/20 relative z-1 pt-32">
      {/* Main Footer Content */}
      <div className="pt-16 pb-8 px-4 mx-auto max-w-7xl md:px-8 lg:px-12">

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block group">
              <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-[#fb923c] transition-colors duration-300">
                Al Miaraj Voyages
              </h2>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Explorez le monde en toute simplicité ! Nous proposons des voyages,
              des séjours et des circuits sur mesure pour rendre votre voyage
              agréable et inoubliable.
            </p>

            {/* Social Media */}
            <div className="flex gap-3">
              <a
                href="https://wa.me/21270136542"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-[#25D366] hover:border-[#25D366] transition-all duration-300 group"
              >
                <i className="fab fa-whatsapp text-sm text-gray-300 group-hover:text-white"></i>
              </a>
              <a
                href="https://www.instagram.com/almiarajvoyagesfesofficielle/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:bg-pink hover:bg-[#FD1D1D] hover:border-transparent transition-all duration-300 group"
              >
                <i className="fab fa-instagram text-sm text-gray-300 group-hover:text-white"></i>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-[#000000] hover:border-[#00f2ea] transition-all duration-300 group"
              >
                <i className="fab fa-tiktok text-sm text-gray-300 group-hover:text-white"></i>
              </a>
              <a
                href="https://www.youtube.com/@ALMIARAJVOYAGES"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-[#FD1D1D] hover:border-[#1DA1F2] transition-all duration-300 group"
              >
                <i className="fab fa-youtube text-sm text-gray-300 group-hover:text-white"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 border-l-3 border-[#fb923c] pl-5">
              Liens rapides
            </h3>
            <ul className="space-y-3 pl-5">
              <li>
                <Link to="/" className="text-gray-400 hover:text-[#fb923c] transition-colors duration-200 text-sm inline-flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#fb923c] transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-gray-400 hover:text-[#fb923c] transition-colors duration-200 text-sm inline-flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#fb923c] transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-[#fb923c] transition-colors duration-200 text-sm inline-flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#fb923c] transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-[#fb923c] transition-colors duration-200 text-sm inline-flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#fb923c] transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 border-l-3 border-[#fb923c] pl-3">
              Nos services
            </h3>
            <ul className="space-y-3 pl-3">
              <li>
                <Link to="/services/circuits" className="text-gray-400 hover:text-[#fb923c] transition-colors duration-200 text-sm inline-flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#fb923c] transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Circuits touristiques
                </Link>
              </li>
              <li>
                <Link to="/services/flights" className="text-gray-400 hover:text-[#fb923c] transition-colors duration-200 text-sm inline-flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#fb923c] transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Vols & billets
                </Link>
              </li>
              <li>
                <Link to="/services/hotels" className="text-gray-400 hover:text-[#fb923c] transition-colors duration-200 text-sm inline-flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#fb923c] transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Hôtels & séjours
                </Link>
              </li>
              <li>
                <Link to="/services/hajj-omra" className="text-gray-400 hover:text-[#fb923c] transition-colors duration-200 text-sm inline-flex items-center group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-[#fb923c] transition-all duration-200 mr-0 group-hover:mr-2"></span>
                  Hajj Omra
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 border-l-3 border-[#fb923c] pl-3">
              Contact
            </h3>
            <ul className="space-y-4 pl-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <i className="fas fa-map-marker-alt text-[#fb923c] mt-1"></i>
                <span>Fès, Maroc</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <i className="fas fa-phone text-[#fb923c] mt-1"></i>
                <a href="tel:+212535657979" className="hover:text-[#fb923c] transition">
                  05 35 65 79 79
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <i className="fas fa-envelope text-[#fb923c] mt-1"></i>
                <a href="mailto:almiarajvoyage.fes@gmail.com" className="hover:text-[#fb923c] transition break-all">
                  almiarajvoyage.fes@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              Tous droits réservés © {new Date().getFullYear()} Al Miaraj Voyages
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-gray-400 text-xs hover:text-[#fb923c] transition">
                Politique de confidentialité
              </Link>
              <Link to="/terms" className="text-gray-400 text-xs hover:text-[#fb923c] transition">
                Conditions générales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
