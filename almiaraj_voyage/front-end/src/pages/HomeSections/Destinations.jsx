import { MapPin, Star, Compass, Globe, ArrowRight } from "lucide-react";
import "./styles/destinations.css";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Destinations() {
  const { getDestination, destinations = [], loadingDestinations } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      await getDestination(1);
    };
    fetchData();
  }, []);

  const uniqueDestinations = destinations.filter(
    (dest, index, self) =>
      index === self.findIndex((d) => d.pays === dest.pays),
  );

  const displayedDestinations = uniqueDestinations.slice(0, 6);



  if (displayedDestinations.length === 0) {
    return null; 
  }

  return (
    <section className="destinations-section">
      <div className="destinations-container">
        {/* Header */}
        <div className="destinations-header">
          <div className="destinations-header-left">
            <span className="destinations-badge">Explorez le monde</span>
            <h2 className="destinations-title">Destinations populaires</h2>
          </div>
          <div className="destinations-header-right">
            <p className="destinations-description">
              Nous proposons des forfaits de voyage et des circuits vers une
              large gamme de destinations dans le monde entier.
            </p>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="destinations-grid">
          {displayedDestinations.map((dest) => (
            <div key={dest.id} className="destination-card group">
              <Link
                to={`/destinations/${dest.id}/services`}
                className="destination-link"
              >
                {/* Image */}
                <div className="destination-image">
                  <img src={dest.image} alt={dest.pays} />
                  <div className="destination-overlay"></div>

                  {/* Featured Badge */}
                  {dest.en_vedette === 1 && (
                    <span className="destination-featured">
                      <Star className="w-3 h-3" />
                      Populaire
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="destination-content">
                  <div className="destination-info">
                    <MapPin className="destination-icon" />
                    <h3 className="destination-name">{dest.pays}</h3>
                  </div>
                  <p className="destination-desc">{dest.description}</p>
                  <div className="destination-arrow">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="destinations-footer">
          <Link to="/destinations" className="destinations-view-all">
            Toutes les destinations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
