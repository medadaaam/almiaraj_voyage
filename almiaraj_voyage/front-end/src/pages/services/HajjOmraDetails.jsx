// src/pages/services/HajjOmraDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Calendar, Clock, Users, MapPin, Hotel, Bus, Coffee,
  Phone, Mail, Star, CheckCircle, Shield, CreditCard, Heart,
  Compass, Plane, Bed, Utensils, Wifi, Car, Sun, Moon, Info,
  ChevronRight, AlertCircle, Gift, Award, BadgeCheck, User
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import "./omraDetails.css";

export default function HajjOmraDetailsCl() {
  const { id } = useParams();
  const { getHajjOmraDetails } = useAuth();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await getHajjOmraDetails(id);
        console.log("Hajj/Omra details:", data);
        if (data && data.id) {
          setPackageData(data);
        } else {
          setError("Forfait non trouvé");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id, getHajjOmraDetails]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const getDiscountPercent = (oldPrice, price) => {
    if (oldPrice && oldPrice > price) {
      return Math.round(((oldPrice - price) / oldPrice) * 100);
    }
    return 0;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="star-filled" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="star-filled-half" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="star-empty" />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="hajj-details-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des détails du forfait...</p>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="hajj-details-error">
        <div className="error-icon">🕋</div>
        <h2>{error || "Forfait non trouvé"}</h2>
        <p>Le forfait que vous recherchez n'existe pas ou a été supprimé.</p>
        <Link to="/services/hajj-omra" className="error-back-btn">
          Retour aux forfaits
        </Link>
      </div>
    );
  }

  // ✅ استخراج البيانات من service
  const service = packageData.service;
  const discount = getDiscountPercent(service?.oldPrix, service?.prix);
  const isHajj = packageData.type === "Hajj";

  // ✅ حساب عدد الأيام
  const startDate = new Date(packageData.dateDepartHO);
  const endDate = new Date(packageData.dateRetourHO);
  const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  // ✅ Itinéraire
//   const itineraire = [
//     "Arrivée à Jeddah et transfert vers La Mecque",
//     "Installation à l'hôtel et briefing",
//     "Visite guidée des lieux saints",
//     "Accomplissement des rituels",
//     "Départ vers Médine",
//     "Visite de la mosquée du Prophète",
//     "Dernière journée et transfert à l'aéroport"
//   ];

  const includedServices = [
    "Vols internationaux aller-retour",
    "Visa Hajj/Omra inclus",
    "Hébergement: " + (packageData.hotel || "Hôtel 3*"),
    "Transport terrestre sur place: " + (packageData.transport || "Bus"),
    "Repas: " + (packageData.meals || "Petit-déjeuner"),
    "Guide religieux francophone",
    "Visites guidées des lieux saints",
    "Assistance 24h/24 sur place",
    "Trousse du pèlerin",
    "Transferts aéroport - hôtel - aéroport"
  ];

  const notIncluded = [
    "Dépenses personnelles",
    "Pourboires",
    "Repas non spécifiés",
    "Frais de vaccination",
    "Assurance annulation (optionnelle)"
  ];

  return (
    <div className="hajj-details-page">
      {/* Back Button */}
      <div className="hajj-details-back">
        <Link to="/services/hajj-omra" className="back-link">
          <ArrowLeft size={18} />
          Retour aux forfaits
        </Link>
      </div>

      {/* Hero Section */}
      <div className="hajj-details-hero">
        <div className="hero-badges">
          {discount > 0 && (
            <span className="hero-badge discount">
              <Gift size={14} />
              -{discount}%
            </span>
          )}
          {service?.enVedette === 1 && (
            <span className="hero-badge featured">
              <Star size={14} />
              En vedette
            </span>
          )}
          <span className={`hero-badge type ${isHajj ? "hajj" : "omra"}`}>
            {isHajj ? "🕋 Hajj" : "🕌 Omra"}
          </span>
        </div>

        <h1 className="hero-title">{service?.nomServ}</h1>

        <div className="hero-rating">
          {renderStars(parseFloat(service?.rating || 0))}
          <span className="rating-value">{service?.rating} / 5</span>
        </div>

        <div className="hero-price">
          {service?.oldPrix && (
            <span className="old-price">{formatPrice(service.oldPrix)} DH</span>
          )}
          <span className="current-price">{formatPrice(service?.prix)} DH</span>
          <span className="price-period">/personne</span>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <Calendar size={18} />
            <div>
              <span className="stat-label">Départ</span>
              <span className="stat-value">{formatDate(packageData.dateDepartHO)}</span>
            </div>
          </div>
          <div className="stat-item">
            <Calendar size={18} />
            <div>
              <span className="stat-label">Retour</span>
              <span className="stat-value">{formatDate(packageData.dateRetourHO)}</span>
            </div>
          </div>
          <div className="stat-item">
            <Clock size={18} />
            <div>
              <span className="stat-label">Durée</span>
              <span className="stat-value">{packageData.duree || duration} jours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="hajj-details-container">
        <div className="hajj-details-grid">
          {/* Left Column - Informations */}
          <div className="hajj-details-main">
            {/* Description */}
            <div className="info-card">
              <h3>
                <Info size={20} />
                Description du forfait
              </h3>
              <p>
                {service?.description || `Partez pour un ${isHajj ? "Hajj" : "Omra"} spirituel inoubliable avec notre forfait ${service?.nomServ}.
                Un accompagnement professionnel pour vous guider dans l'accomplissement de vos rituels dans les meilleures conditions.
                Logement de qualité, transport confortable et repas inclus pour un séjour serein.`}
              </p>
            </div>

            {/* Hébergement & Transport */}
            <div className="info-card">
              <h3>Hébergement & Transport</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <Hotel size={18} className="detail-icon" />
                  <div>
                    <span className="detail-label">Hébergement</span>
                    <span className="detail-value">{packageData.hotel || "Hôtel 3*"}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Bus size={18} className="detail-icon" />
                  <div>
                    <span className="detail-label">Transport</span>
                    <span className="detail-value">{packageData.transport || "Bus privé"}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Utensils size={18} className="detail-icon" />
                  <div>
                    <span className="detail-label">Repas</span>
                    <span className="detail-value">{packageData.meals || "Petit-déjeuner"}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Users size={18} className="detail-icon" />
                  <div>
                    <span className="detail-label">Type de chambre</span>
                    <span className="detail-value">{packageData.typeChambre || "Triple"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Itinéraire */}
            {/* <div className="info-card">
              <h3>
                <Compass size={20} />
                Itinéraire spirituel
              </h3>
              <div className="itineraire-list">
                {itineraire.map((step, index) => (
                  <div key={index} className="itineraire-item">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">
                      <h4>Jour {index + 1}</h4>
                      <p>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Inclus */}
            <div className="info-card">
              <h3>Services inclus</h3>
              <div className="included-list">
                {includedServices.map((item, index) => (
                  <div key={index} className="included-item">
                    <CheckCircle size={18} className="check-icon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Non inclus */}
            <div className="info-card">
              <h3>Services non inclus</h3>
              <div className="not-included-list">
                {notIncluded.map((item, index) => (
                  <div key={index} className="not-included-item">
                    <AlertCircle size={18} className="alert-icon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="hajj-details-sidebar">
            <div className="booking-card">
              <div className="price-section">
                <h3>Prix par personne</h3>
                <div className="price-display">
                  {service?.oldPrix && (
                    <span className="old-price">{formatPrice(service.oldPrix)} DH</span>
                  )}
                  <span className="current-price">{formatPrice(service?.prix)} DH</span>
                </div>
                {discount > 0 && (
                  <p className="savings">💰 Économisez {discount}%</p>
                )}
              </div>

              <div className="divider"></div>

              <div className="booking-info">
                <div className="info-row">
                  <Calendar size={16} />
                  <span>Départ: {formatDate(packageData.dateDepartHO)}</span>
                </div>
                <div className="info-row">
                  <Calendar size={16} />
                  <span>Retour: {formatDate(packageData.dateRetourHO)}</span>
                </div>
                <div className="info-row">
                  <Clock size={16} />
                  <span>Durée: {packageData.duree || duration} jours</span>
                </div>
                <div className="info-row">
                  <Users size={16} />
                  <span>Chambre: {packageData.typeChambre || "Triple"}</span>
                </div>
              </div>

              <div className="divider"></div>

              <div className="highlights">
                <h4>Points forts</h4>
                <ul>
                  <li>Guide francophone</li>
                  <li>Visites incluses</li>
                  <li>Assistance 24/7</li>
                  <li>Visa facilité</li>
                </ul>
              </div>

              <div className="booking-buttons">
                <Link to={`/reserver/hajj-omra/${packageData.id}`} className="book-now-btn">
                  Réserver maintenant
                  <ChevronRight size={18} />
                </Link>
                <button className="contact-btn">
                  <Phone size={16} />
                  Poser une question
                </button>
              </div>

              <div className="payment-methods">
                <p>Moyens de paiement acceptés:</p>
                <div className="payment-icons">
                  <span>💳 Visa</span>
                  <span>💳 Mastercard</span>
                  <span>🏦 Virement</span>
                </div>
              </div>

              <div className="guarantee">
                <Shield size={16} />
                <span>Paiement sécurisé - Meilleur prix garanti</span>
              </div>
            </div>

            {/* Contact Card */}
            <div className="contact-card">
              <h4>Besoin d'aide ?</h4>
              <p>Nos spécialistes Hajj & Omra sont à votre disposition</p>
              <a href="tel:+212535657979" className="phone-link">
                <Phone size={16} />
                05 35 65 79 79
              </a>
              <a href="mailto:almiarajvoyage.fes@gmail.com" className="email-link">
                <Mail size={16} />
                almiarajvoyage.fes@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="hajj-details-cta">
        <div className="cta-content">
          <h3>Prêt pour ce voyage spirituel ?</h3>
          <p>Réservez dès maintenant et bénéficiez de nos meilleurs tarifs</p>
          <Link to={`/reserver/hajj-omra/${packageData.id}`} className="cta-button">
            Réserver ce forfait
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
