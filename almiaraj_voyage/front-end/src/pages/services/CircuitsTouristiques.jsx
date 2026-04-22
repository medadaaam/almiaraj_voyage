// src/pages/services/CircuitsTouristiques.jsx
import { Link } from "react-router-dom";
import { MapPin, Clock, Users, Star, Camera, Mountain, Umbrella, Landmark } from "lucide-react";
import "./services.css";

export default function CircuitsTouristiques() {
  const circuits = [
    {
      id: 1,
      title: "Circuit Impérial - Maroc",
      duration: "8 jours / 7 nuits",
      price: 4200,
      cities: ["Casablanca", "Rabat", "Meknès", "Fès", "Marrakech"],
      image: "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg",
      rating: 4.8,
      type: "Culturel",
      icon: <Landmark />
    },
    {
      id: 2,
      title: "Merveilles de Turquie",
      duration: "10 jours / 9 nuits",
      price: 5800,
      cities: ["Istanbul", "Cappadoce", "Pamukkale", "Antalya"],
      image: "https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg",
      rating: 4.9,
      type: "Culturel",
      icon: <Mountain />
    },
    {
      id: 3,
      title: "Égypte des Pharaons",
      duration: "7 jours / 6 nuits",
      price: 4900,
      cities: ["Le Caire", "Louxor", "Assouan", "Alexandrie"],
      image: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
      rating: 4.7,
      type: "Culturel",
      icon: <Camera />
    },
    {
      id: 4,
      title: "Andalousie Espagnole",
      duration: "6 jours / 5 nuits",
      price: 3900,
      cities: ["Séville", "Grenade", "Cordoue", "Malaga"],
      image: "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg",
      rating: 4.8,
      type: "Culturel",
      icon: <Umbrella />
    }
  ];

  return (
    <div className="service-circuits">
      {/* Hero */}
      <div className="service-hero">
        <div className="service-hero-overlay"></div>
        <div className="service-hero-content">
          <h1 className="service-hero-title">Circuits touristiques</h1>
          <p className="service-hero-subtitle">
            Découvrez les plus belles destinations du monde
          </p>
        </div>
      </div>

      {/* Circuits Grid */}
      <div className="service-circuits-section">
        <div className="service-section-header">
          <h2>Nos circuits populaires</h2>
          <p>Des voyages organisés pour découvrir l'essentiel</p>
        </div>
        <div className="service-circuits-grid">
          {circuits.map((circuit) => (
            <div key={circuit.id} className="service-circuit-card">
              <div className="service-circuit-image">
                <img src={circuit.image} alt={circuit.title} />
                <span className="service-circuit-type">{circuit.type}</span>
              </div>
              <div className="service-circuit-content">
                <div className="service-circuit-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={i < Math.floor(circuit.rating) ? "filled" : "empty"} />
                  ))}
                  <span>{circuit.rating}</span>
                </div>
                <h3 className="service-circuit-title">{circuit.title}</h3>
                <div className="service-circuit-duration">
                  <Clock size={16} /> {circuit.duration}
                </div>
                <div className="service-circuit-cities">
                  {circuit.cities.map((city, i) => (
                    <span key={i} className="service-circuit-city">
                      <MapPin size={12} /> {city}
                    </span>
                  ))}
                </div>
                <div className="service-circuit-footer">
                  <div className="service-circuit-price">
                    <span className="price">{circuit.price} DH</span>
                    <span className="period">/personne</span>
                  </div>
                  <Link to={`/services/circuits/${circuit.id}`} className="service-circuit-btn">
                    Détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="service-cta">
        <h3>Vous souhaitez un circuit personnalisé ?</h3>
        <p>Nos conseillers vous créent un voyage sur mesure</p>
        <Link to="/contact" className="service-cta-btn">Demander un devis</Link>
      </div>
    </div>
  );
}
