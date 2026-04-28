// src/pages/services/HotelsSejours.jsx
import { Link } from "react-router-dom";
import {
  Hotel,
  Wifi,
  Coffee,
  Waves,
  Dumbbell,
  Utensils,
  Car,
  Star,
  MapPin,
  Users,
  Calendar,
  Eye,
  CreditCard,
  ArrowRight,
  Clock,
  CheckCircle,
  Shield,
  Search,
  X,
  Loader2
} from "lucide-react";
import "./hotels.css";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useMemo, useCallback } from "react";

export default function HotelsSejours() {
  const { hotels, getHotels, hotelsMeta, loadingHotels } = useAuth();
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // ✅ State للبحث
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // ✅ جلب البيانات الأولية (الصفحة 1)
  useEffect(() => {
    const fetchHotels = async () => {
      setInitialLoading(true);
      await getHotels(1);
      setInitialLoading(false);
    };
    fetchHotels();
  }, []);

  // ✅ تحميل المزيد
  const loadMore = useCallback(async () => {
    if (loadingMore || hotelsMeta.current_page >= hotelsMeta.last_page) return;
    setLoadingMore(true);
    await getHotels(hotelsMeta.current_page + 1);
    setLoadingMore(false);
  }, [loadingMore, hotelsMeta, getHotels]);

  // ✅ استخراج المدن للـ datalist
  const locations = useMemo(() => {
    if (!hotels) return [];
    const locs = new Set();
    hotels.forEach(hotel => {
      if (hotel.location) locs.add(hotel.location);
    });
    return Array.from(locs).sort();
  }, [hotels]);

  // ✅ فلترة الفنادق
  const filteredHotels = useMemo(() => {
    if (!hotels) return [];

    let results = [...hotels];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(hotel =>
        hotel.name?.toLowerCase().includes(term) ||
        hotel.location?.toLowerCase().includes(term)
      );
    }

    if (selectedLocation) {
      results = results.filter(hotel => hotel.location === selectedLocation);
    }

    if (selectedPriceRange) {
      if (selectedPriceRange === "500") {
        results = results.filter(hotel => hotel.prix < 500);
      } else if (selectedPriceRange === "500-700") {
        results = results.filter(hotel => hotel.prix >= 500 && hotel.prix <= 700);
      } else if (selectedPriceRange === "700-1000") {
        results = results.filter(hotel => hotel.prix >= 700 && hotel.prix <= 1000);
      } else if (selectedPriceRange === "1000+") {
        results = results.filter(hotel => hotel.prix >= 1000);
      }
    }

    return results;
  }, [hotels, searchTerm, selectedLocation, selectedPriceRange]);

  const resetSearch = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setSelectedPriceRange("");
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

  const getAmenityIcon = (amenity) => {
    const icons = {
      Wifi: <Wifi className="w-3 h-3" />,
      Piscine: <Waves className="w-3 h-3" />,
      Spa: <Waves className="w-3 h-3" />,
      "Petit-déjeuner": <Coffee className="w-3 h-3" />,
      Restaurant: <Utensils className="w-3 h-3" />,
    };
    return icons[amenity] || <Coffee className="w-3 h-3" />;
  };

  const features = [
    { icon: <Shield />, title: "Paiement sécurisé", desc: "Transactions 100% sécurisées" },
    { icon: <CheckCircle />, title: "Meilleur prix garanti", desc: "Prix compétitifs" },
    { icon: <Clock />, title: "Annulation hotel", desc: "Jusqu'à 15 jours avant" },
    { icon: <Users />, title: "Support 24/7", desc: "Assistance à tout moment" }
  ];

  const priceRanges = [
    { value: "", label: "Tous les prix" },
    { value: "500", label: "Moins de 500 DH" },
    { value: "500-700", label: "500 - 700 DH" },
    { value: "700-1000", label: "700 - 1000 DH" },
    { value: "1000+", label: "Plus de 1000 DH" }
  ];

  if (initialLoading) {
    return (
      <div className="hotels-loading">
        <div className="hotels-loading-spinner"></div>
        <p>Chargement des hôtels...</p>
      </div>
    );
  }

  return (
    <div className="hotels-page">
      {/* Hero Section */}
      <div className="hotels-hero">
        <div className="hotels-hero-overlay"></div>
        <div className="hotels-hero-content">
          <h1 className="hotels-hero-title">Hôtels & séjours</h1>
          <p className="hotels-hero-subtitle">
            Découvrez notre sélection d'hôtels pour un séjour parfait
          </p>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="hotels-search-section">
        <div className="hotels-search-container">
          <div className="hotels-search-wrapper">
            <div className="hotels-search-input-wrapper">
              <Search className="hotels-search-icon" />
              <input
                type="text"
                placeholder="Rechercher un hôtel par nom ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="hotels-search-input"
                list="hotels-locations"
              />
              <datalist id="hotels-locations">
                {locations.map((loc, i) => (
                  <option key={i} value={loc} />
                ))}
              </datalist>
              {searchTerm && (
                <button className="hotels-search-clear" onClick={() => setSearchTerm("")}>
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              className={`hotels-filter-toggle ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtres
            </button>
          </div>

          {showFilters && (
            <div className="hotels-filters-panel">
              <div className="hotels-filter-group">
                <label className="hotels-filter-label">📍 Ville</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="hotels-filter-select"
                >
                  <option value="">Toutes les villes</option>
                  {locations.map((loc, i) => (
                    <option key={i} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="hotels-filter-group">
                <label className="hotels-filter-label">💰 Prix par nuit</label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="hotels-filter-select"
                >
                  {priceRanges.map((range, i) => (
                    <option key={i} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              {(selectedLocation || selectedPriceRange) && (
                <button onClick={resetSearch} className="hotels-filter-reset">
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          )}

          <div className="hotels-results-count">
            <p>{filteredHotels.length} hôtel(s) trouvé(s)</p>
          </div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="hotels-section">
        <div className="hotels-section-header">
          <h2>Nos hôtels partenaires</h2>
          <p>Des établissements d'exception pour tous les budgets</p>
        </div>

        {filteredHotels.length === 0 ? (
          <div className="hotels-no-results">
            <Hotel size={48} className="hotels-no-results-icon" />
            <h3>Aucun hôtel trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
            <button onClick={resetSearch} className="hotels-no-results-btn">
              Voir tous les hôtels
            </button>
          </div>
        ) : (
          <>
            <div className="hotels-grid">
              {filteredHotels.map((hotel) => (
                <div key={hotel.id} className="hotels-card">
                  <div className="hotels-card-image">
                    <img src={hotel.image} alt={hotel.name} />
                    <div className="hotels-card-overlay"></div>

                    {hotel.enVedette === 1 && (
                      <span className="hotels-card-badge featured">
                        <Star className="w-3 h-3" />
                        Recommandé
                      </span>
                    )}

                    {hotel.oldPrix && hotel.oldPrix > hotel.prix && (
                      <span className="hotels-card-badge discount">
                        -{Math.round(((hotel.oldPrix - hotel.prix) / hotel.oldPrix) * 100)}%
                      </span>
                    )}

                    <div className="hotels-card-price">
                      {hotel.oldPrix && (
                        <span className="hotels-card-price-old">{hotel.oldPrix}DH</span>
                      )}
                      <span className="hotels-card-price-new">{hotel.prix}DH</span>
                      <span className="hotels-card-price-period">/nuit</span>
                    </div>
                  </div>

                  <div className="hotels-card-content">
                    <div className="hotels-card-location">
                      <MapPin className="w-4 h-4" />
                      <span>{hotel.location}</span>
                    </div>

                    <h3 className="hotels-card-title">{hotel.name}</h3>

                    {hotel.rating && (
                      <div className="hotels-card-rating">
                        <div className="hotels-card-stars">
                          {renderStars(parseFloat(hotel.rating))}
                        </div>
                      </div>
                    )}

                    <div className="hotels-card-amenities">
                      {hotel.amenities?.slice(0, 4).map((amenity, i) => (
                        <span key={i} className="hotels-card-amenity">
                          {getAmenityIcon(amenity)}
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className="hotels-card-footer">
                      <div className="hotels-card-buttons">
                        <Link to={`/hotels/${hotel.id}`} className="hotels-card-btn details">
                          <Eye size={16} />
                          Détails
                        </Link>
                        <Link to={`/hotels/${hotel.id}/reserver`} className="hotels-card-btn book">
                          <CreditCard size={16} />
                          Réserver
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Load More Button */}
            {hotelsMeta.current_page < hotelsMeta.last_page && (
              <div className="hotels-load-more">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="hotels-load-more-btn"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    <>
                      Voir plus d'hôtels
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Features Section */}
      <div className="hotels-features">
        <div className="hotels-features-header">
          <h2>Pourquoi réserver avec nous ?</h2>
        </div>
        <div className="hotels-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="hotels-feature-card">
              <div className="hotels-feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="hotels-cta">
        <h3>Offre spéciale séjour longue durée ?</h3>
        <p>Contactez-nous pour des tarifs préférentiels</p>
        <Link to="/contact" className="hotels-cta-btn">
          Nous contacter
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
