// src/pages/services/VolsBillets.jsx
import { Link } from "react-router-dom";
import { Plane, Calendar, Clock, MapPin, CreditCard, Shield, Headphones, Globe } from "lucide-react";
import "./services.css";

export default function VolsBillets() {
  const airlines = [
    { name: "Royal Air Maroc", logo: "✈️", code: "AT" },
    { name: "Air France", logo: "✈️", code: "AF" },
    { name: "Turkish Airlines", logo: "✈️", code: "TK" },
    { name: "Emirates", logo: "✈️", code: "EK" },
    { name: "Qatar Airways", logo: "✈️", code: "QR" },
    { name: "Iberia", logo: "✈️", code: "IB" }
  ];

  const features = [
    { icon: <CreditCard />, title: "Paiement sécurisé", desc: "Transactions 100% sécurisées" },
    { icon: <Shield />, title: "Garantie prix", desc: "Meilleurs prix garantis" },
    { icon: <Headphones />, title: "Support 24/7", desc: "Assistance avant et après vol" },
    { icon: <Globe />, title: "Destinations monde", desc: "Plus de 500 destinations" }
  ];

  return (
    <div className="service-flights">
      {/* Hero */}
      <div className="service-hero">
        <div className="service-hero-overlay"></div>
        <div className="service-hero-content">
          <h1 className="service-hero-title">Vols & billets</h1>
          <p className="service-hero-subtitle">
            Réservez vos billets d'avion aux meilleurs prix
          </p>
        </div>
      </div>

      {/* Search Form */}
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
            <button className="service-flight-search-btn">Rechercher</button>
          </div>
        </div>
      </div>

      {/* Airlines */}
      <div className="service-airlines">
        <div className="service-section-header">
          <h2>Nos compagnies partenaires</h2>
          <p>Les meilleures compagnies aériennes à votre service</p>
        </div>
        <div className="service-airlines-grid">
          {airlines.map((airline, index) => (
            <div key={index} className="service-airline-card">
              <span className="service-airline-logo">{airline.logo}</span>
              <span className="service-airline-name">{airline.name}</span>
              <span className="service-airline-code">{airline.code}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="service-flight-features">
        <div className="service-section-header">
          <h2>Pourquoi réserver avec nous ?</h2>
        </div>
        <div className="service-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="service-feature-card">
              <div className="service-feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="service-cta">
        <h3>Besoin d'un vol pas cher ?</h3>
        <p>Contactez-nous pour les meilleures offres</p>
        <Link to="/contact" className="service-cta-btn">Demander un devis</Link>
      </div>
    </div>
  );
}
