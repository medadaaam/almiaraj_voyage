import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Clock, Star, Plane, Hotel, Users, ChevronRight, Percent, Eye, Wifi, Coffee, Car, Waves, Utensils, Dumbbell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import "./DestinationOffres.css";

export default function DestinationOffres() {
    const { id } = useParams();
    const { getDestinationServices } = useAuth();
    const [destination, setDestination] = useState(null);
    const [hotels, setHotels] = useState([]);
    const [voyages, setVoyages] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOffres = async () => {
            setLoading(true);
            setError(null);

            const data = await getDestinationServices(id);

            if (data && data.destination) {
                setDestination(data.destination);
                setHotels(data.offres?.hotels || []);
                setVoyages(data.offres?.voyages || []);
            } else if (data && !data.destination) {
                setError("Format de données incorrect");
            } else if (!data) {
                setError("Impossible de charger les offres");
            }

            setLoading(false);
        };

        if (id) {
            fetchOffres();
        }
    }, [id, getDestinationServices]);

    const getDiscountPercent = (oldPrice, price) => {
        if (oldPrice && oldPrice > price) {
            return Math.round(((oldPrice - price) / oldPrice) * 100);
        }
        return 0;
    };

    const getActiveServices = () => {
        if (activeTab === "all") {
            return [
                ...voyages.map(v => ({ ...v, type: 'voyage', service: v.service })),
                ...hotels.map(h => ({ ...h, type: 'hotel', service: h.service }))
            ];
        }
        if (activeTab === "voyages") return voyages.map(v => ({ ...v, type: 'voyage', service: v.service }));
        if (activeTab === "hotels") return hotels.map(h => ({ ...h, type: 'hotel', service: h.service }));
        return [];
    };

    const getAmenityIcon = (amenity) => {
        const icons = {
            "Wifi": <Wifi size={14} />,
            "Piscine": <Waves size={14} />,
            "Petit-déjeuner": <Coffee size={14} />,
            "Parking": <Car size={14} />,
            "Restaurant": <Utensils size={14} />,
            "Spa": <Waves size={14} />,
            "Gym": <Dumbbell size={14} />
        };
        return icons[amenity] || <Wifi size={14} />;
    };

    if (loading) {
        return (
            <div className="offres-loading">
                <div className="offres-loading-spinner"></div>
                <p>Chargement des offres...</p>
            </div>
        );
    }

    if (error || !destination) {
        return (
            <div className="offres-error">
                <div className="offres-error-icon">⚠️</div>
                <h2>{error ? "Erreur" : "Destination non trouvée"}</h2>
                <p>{error || "Cette destination n'existe pas ou n'est plus disponible"}</p>
                <Link to="/destinations" className="offres-error-btn">
                    Retour aux destinations
                </Link>
            </div>
        );
    }

    const hasOffres = voyages.length > 0 || hotels.length > 0;

    return (
        <div className="offres-page">
            {/* Hero Section */}
            <div className="offres-hero" style={{ backgroundImage: `url('http://127.0.0.1:8000/storage/${destination.image}')` }}>
                <div className="offres-hero-overlay"></div>
                <div className="offres-hero-content">
                    <Link to="/destinations" className="offres-hero-back">
                        <ArrowLeft size={18} />
                        Retour aux destinations
                    </Link>
                    <h1 className="offres-hero-title">{destination.pays}</h1>
                    <p className="offres-hero-subtitle">{destination.description}</p>
                    <div className="offres-hero-location">
                        <MapPin size={18} />
                        <span> {destination.continente}</span>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="offres-stats">
                <div className="offres-stats-container">
                    <div className="offres-stat">
                        <div className="offres-stat-value">{voyages.length}</div>
                        <div className="offres-stat-label">
                            <Plane size={16} />
                            Voyages
                        </div>
                    </div>
                    <div className="offres-stat">
                        <div className="offres-stat-value">{hotels.length}</div>
                        <div className="offres-stat-label">
                            <Hotel size={16} />
                            Hôtels
                        </div>
                    </div>
                    <div className="offres-stat">
                        <div className="offres-stat-value">{voyages.length + hotels.length}</div>
                        <div className="offres-stat-label">Total offres</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="offres-tabs">
                <div className="offres-tabs-container">
                    <button
                        className={`offres-tab ${activeTab === "all" ? "active" : ""}`}
                        onClick={() => setActiveTab("all")}
                    >
                        Toutes les offres
                    </button>
                    <button
                        className={`offres-tab ${activeTab === "voyages" ? "active" : ""}`}
                        onClick={() => setActiveTab("voyages")}
                    >
                        <Plane size={16} />
                        Voyages ({voyages.length})
                    </button>
                    <button
                        className={`offres-tab ${activeTab === "hotels" ? "active" : ""}`}
                        onClick={() => setActiveTab("hotels")}
                    >
                        <Hotel size={16} />
                        Hôtels ({hotels.length})
                    </button>
                </div>
            </div>

            {/* Offres Grid */}
            <div className="offres-grid-section">
                <div className="offres-container">
                    {!hasOffres ? (
                        <div className="offres-empty">
                            <div className="offres-empty-icon">📭</div>
                            <h3>Aucune offre disponible</h3>
                            <p>Découvrez bientôt nos offres pour cette destination</p>
                            <Link to="/destinations" className="offres-empty-btn">
                                Voir d'autres destinations
                                <ChevronRight size={16} />
                            </Link>
                        </div>
                    ) : getActiveServices().length === 0 ? (
                        <div className="offres-empty">
                            <p>Aucune offre dans cette catégorie</p>
                        </div>
                    ) : (
                        <div className="offres-grid">
                            {getActiveServices().map((item) => {
                                const service = item.service;
                                const discount = getDiscountPercent(service?.oldPrix, service?.prix);
                                let amenities = [];
                                try {
                                    amenities = typeof item.amenities === 'string' ? JSON.parse(item.amenities || '[]') : (item.amenities || []);
                                } catch(e) {
                                    amenities = [];
                                }

                                return (
                                    <div key={item.id} className="offre-card">
                                        <div className="offre-card-image">
                                            <img
                                                src={`http://127.0.0.1:8000/storage/${service?.image}`}
                                                alt={service?.nomServ}
                                                onError={(e) => { e.target.src = '/images/placeholder.jpg' }}
                                            />
                                            <div className="offre-card-overlay"></div>

                                            <span className={`offre-card-badge ${item.type === 'voyage' ? 'type-voyage' : 'type-hotel'}`}>
                                                {item.type === 'voyage' ? '✈️ Voyage' : '🏨 Hôtel'}
                                            </span>

                                            {discount > 0 && (
                                                <span className="offre-card-discount">
                                                    <Percent size={12} />
                                                    -{discount}%
                                                </span>
                                            )}

                                            {service?.enVedette === 1 && (
                                                <span className="offre-card-featured">
                                                    <Star size={12} fill="white" />
                                                    Populaire
                                                </span>
                                            )}
                                        </div>

                                        <div className="offre-card-content">
                                            <h3 className="offre-card-title">{service?.nomServ}</h3>
                                            <p className="offre-card-description">{service?.description}</p>

                                            {item.type === 'voyage' && item.dateDepartV && (
                                                <div className="offre-card-details">
                                                    <div className="offre-card-detail">
                                                        <Calendar size={14} />
                                                        <span>Départ: <strong>{item.dateDepartV}</strong></span>
                                                    </div>
                                                    <div className="offre-card-detail">
                                                        <Clock size={14} />
                                                        <span>Retour: <strong>{item.dateRetourV}</strong></span>
                                                    </div>
                                                    {item.groupSize && (
                                                        <div className="offre-card-detail">
                                                            <Users size={14} />
                                                            <span>Groupe: <strong>{item.groupSize}</strong></span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {item.type === 'hotel' && item.villeHotel && (
                                                <>
                                                    <div className="offre-card-location">
                                                        <MapPin size={14} />
                                                        <span>{item.villeHotel}</span>
                                                    </div>
                                                    {amenities.length > 0 && (
                                                        <div className="offre-card-amenities">
                                                            {amenities.slice(0, 4).map((amenity, idx) => (
                                                                <span key={idx} className="offre-card-amenity">
                                                                    {getAmenityIcon(amenity)}
                                                                    {amenity}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {service?.rating && (
                                                <div className="offre-card-rating">
                                                    <Star size={14} className="filled" />
                                                    <span>{service.rating}</span>
                                                    <span className="offre-card-reviews">/ 5</span>
                                                </div>
                                            )}

                                            <div className="offre-card-footer">
                                                <div className="offre-card-price">
                                                    {service?.oldPrix && (
                                                        <span className="offre-card-old-price">{service.oldPrix} MAD</span>
                                                    )}
                                                    <span className="offre-card-current-price">{service?.prix} MAD</span>
                                                    <span className="offre-card-period">/pers</span>
                                                </div>
                                            </div>

                                            <div className="offre-card-buttons">
                                                <a
                                                    href={`/${item.type}s/${item.id}`}
                                                    className="offre-card-btn-details"
                                                >
                                                    <Eye size={16} />
                                                    Détails
                                                </a>
                                                <Link
                                                    to={`/${item.type}s/${service?.id}/reserver`}
                                                    className="offre-card-btn-reserve"
                                                >
                                                    Réserver
                                                    <ChevronRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
