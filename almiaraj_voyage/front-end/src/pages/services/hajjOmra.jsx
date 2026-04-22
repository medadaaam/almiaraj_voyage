// src/pages/services/HajjOmra.jsx
import { Link } from "react-router-dom";
import { Calendar, Users, MapPin, Clock, Phone, Mail, Star, CheckCircle } from "lucide-react";
import "./services.css";

export default function HajjOmra() {
  const packages = [
    {
      id: 1,
      title: "Hajj 2025 - Économique",
      duration: "25 jours",
      price: 8500,
      oldPrice: 9500,
      groupSize: "40 personnes",
      hotel: "Hôtel 3* à Aziziah",
      transport: "Bus climatisé + Train",
      meals: "Petit-déjeuner inclus",
      features: ["Guide francophone", "Assistance 24/7", "Visa inclus"]
    },
    {
      id: 2,
      title: "Omra - Ramadhan 2025",
      duration: "15 jours",
      price: 5500,
      oldPrice: 6500,
      groupSize: "25 personnes",
      hotel: "Hôtel 4* à Aziziah",
      transport: "Bus privé VIP",
      meals: "Demi-pension",
      features: ["Guide francophone", "Visa inclus", "Ziyarat à Médine"]
    },
    {
      id: 3,
      title: "Hajj 2025 - Confort",
      duration: "30 jours",
      price: 12000,
      oldPrice: 13500,
      groupSize: "25 personnes",
      hotel: "Hôtel 5* à Aziziah",
      transport: "Bus privé VIP",
      meals: "Pension complète",
      features: ["Guide francophone", "Assistance 24/7", "Visa inclus", "Chambre avec salle de bain"]
    },
    {
      id: 4,
      title: "Omra - Printemps 2025",
      duration: "12 jours",
      price: 4500,
      oldPrice: 5200,
      groupSize: "30 personnes",
      hotel: "Hôtel 3* à Aziziah",
      transport: "Bus climatisé",
      meals: "Petit-déjeuner inclus",
      features: ["Guide francophone", "Visa inclus"]
    }
  ];

  return (
    <div className="service-hajj">
      {/* Hero */}
      <div className="service-hero">
        <div className="service-hero-overlay"></div>
        <div className="service-hero-content">
          <h1 className="service-hero-title">Hajj & Omra</h1>
          <p className="service-hero-subtitle">
            Accomplissez votre pèlerinage dans les meilleures conditions
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="service-info-section">
        <div className="service-info-grid">
          <div className="service-info-card">
            <Calendar className="service-info-icon" />
            <h3>Dates flexibles</h3>
            <p>Plusieurs départs tout au long de l'année</p>
          </div>
          <div className="service-info-card">
            <Users className="service-info-icon" />
            <h3>Accompagnement</h3>
            <p>Guide francophone à votre disposition</p>
          </div>
          <div className="service-info-card">
            <MapPin className="service-info-icon" />
            <h3>Visites guidées</h3>
            <p>Découverte des lieux saints</p>
          </div>
          <div className="service-info-card">
            <Clock className="service-info-icon" />
            <h3>Séjours sur mesure</h3>
            <p>Programmes adaptés à vos besoins</p>
          </div>
        </div>
      </div>

      {/* Packages */}
      <div className="service-packages">
        <div className="service-section-header">
          <h2>Nos forfaits Hajj & Omra</h2>
          <p>Des formules adaptées à tous les budgets</p>
        </div>
        <div className="service-packages-grid">
          {packages.map((pkg) => (
            <div key={pkg.id} className="service-package-card">
              {pkg.oldPrice && (
                <span className="service-package-badge">Promo</span>
              )}
              <h3 className="service-package-title">{pkg.title}</h3>
              <div className="service-package-price">
                <span className="service-package-old">{pkg.oldPrice} DH</span>
                <span className="service-package-new">{pkg.price} DH</span>
              </div>
              <ul className="service-package-features">
                <li><Clock size={16} /> Durée: {pkg.duration}</li>
                <li><Users size={16} /> Groupe: {pkg.groupSize}</li>
                <li><MapPin size={16} /> Hébergement: {pkg.hotel}</li>
                <li><CheckCircle size={16} /> Transport: {pkg.transport}</li>
                <li><CheckCircle size={16} /> Repas: {pkg.meals}</li>
              </ul>
              <div className="service-package-footer">
                {pkg.features.map((feature, i) => (
                  <span key={i} className="service-package-tag">{feature}</span>
                ))}
              </div>
              <Link to="/contact" className="service-package-btn">Demander un devis</Link>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="service-cta">
        <h3>Besoin d'informations pour votre pèlerinage ?</h3>
        <p>Contactez nos spécialistes Hajj & Omra</p>
        <div className="service-cta-buttons">
          <Link to="/contact" className="service-cta-btn">Nous contacter</Link>
          <a href="tel:+212535657979" className="service-cta-btn-outline">
            <Phone size={18} /> 05 35 65 79 79
          </a>
        </div>
      </div>
    </div>
  );
}
