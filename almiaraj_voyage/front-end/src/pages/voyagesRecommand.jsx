import { MapPin, Star, Clock, Users, Calendar, ArrowRight } from "lucide-react";
import "./featuredTrips.css";

export default function FeaturedTrips() {
  const trips = [
    {
      id: 1,
      name: "Malaisie - 9 nuits pour 2 personnes",
      destination: "Malaisie",
      country: "Asie",
      image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
      price: 2500,
      oldPrice: 3200,
      rating: 4.9,
      reviews: 234,
      duration: "9 nuits",
      groupSize: "2 personnes",
      featured: true,
      icon: "🏝️"
    },
    {
      id: 2,
      name: "Istanbul - Séjour 7 nuits",
      destination: "Istanbul",
      country: "Turquie",
      image: "https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg",
      price: 1700,
      oldPrice: 2200,
      rating: 4.8,
      reviews: 189,
      duration: "7 nuits",
      groupSize: "2 personnes",
      featured: true,
      icon: "🕌"
    },
    {
      id: 3,
      name: "Marrakech - Escapade 5 nuits",
      destination: "Marrakech",
      country: "Maroc",
      image: "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg",
      price: 890,
      oldPrice: 1200,
      rating: 4.7,
      reviews: 156,
      duration: "5 nuits",
      groupSize: "2 personnes",
      featured: false,
      icon: "🏜️"
    },
    {
      id: 4,
      name: "Dubai - Luxe 4 nuits",
      destination: "Dubai",
      country: "Émirats",
      image: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
      price: 3200,
      oldPrice: 4500,
      rating: 4.9,
      reviews: 312,
      duration: "4 nuits",
      groupSize: "2 personnes",
      featured: true,
      icon: "🏙️"
    },
    {
      id: 5,
      name: "Casablanca - Découverte 3 nuits",
      destination: "Casablanca",
      country: "Maroc",
      image: "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg",
      price: 650,
      oldPrice: 850,
      rating: 4.6,
      reviews: 98,
      duration: "3 nuits",
      groupSize: "2 personnes",
      featured: false,
      icon: "🌊"
    },
    {
      id: 6,
      name: "Paris - Romance 5 nuits",
      destination: "Paris",
      country: "France",
      image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
      price: 2100,
      oldPrice: 2800,
      rating: 4.8,
      reviews: 267,
      duration: "5 nuits",
      groupSize: "2 personnes",
      featured: true,
      icon: "🗼"
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

  return (
    <section className="featured-trips">
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
          {trips.slice(0, 3).map((trip) => (
            <div key={trip.id} className="trip-card">

              {/* Image */}
              <div className="trip-image">
                <img src={trip.image} alt={trip.name} />
                <div className="trip-overlay"></div>

                {/* Featured Badge */}
                {trip.featured && (
                  <span className="trip-featured">
                    <Star className="w-3 h-3" />
                    En vedette
                  </span>
                )}

                {/* Price Tag */}
                <div className="trip-price-tag">
                  <span className="trip-price-old">{trip.oldPrice}€</span>
                  <span className="trip-price-new">{trip.price}€</span>
                  <span className="trip-price-period">/personne</span>
                </div>
              </div>

              {/* Content */}
              <div className="trip-content">
                {/* Destination */}
                <div className="trip-destination">
                  <MapPin className="w-4 h-4" />
                  <span>{trip.destination}, {trip.country}</span>
                </div>

                {/* Title */}
                <h3 className="trip-title">{trip.name}</h3>

                {/* Rating */}
                {/* <div className="trip-rating">
                  <div className="trip-stars">{renderStars(trip.rating)}</div>
                  <span className="trip-reviews">({trip.reviews} avis)</span>
                </div> */}

                {/* Details */}
                <div className="trip-details">
                  <div className="trip-detail">
                    <Clock className="w-4 h-4" />
                    <span>{trip.duration}</span>
                  </div>
                  <div className="trip-detail">
                    <Users className="w-4 h-4" />
                    <span>{trip.groupSize}</span>
                  </div>
                  <div className="trip-detail">
                    <Calendar className="w-4 h-4" />
                    <span>Disponible</span>
                  </div>
                </div>

                {/* Button */}
                <a href={`/trips/${trip.id}`} className="trip-button">
                  Voir les détails
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="featured-footer">
          <a href="/destinations" className="featured-view-all">
            Tous les voyages
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
