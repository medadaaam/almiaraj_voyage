import { MapPin, Star, Wifi, Coffee, Car, Utensils, Waves, Dumbbell, ArrowRight, Clock, Users, Calendar, Eye, CreditCard, Loader2 } from "lucide-react";
import "./styles/featuredHotels.css";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function FeaturedHotels() {
    const { hotels, getHotels } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const fetchHotels = async () => {
            await getHotels(1);
        };
        fetchHotels();
    }, []);

    // ✅ مراقبة التمرير
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    } else {
                        setIsVisible(false);
                    }
                });
            },
            { threshold: 0.2, triggerOnce: false }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

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

    const getAmenityIcon = (amenity) => {
        const icons = {
            "Wifi": <Wifi className="w-3 h-3" />,
            "Piscine": <Waves className="w-3 h-3" />,
            "Spa": <Waves className="w-3 h-3" />,
            "Petit-déjeuner": <Coffee className="w-3 h-3" />,
            "Hamam": <Waves className="w-3 h-3" />,
            "Vue mer": <Waves className="w-3 h-3" />,
            "Restaurant": <Utensils className="w-3 h-3" />,
            "Aquapark": <Waves className="w-3 h-3" />,
            "Plage privée": <Waves className="w-3 h-3" />,
            "Business center": <Car className="w-3 h-3" />,
            "Restaurant étoilé": <Utensils className="w-3 h-3" />,
            "Concierge": <Users className="w-3 h-3" />
        };
        return icons[amenity] || <Coffee className="w-3 h-3" />;
    };

    // ✅ عرض أول 5 فنادق فقط
    const displayedHotels = hotels.slice(0, 5);

    if (displayedHotels.length === 0) {
        return null;
    }

    return (
        <section
            ref={sectionRef}
            className={`featured-hotels ${isVisible ? "visible" : ""}`}
        >
            <div className="featured-hotels-container">
                {/* Header */}
                <div className="featured-hotels-header">
                    <span className="featured-hotels-badge">Hébergements de luxe</span>
                    <h2 className="featured-hotels-title">
                        Découvrez nos hôtels partenaires
                    </h2>
                    <p className="featured-hotels-subtitle">
                        Des établissements d'exception pour un séjour inoubliable
                    </p>
                </div>

                {/* Hotels Grid */}
                <div className="hotels-grid">
                    {displayedHotels.map((hotel, index) => (
                        <div
                            key={hotel.id}
                            className="hotel-card"
                            style={{ transitionDelay: `${index * 0.1}s` }}
                        >
                            {/* Image */}
                            <div className="hotel-image">
                                <img src={`http://127.0.0.1:8000/storage/${hotel.image}`}  alt={hotel.name} />
                                <div className="hotel-overlay"></div>

                                {/* Featured Badge */}
                                {hotel.enVedette === 1 && (
                                    <span className="hotel-featured">
                                        <Star className="w-3 h-3" />
                                        Recommandé
                                    </span>
                                )}

                                {/* Discount Badge */}
                                {hotel.oldPrix && hotel.oldPrix > hotel.prix && (
                                    <span className="hotel-discount">
                                        -{Math.round(((hotel.oldPrix - hotel.prix) / hotel.oldPrix) * 100)}%
                                    </span>
                                )}

                                {/* Price Tag */}
                                <div className="hotel-price-tag">
                                    {hotel.oldPrix && (
                                        <span className="hotel-price-old">{hotel.oldPrix}DH</span>
                                    )}
                                    <span className="hotel-price-new">{hotel.prix}DH</span>
                                    <span className="hotel-price-period">/nuit</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="hotel-content">
                                {/* Location */}
                                <div className="hotel-location">
                                    <MapPin className="w-4 h-4" />
                                    <span>{hotel.location}</span>
                                </div>

                                {/* Title */}
                                <h3 className="hotel-title">{hotel.name}</h3>

                                {/* Rating */}
                                {hotel.rating && (
                                    <div className="hotel-rating">
                                        <div className="hotel-stars">{renderStars(parseFloat(hotel.rating))}</div>
                                    </div>
                                )}

                                {/* Amenities */}
                                <div className="hotel-amenities">
                                    {hotel.amenities?.slice(0, 4).map((amenity, i) => (
                                        <span key={i} className="hotel-amenity">
                                            {getAmenityIcon(amenity)}
                                            {amenity}
                                        </span>
                                    ))}
                                </div>

                                {/* Details */}
                                <div className="hotel-details">
                                    <div className="hotel-detail">
                                        <Calendar className="w-4 h-4" />
                                        <span>Disponible</span>
                                    </div>
                                </div>

                                {/* Buttons Group */}
                                <div className="hotel-buttons">
                                    <Link to={`/hotels/${hotel.id}`} className="hotel-btn-details">
                                        <Eye className="w-4 h-4" />
                                        Détails
                                    </Link>
                                    <Link to={`/hotels/${hotel.id}/reserver`} className="hotel-btn-book">
                                        <CreditCard className="w-4 h-4" />
                                        Réserver
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="featured-hotels-footer">
                    <Link to="/services/hotels" className="featured-hotels-view-all">
                        Tous les hôtels
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
