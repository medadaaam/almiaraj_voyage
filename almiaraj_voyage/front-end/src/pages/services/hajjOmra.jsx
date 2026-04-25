// src/pages/services/HajjOmra.jsx
import { Link } from "react-router-dom";
import {
  Calendar, Users, MapPin, Clock, Phone, Mail, Star, CheckCircle,
  Search, X, Filter, ArrowRight, CreditCard, Shield, Heart, Compass,
  Hotel, Bus, Coffee, Sun, Moon, Plane
} from "lucide-react";
import "./omra.css";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useMemo } from "react";

export default function HajjOmra() {
  const { hajjOmras, getHajjOmras } = useAuth();
  const [loading, setLoading] = useState(true);

  // ✅ State للبحث
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    const fetchHajjOmras = async () => {
      setLoading(true);
      await getHajjOmras();
      setLoading(false);
    };
    fetchHajjOmras();
  }, []);

  // ✅ خيارات المدة
  const durationOptions = [
    { value: "", label: "Toutes les durées" },
    { value: "10-15", label: "10 - 15 jours" },
    { value: "15-20", label: "15 - 20 jours" },
    { value: "20-25", label: "20 - 25 jours" },
    { value: "25+", label: "Plus de 25 jours" }
  ];

  // ✅ خيارات الأسعار
  const priceRanges = [
    { value: "", label: "Tous les prix" },
    { value: "0-5000", label: "Moins de 5000 DH" },
    { value: "5000-8000", label: "5000 - 8000 DH" },
    { value: "8000-12000", label: "8000 - 12000 DH" },
    { value: "12000+", label: "Plus de 12000 DH" }
  ];

  // ✅ فلترة العروض
  const filteredPackages = useMemo(() => {
    if (!hajjOmras) return [];

    let results = [...hajjOmras];

    // ✅ فلترة حسب الكلمة المدخلة
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(pkg =>
        pkg.title?.toLowerCase().includes(term) ||
        pkg.hotel?.toLowerCase().includes(term) ||
        pkg.transport?.toLowerCase().includes(term)
      );
    }

    // ✅ فلترة حسب المدة
    if (selectedDuration) {
      if (selectedDuration === "10-15") {
        results = results.filter(pkg => {
          const days = parseInt(pkg.duration);
          return days >= 10 && days <= 15;
        });
      } else if (selectedDuration === "15-20") {
        results = results.filter(pkg => {
          const days = parseInt(pkg.duration);
          return days >= 15 && days <= 20;
        });
      } else if (selectedDuration === "20-25") {
        results = results.filter(pkg => {
          const days = parseInt(pkg.duration);
          return days >= 20 && days <= 25;
        });
      } else if (selectedDuration === "25+") {
        results = results.filter(pkg => {
          const days = parseInt(pkg.duration);
          return days >= 25;
        });
      }
    }

    // ✅ فلترة حسب السعر
    if (selectedPriceRange) {
      if (selectedPriceRange === "0-5000") {
        results = results.filter(pkg => pkg.price < 5000);
      } else if (selectedPriceRange === "5000-8000") {
        results = results.filter(pkg => pkg.price >= 5000 && pkg.price <= 8000);
      } else if (selectedPriceRange === "8000-12000") {
        results = results.filter(pkg => pkg.price >= 8000 && pkg.price <= 12000);
      } else if (selectedPriceRange === "12000+") {
        results = results.filter(pkg => pkg.price >= 12000);
      }
    }

    // ✅ فلترة حسب النوع (Hajj/Omra)
    if (selectedType === "omra") {
      results = results.filter(pkg => pkg.title?.toLowerCase().includes("omra"));
    } else if (selectedType === "hajj") {
      results = results.filter(pkg => pkg.title?.toLowerCase().includes("hajj"));
    }

    // ✅ ترتيب النتائج
    if (sortBy === "price_asc") {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      results.sort((a, b) => b.price - a.price);
    } else if (sortBy === "duration") {
      results.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
    }

    return results;
  }, [hajjOmras, searchTerm, selectedDuration, selectedPriceRange, sortBy, selectedType]);

  // ✅ إعادة ضبط البحث
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDuration("");
    setSelectedPriceRange("");
    setSortBy("default");
    setSelectedType("all");
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

  // ✅ استخراج الخدمات الفريدة للـ autocomplete
  const getUniqueValues = () => {
    if (!hajjOmras) return [];
    const values = new Set();
    hajjOmras.forEach(pkg => {
      if (pkg.title) values.add(pkg.title);
      if (pkg.hotel) values.add(pkg.hotel);
    });
    return Array.from(values).sort();
  };

  const suggestions = getUniqueValues();

  if (loading) {
    return (
      <div className="service-loading">
        <div className="service-loading-spinner"></div>
        <p>Chargement des offres...</p>
      </div>
    );
  }

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

      {/* ✅ Search Bar Section */}
      <div className="hajj-search-section">
        <div className="hajj-search-container">
          <div className="hajj-search-wrapper">
            <div className="hajj-search-input-wrapper">
              <Search className="hajj-search-icon" />
              <input
                type="text"
                placeholder="Rechercher un forfait Hajj ou Omra..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="hajj-search-input"
                list="hajj-suggestions"
              />
              <datalist id="hajj-suggestions">
                {suggestions.map((item, i) => (
                  <option key={i} value={item} />
                ))}
              </datalist>
              {searchTerm && (
                <button className="hajj-search-clear" onClick={() => setSearchTerm("")}>
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              className={`hajj-filter-toggle ${selectedDuration || selectedPriceRange || selectedType !== "all" ? "active" : ""}`}
              onClick={() => document.querySelector('.hajj-filters-panel')?.classList.toggle('show')}
            >
              <Filter size={16} />
              Filtres
            </button>
          </div>

          {/* Filtres avancés */}
          <div className="hajj-filters-panel show">
            <div className="hajj-filter-group">
              <label className="hajj-filter-label">🕋 Type de pèlerinage</label>
              <div className="hajj-type-buttons">
                <button
                  className={`hajj-type-btn ${selectedType === "all" ? "active" : ""}`}
                  onClick={() => setSelectedType("all")}
                >
                  Tous
                </button>
                <button
                  className={`hajj-type-btn ${selectedType === "hajj" ? "active" : ""}`}
                  onClick={() => setSelectedType("hajj")}
                >
                  Hajj
                </button>
                <button
                  className={`hajj-type-btn ${selectedType === "omra" ? "active" : ""}`}
                  onClick={() => setSelectedType("omra")}
                >
                  Omra
                </button>
              </div>
            </div>

            <div className="hajj-filter-group">
              <label className="hajj-filter-label">⏱️ Durée du séjour</label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="hajj-filter-select"
              >
                {durationOptions.map((opt, i) => (
                  <option key={i} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="hajj-filter-group">
              <label className="hajj-filter-label">💰 Prix par personne</label>
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="hajj-filter-select"
              >
                {priceRanges.map((range, i) => (
                  <option key={i} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            <div className="hajj-filter-group">
              <label className="hajj-filter-label">📊 Trier par</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="hajj-filter-select"
              >
                <option value="default">Par défaut</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="duration">Durée la plus courte</option>
              </select>
            </div>

            {(selectedDuration || selectedPriceRange || sortBy !== "default" || selectedType !== "all") && (
              <button onClick={resetFilters} className="hajj-filter-reset">
                Réinitialiser les filtres
              </button>
            )}
          </div>

          {/* Résultats count */}
          <div className="hajj-results-count">
            <p>{filteredPackages.length} forfait(s) trouvé(s)</p>
          </div>
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

        {filteredPackages.length === 0 ? (
          <div className="hajj-no-results">
            <Compass size={48} className="hajj-no-results-icon" />
            <h3>Aucun forfait trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
            <button onClick={resetFilters} className="hajj-no-results-btn">
              Voir tous les forfaits
            </button>
          </div>
        ) : (
          <div className="service-packages-grid">
            {filteredPackages.map((pkg) => {
              const discount = getDiscountPercent(pkg.oldPrice, pkg.price);
              return (
                <div key={pkg.id} className="service-package-card">
                  {discount > 0 && (
                    <span className="service-package-badge">-{discount}%</span>
                  )}

                  {/* Type Badge */}
                  <span className={`service-package-type ${pkg.title?.toLowerCase().includes("hajj") ? "hajj" : "omra"}`}>
                    {pkg.title?.toLowerCase().includes("hajj") ? "🕋 Hajj" : "🕌 Omra"}
                  </span>

                  <h3 className="service-package-title">{pkg.title}</h3>

                  <div className="service-package-price">
                    {pkg.oldPrice && (
                      <span className="service-package-old">{formatPrice(pkg.oldPrice)} DH</span>
                    )}
                    <span className="service-package-new">{formatPrice(pkg.price)} DH</span>
                    <span className="service-package-period">/pers</span>
                  </div>

                  <ul className="service-package-features">
                    <li><Calendar size={16} /> Départ: {pkg.depart}</li>
                    <li><Clock size={16} /> Durée: {pkg.duration}</li>
                    <li><Users size={16} /> Groupe: {pkg.groupSize}</li>
                    <li><Hotel size={16} /> Hébergement: {pkg.hotel}</li>
                    <li><Bus size={16} /> Transport: {pkg.transport}</li>
                    <li><Coffee size={16} /> Repas: {pkg.meals}</li>
                  </ul>

                  <div className="service-package-footer">
                    <span className="service-package-tag">Guide inclus</span>
                    <span className="service-package-tag">Visites guidées</span>
                    <span className="service-package-tag">Assistance 24/7</span>
                  </div>

                  <div className="service-package-buttons">
                    <Link to={`/hajj-omra/${pkg.id}`} className="service-package-details">
                      Voir détails
                    </Link>
                    <Link to="/contact" className="service-package-btn">
                      Demander un devis
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
