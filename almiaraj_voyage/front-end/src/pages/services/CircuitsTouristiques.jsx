// src/pages/services/CircuitsTouristiques.jsx
import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Camera,
  Mountain,
  Umbrella,
  Landmark,
  CreditCard,
  Calendar,
  Eye,
  ArrowRight,
  Compass,
  Heart,
  Shield,
  CheckCircle,
  Search,
  X,
  Filter
} from "lucide-react";
import "./voyages.css";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useMemo } from "react";

export default function CircuitsTouristiques() {
  const { voyages, getVoyages } = useAuth();
  const [loading, setLoading] = useState(true);

  // ✅ State للبحث
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchVoyages = async () => {
      setLoading(true);
      await getVoyages();
      setLoading(false);
    };
    fetchVoyages();
  }, []);

  // ✅ استخراج الوجهات للـ datalist
  const destinations = useMemo(() => {
    if (!voyages) return [];
    const dests = new Set();
    voyages.forEach(voyage => {
      if (voyage.destination) dests.add(voyage.destination);
      if (voyage.pays) dests.add(voyage.pays);
    });
    return Array.from(dests).sort();
  }, [voyages]);

  // ✅ خيارات المدة
  const durationOptions = [
    { value: "", label: "Toutes les durées" },
    { value: "3-5", label: "3 - 5 jours" },
    { value: "5-7", label: "5 - 7 jours" },
    { value: "7-10", label: "7 - 10 jours" },
    { value: "10+", label: "Plus de 10 jours" }
  ];

  // ✅ خيارات الأسعار
  const priceRanges = [
    { value: "", label: "Tous les prix" },
    { value: "0-2000", label: "Moins de 2000 DH" },
    { value: "2000-3500", label: "2000 - 3500 DH" },
    { value: "3500-5000", label: "3500 - 5000 DH" },
    { value: "5000+", label: "Plus de 5000 DH" }
  ];

  // ✅ فلترة الرحلات
  const filteredVoyages = useMemo(() => {
    if (!voyages) return [];

    let results = [...voyages];

    // فلترة حسب الكلمة المدخلة
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(voyage =>
        voyage.nomServ?.toLowerCase().includes(term) ||
        voyage.destination?.toLowerCase().includes(term) ||
        voyage.pays?.toLowerCase().includes(term) ||
        voyage.description?.toLowerCase().includes(term)
      );
    }

    // فلترة حسب الوجهة
    if (selectedDestination) {
      results = results.filter(voyage =>
        voyage.destination?.toLowerCase().includes(selectedDestination.toLowerCase()) ||
        voyage.pays?.toLowerCase().includes(selectedDestination.toLowerCase())
      );
    }

    // ✅ فلترة حسب المدة (أيام)
    if (selectedDuration) {
      if (selectedDuration === "3-5") {
        results = results.filter(voyage => {
          const duree = voyage.duree || 7;
          return duree >= 3 && duree <= 5;
        });
      } else if (selectedDuration === "5-7") {
        results = results.filter(voyage => {
          const duree = voyage.duree || 7;
          return duree >= 5 && duree <= 7;
        });
      } else if (selectedDuration === "7-10") {
        results = results.filter(voyage => {
          const duree = voyage.duree || 7;
          return duree >= 7 && duree <= 10;
        });
      } else if (selectedDuration === "10+") {
        results = results.filter(voyage => {
          const duree = voyage.duree || 7;
          return duree >= 10;
        });
      }
    }

    // ✅ فلترة حسب السعر
    if (selectedPriceRange) {
      if (selectedPriceRange === "0-2000") {
        results = results.filter(voyage => voyage.prix < 2000);
      } else if (selectedPriceRange === "2000-3500") {
        results = results.filter(voyage => voyage.prix >= 2000 && voyage.prix <= 3500);
      } else if (selectedPriceRange === "3500-5000") {
        results = results.filter(voyage => voyage.prix >= 3500 && voyage.prix <= 5000);
      } else if (selectedPriceRange === "5000+") {
        results = results.filter(voyage => voyage.prix >= 5000);
      }
    }

    // ✅ ترتيب النتائج
    if (sortBy === "price_asc") {
      results.sort((a, b) => a.prix - b.prix);
    } else if (sortBy === "price_desc") {
      results.sort((a, b) => b.prix - a.prix);
    } else if (sortBy === "duration_asc") {
      results.sort((a, b) => (a.duree || 7) - (b.duree || 7));
    } else if (sortBy === "rating") {
      results.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
    }

    return results;
  }, [voyages, searchTerm, selectedDestination, selectedDuration, selectedPriceRange, sortBy]);

  // ✅ إعادة ضبط البحث
  const resetSearch = () => {
    setSearchTerm("");
    setSelectedDestination("");
    setSelectedDuration("");
    setSelectedPriceRange("");
    setSortBy("default");
  };

  // ✅ تنسيق السعر
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  // ✅ حساب نسبة الخصم
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

  const features = [
    { icon: <Shield />, title: "Voyage sécurisé", desc: "Assistance 24/7" },
    { icon: <CheckCircle />, title: "Paiement flexible", desc: "Plusieurs options" },
    { icon: <Compass />, title: "Guide local", desc: "Accompagnement inclus" },
    { icon: <Heart />, title: "Satisfait ou remboursé", desc: "Garantie 100%" }
  ];

  if (loading) {
    return (
      <div className="circuits-loading">
        <div className="circuits-loading-spinner"></div>
        <p>Chargement des circuits...</p>
      </div>
    );
  }

  return (
    <div className="circuits-page">
      {/* Hero Section */}
      <div className="circuits-hero">
        <div className="circuits-hero-overlay"></div>
        <div className="circuits-hero-content">
          <h1 className="circuits-hero-title">Circuits touristiques</h1>
          <p className="circuits-hero-subtitle">
            Découvrez les plus belles destinations du monde
          </p>
        </div>
      </div>

      {/* ✅ Search Bar Section */}
      <div className="circuits-search-section">
        <div className="circuits-search-container">
          <div className="circuits-search-wrapper">
            <div className="circuits-search-input-wrapper">
              <Search className="circuits-search-icon" />
              <input
                type="text"
                placeholder="Rechercher un circuit par destination, pays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="circuits-search-input"
                list="circuits-destinations"
              />
              <datalist id="circuits-destinations">
                {destinations.map((dest, i) => (
                  <option key={i} value={dest} />
                ))}
              </datalist>
              {searchTerm && (
                <button className="circuits-search-clear" onClick={() => setSearchTerm("")}>
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              className={`circuits-filter-toggle ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filtres
            </button>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="circuits-filters-panel">
              <div className="circuits-filter-group">
                <label className="circuits-filter-label">📍 Destination</label>
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="circuits-filter-select"
                >
                  <option value="">Toutes les destinations</option>
                  {destinations.map((dest, i) => (
                    <option key={i} value={dest}>{dest}</option>
                  ))}
                </select>
              </div>

              <div className="circuits-filter-group">
                <label className="circuits-filter-label">⏱️ Durée du séjour</label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="circuits-filter-select"
                >
                  {durationOptions.map((opt, i) => (
                    <option key={i} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="circuits-filter-group">
                <label className="circuits-filter-label">💰 Prix par personne</label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="circuits-filter-select"
                >
                  {priceRanges.map((range, i) => (
                    <option key={i} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              <div className="circuits-filter-group">
                <label className="circuits-filter-label">📊 Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="circuits-filter-select"
                >
                  <option value="default">Par défaut</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="duration_asc">Durée la plus courte</option>
                  <option value="rating">Meilleure note</option>
                </select>
              </div>

              {(selectedDestination || selectedDuration || selectedPriceRange || sortBy !== "default") && (
                <button onClick={resetSearch} className="circuits-filter-reset">
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          )}

          {/* Résultats count */}
          <div className="circuits-results-count">
            <p>{filteredVoyages.length} circuit(s) trouvé(s)</p>
          </div>
        </div>
      </div>

      {/* Circuits Grid */}
      <div className="circuits-section">
        <div className="circuits-section-header">
          <h2>Nos circuits populaires</h2>
          <p>Des voyages organisés pour découvrir l'essentiel</p>
        </div>

        {filteredVoyages.length === 0 ? (
          <div className="circuits-no-results">
            <Compass size={48} className="circuits-no-results-icon" />
            <h3>Aucun circuit trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
            <button onClick={resetSearch} className="circuits-no-results-btn">
              Voir tous les circuits
            </button>
          </div>
        ) : (
          <div className="circuits-grid">
            {filteredVoyages.map((trip) => {
              const discount = getDiscountPercent(trip.oldPrix, trip.prix);
              return (
                <div key={trip.id} className="circuits-card">
                  {/* Image */}
                  <div className="circuits-card-image">
                    <img src={trip.image} alt={trip.destination} />
                    <div className="circuits-card-overlay"></div>

                    {trip.enVedette === 1 && (
                      <span className="circuits-card-badge featured">
                        <Star className="w-3 h-3" />
                        En vedette
                      </span>
                    )}

                    {discount > 0 && (
                      <span className="circuits-card-badge discount">
                        -{discount}%
                      </span>
                    )}

                    <div className="circuits-card-price">
                      {trip.oldPrix && (
                        <span className="circuits-card-price-old">{formatPrice(trip.oldPrix)}DH</span>
                      )}
                      <span className="circuits-card-price-new">{formatPrice(trip.prix)}DH</span>
                      <span className="circuits-card-price-period">/pers</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="circuits-card-content">
                    <div className="circuits-card-location">
                      <MapPin className="w-4 h-4" />
                      <span>{trip.destination}, {trip.pays}</span>
                    </div>

                    <h3 className="circuits-card-title">{trip.nomServ}</h3>


                    <div className="circuits-card-details">
                      <div className="circuits-card-detail">
                        <Clock className="w-4 h-4" />
                        <span>{trip.duree || 7} jours</span>
                      </div>
                      <div className="circuits-card-detail">
                        <Users className="w-4 h-4" />
                        <span>{trip.groupSize || 2} personnes</span>
                      </div>
                      <div className="circuits-card-detail">
                        <Calendar className="w-4 h-4" />
                        <span>Disponible</span>
                      </div>
                    </div>

                    <div className="circuits-card-buttons">
                      <a href={`/voyages/${trip.id}`} className="circuits-card-btn details">
                        <Eye size={16} />
                        Détails
                      </a>
                      <Link to={`/reserver/voyage/${trip.id}`} className="circuits-card-btn book">
                        <CreditCard size={16} />
                        Réserver
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="circuits-features">
        <div className="circuits-features-header">
          <h2>Pourquoi voyager avec nous ?</h2>
        </div>
        <div className="circuits-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="circuits-feature-card">
              <div className="circuits-feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="circuits-cta">
        <h3>Vous souhaitez un circuit personnalisé ?</h3>
        <p>Nos conseillers vous créent un voyage sur mesure</p>
        <Link to="/contact" className="circuits-cta-btn">
          Demander un devis
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
