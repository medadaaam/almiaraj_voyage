// src/pages/services/BilletDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Plane, Calendar, MapPin, Clock, CreditCard,
    Shield, Headphones, Star, Users, Luggage, Wifi,
    Coffee, Utensils, ChevronRight, CheckCircle, Phone, Mail,
    AlertCircle, Percent, Heart, Ticket, Award, Globe, Clock3
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import "./billetsDetails.css";

export default function BilletDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getBilletsDetails } = useAuth();
    const [billet, setBillet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBilletDetails = async () => {
            setLoading(true);
            try {
                const data = await getBilletsDetails(id);
                if (data) {
                    setBillet(data);
                } else {
                    setError("Billet non trouvé");
                }
            } catch (err) {
                console.error("Error:", err);
                setError("Erreur lors du chargement");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBilletDetails();
        }
    }, [id, getBilletsDetails]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            return format(new Date(dateString), "EEEE d MMMM yyyy", { locale: fr });
        } catch {
            return dateString;
        }
    };

    const getDaysCount = (departure, returnDate) => {
        if (!departure || !returnDate) return null;
        const start = new Date(departure);
        const end = new Date(returnDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
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
        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="star-filled" />);
        }
        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="star-empty" />);
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="billet-loading">
                <div className="billet-loading-spinner"></div>
                <p>Chargement des détails du vol...</p>
            </div>
        );
    }

    if (error || !billet) {
        return (
            <div className="billet-error">
                <div className="billet-error-icon">✈️</div>
                <h2>{error || "Billet non trouvé"}</h2>
                <p>Le vol que vous recherchez n'existe pas ou a été supprimé.</p>
                <button onClick={() => window.history.back()} className="billet-error-btn">
                    Retour aux vols
                </button>
            </div>
        );
    }

    const service = billet.service;
    const discount = getDiscountPercent(service?.oldPrix, service?.prix);
    const daysCount = getDaysCount(billet.dateDepartBi, billet.dateRetourBi);

    const amenities = [
        // { icon: <Luggage size={18} />, name: "Bagage inclus (23kg)" },
        { icon: <Wifi size={18} />, name: "Wi-Fi à bord" },
        { icon: <Coffee size={18} />, name: "Repas inclus" },
        { icon: <Users size={18} />, name: "Service prioritaire" }
    ];

    return (
        <div className="billet-page">
            {/* Back Button */}
            <div className="billet-back">
                <button onClick={() => window.history.back()} className="billet-back-link">
                    <ArrowLeft size={18} />
                    Retour aux vols
                </button>
            </div>

            {/* Hero Section */}
            <div className="billet-hero">
                <div className="billet-hero-overlay"></div>
                <div className="billet-hero-content">
                    <div className="billet-hero-badges">
                        {service?.enVedette === 1 && (
                            <span className="billet-hero-badge featured">
                                <Heart size={14} />
                                Vol populaire
                            </span>
                        )}
                        {discount > 0 && (
                            <span className="billet-hero-badge discount">
                                <Percent size={14} />
                                -{discount}%
                            </span>
                        )}
                    </div>
                    <h1 className="billet-hero-title">{service?.nomServ}</h1>
                    <div className="billet-hero-route">
                        <span className="billet-hero-city">{billet.villeDepartBi}</span>
                        <Plane size={24} className="billet-hero-plane" />
                        <span className="billet-hero-city">{billet.destinationBi}</span>
                    </div>
                    {/* <div className="billet-hero-rating">
                        {renderStars(parseFloat(service?.rating || 0))}
                        <span className="billet-hero-rating-value">{service?.rating} / 5</span>
                    </div> */}
                </div>
            </div>

            {/* Main Content */}
            <div className="billet-container">
                <div className="billet-grid">
                    {/* Left Column */}
                    <div className="billet-main">
                        {/* Flight Dates */}
                        <div className="billet-card">
                            <h3 className="billet-card-title">
                                <Calendar size={20} />
                                Dates du voyage
                            </h3>
                            <div className="billet-dates">
                                <div className="billet-date">
                                    <span className="billet-date-label">Départ</span>
                                    <span className="billet-date-value">{formatDate(billet.dateDepartBi)}</span>
                                </div>
                                {billet.dateRetourBi && (
                                    <div className="billet-date">
                                        <span className="billet-date-label">Retour</span>
                                        <span className="billet-date-value">{formatDate(billet.dateRetourBi)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="billet-duration">
                                <Clock size={16} />
                                <span>Durée du séjour: {daysCount} jours</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="billet-card">
                            <h3 className="billet-card-title">Description du vol</h3>
                            <p className="billet-description">{service?.description || "Vol confortable avec services premium"}</p>
                        </div>

                        {/* Flight Details */}
                        <div className="billet-card">
                            <h3 className="billet-card-title">Informations du vol</h3>
                            <div className="billet-details-grid">
                                <div className="billet-detail">
                                    <span className="billet-detail-label">Type de vol</span>
                                    <span className="billet-detail-value">
                                        {billet.typeBi === 'aller_retour' ? 'Aller retour' : 'Aller simple'}
                                    </span>
                                </div>
                                {/* <div className="billet-detail">
                                    <span className="billet-detail-label">Compagnie</span>
                                    <span className="billet-detail-value">Royal Air Maroc</span>
                                </div> */}
                                <div className="billet-detail">
                                    <span className="billet-detail-label">Numéro de vol</span>
                                    <span className="billet-detail-value">AT {billet.id + 100}</span>
                                </div>
                                {/* <div className="billet-detail">
                                    <span className="billet-detail-label">Classe</span>
                                    <span className="billet-detail-value">Économie Premium</span>
                                </div> */}
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="billet-card">
                            <h3 className="billet-card-title">Services inclus</h3>
                            <div className="billet-amenities">
                                {amenities.map((item, index) => (
                                    <div key={index} className="billet-amenity">
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cancellation Policy */}
                        <div className="billet-card">
                            <h3 className="billet-card-title">Politique d'annulation</h3>
                            <div className="billet-policy">
                                <div className="billet-policy-item success">
                                    <CheckCircle size={18} />
                                    <span>Annulation gratuite jusqu'à 30 jours avant le départ</span>
                                </div>
                                <div className="billet-policy-item warning">
                                    <AlertCircle size={18} />
                                    <span>Frais de 50% entre 30 et 15 jours avant le départ</span>
                                </div>
                                <div className="billet-policy-item error">
                                    <AlertCircle size={18} />
                                    <span>Non remboursable moins de 15 jours avant le départ</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="billet-sidebar">
                        <div className="billet-booking-card">
                            <div className="billet-price">
                                {service?.oldPrix && (
                                    <span className="billet-price-old">{service.oldPrix} DH</span>
                                )}
                                <div className="billet-price-current">
                                    <span className="billet-price-amount">{service?.prix} DH</span>
                                    <span className="billet-price-period">/personne</span>
                                </div>
                                {discount > 0 && (
                                    <p className="billet-price-savings">💰 Économisez {discount}%</p>
                                )}
                            </div>

                            <div className="billet-divider"></div>

                            <div className="billet-taxes">
                                <p>Taxes et frais inclus</p>
                                <p className="billet-taxes-small">Paiement sécurisé 100%</p>
                            </div>

                            <div className="billet-buttons">
                                <Link to={`/reserver/billet/${billet.id}`} className="billet-btn-book">
                                    Réserver maintenant
                                    <ChevronRight size={18} />
                                </Link>
                                <button className="billet-btn-contact">
                                    <Phone size={16} />
                                    Poser une question
                                </button>
                            </div>

                            {/* <div className="billet-payment">
                                <p className="billet-payment-title">Moyens de paiement acceptés:</p>
                                <div className="billet-payment-icons">
                                    <span>💳 Visa</span>
                                    <span>💳 Mastercard</span>
                                    <span>📱 PayPal</span>
                                </div>
                            </div> */}
                        </div>

                        <div className="billet-included">
                            <h4>✅ Ce qui est inclus</h4>
                            <ul>
                                <li>Billet d'avion aller/retour</li>
                                {/* <li>Bagage en soute (23kg)</li>
                                <li>Bagage cabine (8kg)</li>
                                <li>Repas à bord</li>
                                <li>Boissons incluses</li>
                                <li>Divertissement à bord</li> */}
                            </ul>
                        </div>

                        <div className="billet-not-included">
                            <h4>❌ Non inclus</h4>
                            <ul>
                                <li>Transport terrestre</li>
                                <li>Frais de visa</li>
                                <li>Assurance annulation (optionnelle)</li>
                                <li>Surclassement en première classe</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="billet-cta">
                <div className="billet-cta-content">
                    <h3>Prêt à partir à l'aventure ?</h3>
                    <p>Réservez maintenant et profitez des meilleurs tarifs</p>
                    <Link to={`/reserver/billet/${billet.id}`} className="billet-cta-btn">
                        Réserver ce vol
                        <ChevronRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
