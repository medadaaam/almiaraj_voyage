// src/pages/services/HotelsSejours.jsx
import { Link } from "react-router-dom";
import { Hotel, Wifi, Coffee, Waves, Dumbbell, Utensils, Car, Star, MapPin } from "lucide-react";
import "./services.css";

export default function HotelsSejours() {
  const hotels = [
    {
      id: 1,
      name: "Royal Mansour Marrakech",
      location: "Marrakech, Maroc",
      image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
      price: 1200,
      rating: 4.9,
      amenities: ["Piscine", "Spa", "Restaurant", "Wifi"],
      type: "Luxe"
    },
    {
      id: 2,
      name: "Four Seasons Istanbul",
      location: "Istanbul, Turquie",
      image: "https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg",
      price: 950,
      rating: 4.8,
      amenities: ["Piscine", "Spa", "Restaurant", "Wifi", "Vue mer"],
      type: "Luxe"
    },
    {
      id: 3,
      name: "Atlantis The Palm",
      location: "Dubai, Émirats",
      image: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
      price: 2100,
      rating: 4.9,
      amenities: ["Aquapark", "Piscine", "Spa", "Plage privée", "Wifi"],
      type: "Luxe"
    },
    {
      id: 4,
      name: "Hyatt Regency Casablanca",
      location: "Casablanca, Maroc",
      image: "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg",
      price: 750,
      rating: 4.7,
      amenities: ["Piscine", "Restaurant", "Wifi", "Business center"],
      type: "Affaires"
    }
  ];

  const amenitiesIcons = {
    "Wifi": <Wifi size={14} />,
    "Piscine": <Waves size={14} />,
    "Spa": <Waves size={14} />,
    "Restaurant": <Utensils size={14} />,
    "Parking": <Car size={14} />,
    "Aquapark": <Waves size={14} />,
    "Plage privée": <Waves size={14} />,
    "Business center": <Car size={14} />,
    "Vue mer": <Waves size={14} />
  };

  return (
    <div className="service-hotels">
      {/* Hero */}
      <div className="service-hero">
        <div className="service-hero-overlay"></div>
        <div className="service-hero-content">
          <h1 className="service-hero-title">Hôtels & séjours</h1>
          <p className="service-hero-subtitle">
            Découvrez notre sélection d'hôtels pour un séjour parfait
          </p>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="service-hotels-section">
        <div className="service-section-header">
          <h2>Nos hôtels partenaires</h2>
          <p>Des établissements d'exception pour tous les budgets</p>
        </div>
        <div className="service-hotels-grid">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="service-hotel-card">
              <div className="service-hotel-image">
                <img src={hotel.image} alt={hotel.name} />
                <span className="service-hotel-type">{hotel.type}</span>
                <div className="service-hotel-price">
                  <span className="price">{hotel.price} DH</span>
                  <span className="period">/nuit</span>
                </div>
              </div>
              <div className="service-hotel-content">
                <div className="service-hotel-header">
                  <h3 className="service-hotel-name">{hotel.name}</h3>
                  <div className="service-hotel-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={i < Math.floor(hotel.rating) ? "filled" : "empty"} />
                    ))}
                    <span>{hotel.rating}</span>
                  </div>
                </div>
                <div className="service-hotel-location">
                  <MapPin size={14} /> {hotel.location}
                </div>
                <div className="service-hotel-amenities">
                  {hotel.amenities.map((amenity, i) => (
                    <span key={i} className="service-hotel-amenity">
                      {amenitiesIcons[amenity] || <Hotel size={14} />}
                      {amenity}
                    </span>
                  ))}
                </div>
                <Link to={`/services/hotels/${hotel.id}`} className="service-hotel-btn">
                  Réserver
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="service-cta">
        <h3>Offre spéciale séjour longue durée ?</h3>
        <p>Contactez-nous pour des tarifs préférentiels</p>
        <Link to="/contact" className="service-cta-btn">Nous contacter</Link>
      </div>
    </div>
  );
}
