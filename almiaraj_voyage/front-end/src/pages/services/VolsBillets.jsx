import { Link } from "react-router-dom";
import {
  Plane,
  Calendar,
  MapPin,
  CreditCard,
  Shield,
  Headphones,
  Globe,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";
import "./services.css";

export default function VolsBillets() {

  const billets = [
    {
      id: 1,
      from: "Casablanca",
      to: "Paris",
      date: "12 Juin 2026",
      returnDate: "20 Juin 2026",
      price: 2800,
      oldPrice: 3400,
      airline: "Royal Air Maroc",
      duration: "3h 10min",
      rating: 4.8,
    },
    {
      id: 2,
      from: "Fès",
      to: "Istanbul",
      date: "5 Juillet 2026",
      returnDate: "15 Juillet 2026",
      price: 4200,
      oldPrice: 5100,
      airline: "Turkish Airlines",
      duration: "4h 30min",
      rating: 4.9,
    },
  ];

  const features = [
    { icon: <CreditCard />, title: "Paiement sécurisé", desc: "Transactions 100% sécurisées" },
    { icon: <Shield />, title: "Garantie prix", desc: "Meilleurs prix garantis" },
    { icon: <Headphones />, title: "Support 24/7", desc: "Assistance avant et après vol" },
    { icon: <Globe />, title: "Destinations monde", desc: "Plus de 500 destinations" },
  ];

  return (
    <div className="service-flights">

      {/* HERO */}
      <div className="service-hero">
        <div className="service-hero-overlay"></div>
        <div className="service-hero-content">
          <h1 className="service-hero-title">Vols & Billets</h1>
          <p className="service-hero-subtitle">
            Réservez vos billets d'avion aux meilleurs prix
          </p>
        </div>
      </div>

      {/* SEARCH (خليتو) */}
      <div className="service-flight-search">
        <div className="service-flight-search-container">
          <h3>Rechercher un vol</h3>

          <div className="service-flight-search-form">
            <div className="service-flight-input-group">
              <label>Départ</label>
              <div className="service-flight-input">
                <MapPin size={18} />
                <input type="text" placeholder="Ville de départ" />
              </div>
            </div>

            <div className="service-flight-input-group">
              <label>Destination</label>
              <div className="service-flight-input">
                <MapPin size={18} />
                <input type="text" placeholder="Ville d'arrivée" />
              </div>
            </div>

            <div className="service-flight-input-group">
              <label>Aller</label>
              <div className="service-flight-input">
                <Calendar size={18} />
                <input type="date" />
              </div>
            </div>

            <div className="service-flight-input-group">
              <label>Retour</label>
              <div className="service-flight-input">
                <Calendar size={18} />
                <input type="date" />
              </div>
            </div>

            <button className="service-flight-search-btn">
              Rechercher
            </button>
          </div>
        </div>
      </div>

      {/* BILLETS CARDS */}
      <div className="service-circuits-grid">
          {billets.map((b) => (
            <div key={b.id} className="service-circuit-card">

              {/* Top */}
              <div className="service-circuit-content">

                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm bg-[#f1f5f9] px-3 py-1 rounded-full">
                    ✈️ {b.airline}
                  </span>

                  <div className="flex items-center gap-1 text-[#fb923c]">
                    <Star size={14} fill="#fb923c" />
                    {b.rating}
                  </div>
                </div>

                {/* Route */}
                <h3 className="service-circuit-title flex items-center gap-2">
                  <MapPin size={16} />
                  {b.from} <ArrowRight size={14} /> {b.to}
                </h3>

                {/* Dates */}
                <div className="service-circuit-duration">
                  <Calendar size={16} /> Aller: {b.date}
                </div>
                <div className="service-circuit-duration">
                  <Calendar size={16} /> Retour: {b.returnDate}
                </div>

                {/* Duration */}
                <div className="service-circuit-duration">
                  <Clock size={16} /> Durée: {b.duration}
                </div>

                {/* PRICE */}
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-red-500 line-through text-sm">
                      {b.oldPrice} DH
                    </p>
                    <p className="text-[#fb923c] font-bold text-lg">
                      {b.price} DH
                    </p>
                  </div>

                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                    Promo
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/vols/${b.id}`}
                    className="flex-1 text-center bg-gray-100 py-2 rounded-md hover:bg-gray-200"
                  >
                    Détails
                  </Link>

                  <Link
                    to={`/reservation/${b.id}`}
                    className="flex-1 text-center bg-[#fb923c] text-white py-2 rounded-md hover:bg-[#ea580c]"
                  >
                    Réserver
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      {/* FEATURES */}
      <div className="service-flight-features">
        <div className="service-section-header">
          <h2>Pourquoi réserver avec nous ?</h2>
        </div>

        <div className="service-features-grid">
          {features.map((f, i) => (
            <div key={i} className="service-feature-card">
              <div className="service-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="service-cta">
        <h3>Besoin d’un vol spécial ?</h3>
        <p>Contactez-nous pour les meilleures offres</p>
        <Link to="/contact" className="service-cta-btn">
          Demander un devis
        </Link>
      </div>

    </div>
  );
}