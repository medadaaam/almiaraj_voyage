import { MapPin, Star, Wifi, Coffee, Car, Utensils, Waves, Dumbbell, ArrowRight, Clock, Users, Calendar } from "lucide-react";
import "./styles/featuredHotels.css";

export default function FeaturedHotels() {
  const hotels = [
    {
      id: 1,
      name: "Royal Mansour Marrakech",
      location: "Marrakech, Maroc",
      image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
      price: 450,
      oldPrice: 680,
      rating: 4.9,
      reviews: 234,
      nights: "7 nuits",
      guests: "2 adultes",
      featured: true,
      amenities: ["Wifi", "Piscine", "Spa", "Petit-déjeuner"],
      type: "Hôtel de luxe"
    },
    {
      id: 2,
      name: "Four Seasons Istanbul",
      location: "Istanbul, Turquie",
      image: "https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg",
      price: 380,
      oldPrice: 550,
      rating: 4.8,
      reviews: 189,
      nights: "5 nuits",
      guests: "2 adultes",
      featured: true,
      amenities: ["Wifi", "Hamam", "Petit-déjeuner", "Vue mer"],
      type: "Hôtel 5 étoiles"
    },
    {
      id: 3,
      name: "Selman Marrakech",
      location: "Marrakech, Maroc",
      image: "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg",
      price: 520,
      oldPrice: 780,
      rating: 4.9,
      reviews: 156,
      nights: "4 nuits",
      guests: "2 adultes",
      featured: false,
      amenities: ["Wifi", "Piscine", "Spa", "Restaurant"],
      type: "Hôtel de charme"
    },
    {
      id: 4,
      name: "Atlantis The Palm Dubai",
      location: "Dubai, Émirats",
      image: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
      price: 650,
      oldPrice: 950,
      rating: 4.9,
      reviews: 456,
      nights: "4 nuits",
      guests: "2 adultes",
      featured: true,
      amenities: ["Wifi", "Aquapark", "Spa", "Plage privée"],
      type: "Hôtel de luxe"
    },
    {
      id: 5,
      name: "Hyatt Regency Casablanca",
      location: "Casablanca, Maroc",
      image: "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg",
      price: 320,
      oldPrice: 480,
      rating: 4.7,
      reviews: 98,
      nights: "3 nuits",
      guests: "2 adultes",
      featured: false,
      amenities: ["Wifi", "Piscine", "Business center"],
      type: "Hôtel d'affaires"
    },
    {
      id: 6,
      name: "Ritz Paris",
      location: "Paris, France",
      image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
      price: 890,
      oldPrice: 1200,
      rating: 4.9,
      reviews: 312,
      nights: "3 nuits",
      guests: "2 adultes",
      featured: true,
      amenities: ["Wifi", "Spa", "Restaurant étoilé", "Concierge"],
      type: "Palace"
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-[#fb923c] text-[#fb923c]" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-[#fb923c] text-[#fb923c] opacity-50" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
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

  return (
    <section className="featured-hotels">
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
          {hotels.slice(0, 3).map((hotel) => (
            <div key={hotel.id} className="hotel-card">

              {/* Image */}
              <div className="hotel-image">
                <img src={hotel.image} alt={hotel.name} />
                <div className="hotel-overlay"></div>

                {/* Featured Badge */}
                {hotel.featured && (
                  <span className="hotel-featured">
                    <Star className="w-3 h-3" />
                    Recommandé
                  </span>
                )}

                {/* Price Tag */}
                <div className="hotel-price-tag">
                  <span className="hotel-price-old">{hotel.oldPrice}Dh</span>
                  <span className="hotel-price-new">{hotel.price}Dh</span>
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

                {/* Type */}
                <span className="hotel-type">{hotel.type}</span>

                {/* Rating */}
                <div className="hotel-rating">
                  <div className="hotel-stars">{renderStars(hotel.rating)}</div>
                  <span className="hotel-reviews">({hotel.reviews} avis)</span>
                </div>

                {/* Amenities */}
                <div className="hotel-amenities">
                  {hotel.amenities.slice(0, 4).map((amenity, i) => (
                    <span key={i} className="hotel-amenity">
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* Details */}
                <div className="hotel-details">
                  <div className="hotel-detail">
                    <Clock className="w-4 h-4" />
                    <span>{hotel.nights}</span>
                  </div>
                  <div className="hotel-detail">
                    <Users className="w-4 h-4" />
                    <span>{hotel.guests}</span>
                  </div>
                  <div className="hotel-detail">
                    <Calendar className="w-4 h-4" />
                    <span>Disponible</span>
                  </div>
                </div>

                {/* Button */}
                <a href={`/hotels/${hotel.id}`} className="hotel-button">
                  Voir les détails
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="featured-hotels-footer">
          <a href="/hotels" className="featured-hotels-view-all">
            Tous les hôtels
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
