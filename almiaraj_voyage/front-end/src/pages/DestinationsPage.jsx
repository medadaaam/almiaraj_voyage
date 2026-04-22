import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, Compass, Search, Filter, X, ChevronDown } from "lucide-react";
import "./destinationsPage.css";

export default function DestinationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const continents = [
    { id: "all", name: "Tous" },
    { id: "africa", name: "Afrique" },
    { id: "asia", name: "Asie" },
    { id: "europe", name: "Europe" },
    { id: "america", name: "Amériques" },
    { id: "middle-east", name: "Moyen-Orient" }
  ];

  const destinationsList = [
    {
      id: 1,
      name: "Marrakech",
      country: "Maroc",
      continent: "africa",
      image: "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg",
      price: 450,
      rating: 4.8,
      reviews: 234,
      duration: "7 nuits",
      type: "Culturel",
      featured: true,
      description: "Découvrez la ville rouge, ses souks animés et ses jardins luxuriants."
    },
    {
      id: 2,
      name: "Istanbul",
      country: "Turquie",
      continent: "asia",
      image: "https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg",
      price: 380,
      rating: 4.7,
      reviews: 189,
      duration: "5 nuits",
      type: "Urbain",
      featured: true,
      description: "Pont entre l'Orient et l'Occident, entre histoire et modernité."
    },
    {
      id: 3,
      name: "Dubai",
      country: "Émirats Arabes Unis",
      continent: "middle-east",
      image: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
      price: 650,
      rating: 4.9,
      reviews: 456,
      duration: "4 nuits",
      type: "Luxe",
      featured: true,
      description: "La ville du futur, entre gratte-ciels et désert."
    },
    {
      id: 4,
      name: "Casablanca",
      country: "Maroc",
      continent: "africa",
      image: "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg",
      price: 320,
      rating: 4.5,
      reviews: 167,
      duration: "3 nuits",
      type: "Affaires",
      featured: false,
      description: "Ville moderne avec un riche patrimoine architectural."
    },
    {
      id: 5,
      name: "Paris",
      country: "France",
      continent: "europe",
      image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
      price: 890,
      rating: 4.9,
      reviews: 567,
      duration: "5 nuits",
      type: "Romantique",
      featured: true,
      description: "La ville des lumières, de l'amour et de la gastronomie."
    },
    {
      id: 6,
      name: "Bali",
      country: "Indonésie",
      continent: "asia",
      image: "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg",
      price: 720,
      rating: 4.8,
      reviews: 345,
      duration: "8 nuits",
      type: "Plage",
      featured: true,
      description: "L'île des dieux, paradis tropical et spirituel."
    },
    {
      id: 7,
      name: "Le Caire",
      country: "Égypte",
      continent: "africa",
      image: "https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg",
      price: 480,
      rating: 4.7,
      reviews: 278,
      duration: "6 nuits",
      type: "Culturel",
      featured: false,
      description: "Aux portes des pyramides et du Nil millénaire."
    },
    {
      id: 8,
      name: "New York",
      country: "USA",
      continent: "america",
      image: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
      price: 950,
      rating: 4.8,
      reviews: 423,
      duration: "5 nuits",
      type: "Urbain",
      featured: true,
      description: "La ville qui ne dort jamais, énergie et diversité."
    },
    {
      id: 9,
      name: "Rome",
      country: "Italie",
      continent: "europe",
      image: "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg",
      price: 580,
      rating: 4.8,
      reviews: 312,
      duration: "4 nuits",
      type: "Culturel",
      featured: false,
      description: "La ville éternelle, histoire et art à chaque coin de rue."
    }
  ];

  const filteredDestinations = destinationsList.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dest.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesContinent = selectedContinent === "all" || dest.continent === selectedContinent;
    return matchesSearch && matchesContinent;
  });

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="dest-star-filled" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="dest-star-empty" />);
    }
    return stars;
  };

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
                <button className="dest-search-clear" onClick={() => setSearchTerm("")}>
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button className="dest-filter-toggle" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4" />
              Filtrer
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {showFilters && (
            <div className="dest-filters-panel">
              <div className="dest-filter-group">
                <label className="dest-filter-label">Continent</label>
                <div className="dest-filter-buttons">
                  {continents.map((cont) => (
                    <button
                      key={cont.id}
                      className={`dest-filter-btn ${selectedContinent === cont.id ? "active" : ""}`}
                      onClick={() => setSelectedContinent(cont.id)}
                    >
                      {cont.name}
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
              <button className="dest-reset-btn" onClick={() => { setSearchTerm(""); setSelectedContinent("all"); }}>
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="dest-grid">
              {filteredDestinations.map((dest) => (
                <div key={dest.id} className="dest-card">
                  <div className="dest-card-image">
                    <img src={dest.image} alt={dest.name} />
                    <div className="dest-card-overlay"></div>
                    {dest.featured && (
                      <span className="dest-card-featured">
                        <Star className="w-3 h-3" />
                        Populaire
                      </span>
                    )}
                    <div className="dest-card-price">
                      <span className="dest-price-amount">{dest.price}€</span>
                      <span className="dest-price-period">/pers</span>
                    </div>
                  </div>
                  <div className="dest-card-content">
                    <div className="dest-card-header">
                      <div className="dest-card-location">
                        <MapPin className="dest-location-icon" />
                        <span>{dest.country}</span>
                      </div>
                      <div className="dest-card-rating">
                        {renderStars(dest.rating)}
                        <span className="dest-rating-value">{dest.rating}</span>
                        <span className="dest-rating-reviews">({dest.reviews})</span>
                      </div>
                    </div>
                    <h3 className="dest-card-name">{dest.name}</h3>
                    <p className="dest-card-description">{dest.description}</p>
                    <div className="dest-card-footer">
                      <div className="dest-card-duration">
                        <span>{dest.duration}</span>
                      </div>
                      <Link to={`/destinations/${dest.id}`} className="dest-card-link">
                        Voir les offres
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
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
