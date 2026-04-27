import { Link } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
    Plane, Calendar, MapPin, CreditCard, Shield, Headphones, Globe,
    Search, ArrowRight, Loader2, Star, X, Eye
} from "lucide-react";
import "./billets.css";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";

export default function VolsBillets() {
    const { billets, getBillets, billetsMeta, loadingBillets } = useAuth();
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [tripType, setTripType] = useState("aller_retour");
    const [filters, setFilters] = useState({
        from: "",
        to: "",
        departure: "",
        return: ""
    });
    const [filteredResults, setFilteredResults] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    // ✅ جلب البيانات الأولية (الصفحة 1)
    useEffect(() => {
        const fetchData = async () => {
            setInitialLoading(true);
            await getBillets(1);
            setInitialLoading(false);
        };
        fetchData();
    }, []);

    // ✅ تحميل المزيد
    const loadMore = useCallback(async () => {
        if (loadingMore || !billetsMeta || billetsMeta.current_page >= billetsMeta.last_page) return;
        setLoadingMore(true);
        await getBillets(billetsMeta.current_page + 1);
        setLoadingMore(false);
    }, [loadingMore, billetsMeta, getBillets]);

    // ✅ فلترة النتائج
    useEffect(() => {
        if (billets && billets.length > 0) {
            filterBillets();
        }
    }, [billets, filters, tripType]);

    const filterBillets = () => {
        let results = [...billets];

        if (filters.from) {
            results = results.filter(b =>
                b.from?.toLowerCase().includes(filters.from.toLowerCase())
            );
        }
        if (filters.to) {
            results = results.filter(b =>
                b.to?.toLowerCase().includes(filters.to.toLowerCase())
            );
        }
        if (filters.departure) {
            results = results.filter(b => b.departure === filters.departure);
        }
        if (tripType === "aller_retour" && filters.return) {
            results = results.filter(b => b.return === filters.return);
        }
        if (tripType === "aller_simple") {
            results = results.filter(b => b.type === "aller_simple");
        } else {
            results = results.filter(b => b.type === "aller_retour");
        }

        setFilteredResults(results);
    };

    const resetFilters = () => {
        setFilters({ from: "", to: "", departure: "", return: "" });
        setTripType("aller_retour");
    };

    const villes = useMemo(() => {
        if (!billets || billets.length === 0) return [];
        const villesSet = new Set();
        billets.forEach(b => {
            if (b.from) villesSet.add(b.from);
            if (b.to) villesSet.add(b.to);
        });
        return Array.from(villesSet).sort();
    }, [billets]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
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

    if (initialLoading) {
        return (
            <div className="vols-loading">
                <div className="vols-loading-spinner"></div>
                <p>Chargement des vols...</p>
            </div>
        );
    }

    return (
        <div className="vols-page">
            {/* Hero Section */}
            <div className="vols-hero">
                <div className="vols-hero-overlay"></div>
                <div className="vols-hero-content">
                    <h1 className="vols-hero-title">Vols & billets</h1>
                    <p className="vols-hero-subtitle">
                        Réservez vos billets d'avion aux meilleurs prix
                    </p>
                </div>
            </div>

            {/* Search Section */}
            <div className="vols-search">
                <div className="vols-search-container">
                    <h3 className="vols-search-title">Rechercher un vol</h3>

                    <div className="vols-trip-type">
                        <button
                            className={`vols-trip-btn ${tripType === "aller_simple" ? "active" : ""}`}
                            onClick={() => setTripType("aller_simple")}
                        >
                            Aller simple
                        </button>
                        <button
                            className={`vols-trip-btn ${tripType === "aller_retour" ? "active" : ""}`}
                            onClick={() => setTripType("aller_retour")}
                        >
                            Aller retour
                        </button>
                    </div>

                    <div className="vols-search-form">
                        <div className="vols-input-group">
                            <label>Départ</label>
                            <div className="vols-input-wrapper">
                                <MapPin size={18} className="vols-input-icon" />
                                <input
                                    type="text"
                                    value={filters.from}
                                    onChange={(e) => setFilters({...filters, from: e.target.value})}
                                    placeholder="Ville de départ"
                                    list="villes-depart"
                                />
                                <datalist id="villes-depart">
                                    {villes.map((ville, i) => (
                                        <option key={i} value={ville} />
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        <div className="vols-input-group">
                            <label>Destination</label>
                            <div className="vols-input-wrapper">
                                <MapPin size={18} className="vols-input-icon" />
                                <input
                                    type="text"
                                    value={filters.to}
                                    onChange={(e) => setFilters({...filters, to: e.target.value})}
                                    placeholder="Ville d'arrivée"
                                    list="villes-dest"
                                />
                                <datalist id="villes-dest">
                                    {villes.map((ville, i) => (
                                        <option key={i} value={ville} />
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        <div className="vols-input-group">
                            <label>Date de départ</label>
                            <div className="vols-input-wrapper">
                                <Calendar size={18} className="vols-input-icon" />
                                <input
                                    type="date"
                                    value={filters.departure}
                                    onChange={(e) => setFilters({...filters, departure: e.target.value})}
                                />
                            </div>
                        </div>

                        {tripType === "aller_retour" && (
                            <div className="vols-input-group">
                                <label>Date de retour</label>
                                <div className="vols-input-wrapper">
                                    <Calendar size={18} className="vols-input-icon" />
                                    <input
                                        type="date"
                                        value={filters.return}
                                        onChange={(e) => setFilters({...filters, return: e.target.value})}
                                    />
                                </div>
                            </div>
                        )}

                        <button className="vols-search-btn" onClick={filterBillets}>
                            <Search size={18} />
                            Rechercher
                        </button>
                    </div>

                    {(filters.from || filters.to || filters.departure || filters.return) && (
                        <div className="vols-active-filters">
                            <span className="vols-filters-label">Filtres actifs:</span>
                            {filters.from && <span className="vols-filter-badge">{filters.from} ✈️</span>}
                            {filters.to && <span className="vols-filter-badge">{filters.to} 📍</span>}
                            <button onClick={resetFilters} className="vols-clear-filters">
                                <X size={14} /> Effacer
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Section */}
            <div className="vols-results">
                <div className="vols-results-header">
                    <h2 className="vols-results-title">
                        {filteredResults.length > 0 ?
                            `${filteredResults.length} vol(s) disponible(s)` :
                            "Aucun vol disponible"}
                    </h2>
                </div>

                {filteredResults.length === 0 ? (
                    <div className="vols-no-results">
                        <div className="vols-no-results-icon">✈️</div>
                        <h3>Aucun vol trouvé</h3>
                        <p>Aucun vol ne correspond à vos critères de recherche</p>
                        <button onClick={resetFilters} className="vols-reset-btn">
                            Réinitialiser les filtres
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="vols-grid">
                            {filteredResults.map((vol) => {
                                const daysCount = getDaysCount(vol.departure, vol.return);
                                return (
                                    <div key={vol.id} className="vols-card">
                                        <div className="vols-card-header">
                                            <div className="vols-airline">
                                                <div className="vols-airline-icon">
                                                    <Plane size={28} />
                                                </div>
                                                <div>
                                                    <h4 className="vols-airline-name">{vol.name}</h4>
                                                    <div className="vols-route">
                                                        <span>{vol.from}</span>
                                                        <ArrowRight size={14} />
                                                        <span>{vol.to}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="vols-price">
                                                <span className="vols-price-label">À partir de</span>
                                                <span className="vols-price-value">{vol.price} DH</span>
                                            </div>
                                        </div>

                                        <div className="vols-card-info">
                                            <div className="vols-info-row">
                                                <div className="vols-info-item">
                                                    <Calendar size={16} />
                                                    <span>Départ: {formatDate(vol.departure)}</span>
                                                </div>
                                                {vol.return && (
                                                    <div className="vols-info-item">
                                                        <Calendar size={16} />
                                                        <span>Retour: {formatDate(vol.return)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="vols-type-badge">
                                                <span className={vol.type === 'aller_simple' ? 'vols-type-simple' : 'vols-type-round'}>
                                                    {vol.type === 'aller_simple' ? 'Aller simple' : `Aller retour (${daysCount} jours)`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="vols-card-buttons">
                                            <Link to={`/billets/${vol.id}`} className="vols-btn-details">
                                                <Eye size={16} />
                                                Détails
                                            </Link>
                                            <Link to={`/reserver/vol/${vol.id}`} className="vols-btn-book">
                                                <CreditCard size={16} />
                                                Réserver
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ✅ Load More Button */}
                        {billetsMeta && billetsMeta.current_page < billetsMeta.last_page && (
                            <div className="vols-load-more">
                                <button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="vols-load-more-btn"
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Chargement...
                                        </>
                                    ) : (
                                        <>
                                            Voir plus de vols
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Airlines Section */}
            <div className="vols-airlines">
                <div className="vols-section-header">
                    <h2>Nos compagnies partenaires</h2>
                    <p>Les meilleures compagnies aériennes à votre service</p>
                </div>
                <div className="vols-airlines-grid">
                    {airlines.map((airline, index) => (
                        <div key={index} className="vols-airline-card">
                            <span className="vols-airline-logo">{airline.logo}</span>
                            <span className="vols-airline-name">{airline.name}</span>
                            <span className="vols-airline-code">{airline.code}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <div className="vols-features">
                <div className="vols-section-header">
                    <h2>Pourquoi réserver avec nous ?</h2>
                </div>
                <div className="vols-features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="vols-feature-card">
                            <div className="vols-feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="vols-cta">
                <h3>Besoin d'un vol pas cher ?</h3>
                <p>Contactez-nous pour les meilleures offres</p>
                <Link to="/contact" className="vols-cta-btn">
                    Demander un devis
                </Link>
            </div>
        </div>
    );
}
