import { MapPin, Star, Clock, Users, Calendar, ArrowRight, Eye, CreditCard, Loader2 } from "lucide-react";
import "./styles/featuredTrips.css";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function FeaturedTrips() {
  const { voyages, getVoyages } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchVoyages = async () => {
      await getVoyages(1);
    };
    fetchVoyages();
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

  const displayedTrips = voyages.slice(0, 5);

  if (displayedTrips.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className={`featured-trips ${isVisible ? "visible" : ""}`}
    >
      <div className="featured-trips-container">
        {/* Header */}
        <div className="featured-trips-header">
          <span className="featured-badge">Voyages en vedette</span>
          <h2 className="featured-title">
            Découvrez nos offres de voyages exceptionnelles
          </h2>
          <p className="featured-subtitle">
            Des destinations uniques pour des souvenirs inoubliables
          </p>
        </div>

        {/* Trips Grid */}
        <div className="featured-grid">
          {displayedTrips.map((trip, index) => (
            <div
              key={trip.id}
              className="trip-card"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="trip-image">
                <img src={trip.image} alt={trip.destination} />
                <div className="trip-overlay"></div>

                {/* Featured Badge */}
                {trip.featured === 1 && (
                  <span className="trip-featured">
                    <Star className="w-3 h-3" />
                    En vedette
                  </span>
                )}

                {/* Discount Badge */}
                {trip.oldPrix && trip.oldPrix > trip.prix && (
                  <span className="trip-discount">
                    -{Math.round(((trip.oldPrix - trip.prix) / trip.oldPrix) * 100)}%
                  </span>
                )}

                {/* Price Tag */}
                <div className="trip-price-tag">
                  {trip.oldPrix && (
                    <span className="trip-price-old">{trip.oldPrix}DH</span>
                  )}
                  <span className="trip-price-new">{trip.prix}DH</span>
                  <span className="trip-price-period">/pers</span>
                </div>
              </div>

              {/* Content */}
              <div className="trip-content">
                {/* Destination */}
                <div className="trip-destination">
                  <MapPin className="w-4 h-4" />
                  <span>{trip.destination}, {trip.pays}</span>
                </div>

                {/* Title */}
                <h3 className="trip-title">{trip.nomServ}</h3>

                {/* Details */}
                <div className="trip-details">
                  <div className="trip-detail">
                    <Clock className="w-4 h-4" />
                    <span>{trip.duree || trip.duration || "7 jours"}</span>
                  </div>
                  <div className="trip-detail">
                    <Users className="w-4 h-4" />
                    <span>{trip.groupSize || "2 personnes"}</span>
                  </div>
                  <div className="trip-detail">
                    <Calendar className="w-4 h-4" />
                    <span>Disponible</span>
                  </div>
                </div>

                {/* Buttons Group */}
                <div className="trip-buttons">
                  <Link to={`/voyages/${trip.id}`} className="trip-btn-details">
                    <Eye className="w-4 h-4" />
                    Détails
                  </Link>
                  <Link to={`/voyages/${trip.id}/reserver`} className="trip-btn-book">
                    <CreditCard className="w-4 h-4" />
                    Réserver
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="featured-footer">
          <Link to="/services/circuits" className="featured-view-all">
            Tous les voyages
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
