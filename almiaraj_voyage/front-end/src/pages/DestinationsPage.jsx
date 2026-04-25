import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Star,
  Compass,
  Search,
  Filter,
  X,
  ChevronDown,
} from "lucide-react";
import "./destinationsPage.css";
import { useAuth } from "@/context/AuthContext";

export default function DestinationsPage() {
  const { getDestination, destinations = [] } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    const fetchDestinations = async () => {
      await getDestination();
    };
    fetchDestinations();
  }, []);

  const uniqueDestinations = destinations.filter((dest, index, self) =>
    index === self.findIndex((d) => d.pays === dest.pays)
  );

  const uniqueContinents = [...new Set(uniqueDestinations.map(dest => dest.continente))];

  const filteredDestinations = uniqueDestinations.filter((dest) => {
    const matchesSearch =
      searchTerm === "" ||
      dest.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.pays?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesContinent =
      selectedContinent === "all" || dest.continente === selectedContinent;

    return matchesSearch && matchesContinent;
  });

  

  return (
    <div className="dest-page">
      {/* Hero Section */}
      <section className="dest-hero">
        <div className="dest-hero-overlay"></div>
        <div className="dest-hero-content">
          <h1 className="dest-hero-title">Nos Destinations</h1>
          <p className="dest-hero-subtitle">
            Explorez des destinations uniques à travers le monde
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="dest-search-section">
        <div className="dest-container">
          <div className="dest-search-wrapper">
            <div className="dest-search-input-wrapper">
              <Search className="dest-search-icon" />
              <input
                type="text"
                placeholder="Rechercher une destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dest-search-input"
              />
              {searchTerm && (
                <button
                  className="dest-search-clear"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              className="dest-filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filtrer
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {showFilters && (
            <div className="dest-filters-panel">
              <div className="dest-filter-group">
                <label className="dest-filter-label">Continent</label>
                <div className="dest-filter-buttons">
                  <button
                    className={`dest-filter-btn ${selectedContinent === "all" ? "active" : ""}`}
                    onClick={() => setSelectedContinent("all")}
                  >
                    Tous
                  </button>
                  {uniqueContinents.map((continent) => (
                    <button
                      key={continent}
                      className={`dest-filter-btn ${selectedContinent === continent ? "active" : ""}`}
                      onClick={() => setSelectedContinent(continent)}
                    >
                      {continent}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results Count */}
      <section className="dest-results-count">
        <div className="dest-container">
          <p>{filteredDestinations.length} destination(s) trouvée(s)</p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="dest-grid-section">
        <div className="dest-container">
          {filteredDestinations.length === 0 ? (
            <div className="dest-no-results">
              <Compass className="dest-no-results-icon" />
              <h3>Aucune destination trouvée</h3>
              <p>Essayez de modifier vos critères de recherche</p>
              <button
                className="dest-reset-btn"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedContinent("all");
                }}
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="dest-grid">
              {filteredDestinations.map((dest) => (
                <div key={dest.id} className="dest-card">
                  <div className="dest-card-image">
                    <img src={dest.image} alt={dest.nom} />
                    <div className="dest-card-overlay"></div>
                    {dest.en_vedette === 1 && (
                      <span className="dest-card-featured">
                        <Star className="w-3 h-3" />
                        Populaire
                      </span>
                    )}
                  </div>
                  <div className="dest-card-content">
                    <div className="dest-card-header">
                      <div className="dest-card-location">
                        <MapPin className="dest-location-icon" />
                        <span>{dest.pays}</span>
                      </div>
                    </div>
                    <p className="dest-card-description">{dest.description}</p>
                    <div className="dest-card-footer">
                      <a
                        href={`/destinations/${dest.id}/services`}
                        className="dest-card-link"
                      >
                        Voir les offres
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
