import { MapPin, Star, Compass, Globe, ArrowRight } from "lucide-react";
import "./styles/destinations.css";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function Destinations() {
    const { getDestination , destinations  } = useAuth();
    useEffect(()=>{
        getDestination();

    },[])
    // console.log(destinations);
//   const destinations = [
//     {
//       id: 1,
//       name: "Maroc",
//       image: "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg",
//       count: 24,
//       featured: true,
//       description: "Terre de contrastes entre mer et montagne"
//     },
//     {
//       id: 2,
//       name: "Égypte",
//       image: "https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg",
//       count: 18,
//       featured: true,
//       description: "Berceau des civilisations anciennes"
//     },
//     {
//       id: 3,
//       name: "Turquie",
//       image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
//       count: 15,
//       featured: false,
//       description: "Pont entre l'Orient et l'Occident"
//     },
//     {
//       id: 4,
//       name: "France",
//       image: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
//       count: 22,
//       featured: true,
//       description: "Art, culture et gastronomie"
//     },
//     {
//       id: 5,
//       name: "Italie",
//       image: "https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg",
//       count: 20,
//       featured: false,
//       description: "Dolce vita et patrimoine mondial"
//     },
//     {
//       id: 6,
//       name: "Espagne",
//       image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
//       count: 17,
//       featured: true,
//       description: "Fiesta, flamenco et soleil"
//     },
//     {
//       id: 7,
//       name: "Grèce",
//       image: "https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg",
//       count: 14,
//       featured: false,
//       description: "Îles paradisiaques et mythologie"
//     },
//     {
//       id: 8,
//       name: "Portugal",
//       image: "https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg",
//       count: 12,
//       featured: false,
//       description: "Océan et traditions"
//     },
//     {
//       id: 9,
//       name: "Tunisie",
//       image: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg",
//       count: 10,
//       featured: false,
//       description: "Désert et méditerranée"
//     }
//   ];

  return (
    <section className="destinations-section">
      <div className="destinations-container">

        {/* Header */}
        <div className="destinations-header">
          <div className="destinations-header-left">
            <span className="destinations-badge">Explorez le monde</span>
            <h2 className="destinations-title">
              Destinations populaires
            </h2>
          </div>
          <div className="destinations-header-right">
            <p className="destinations-description">
              Nous proposons des forfaits de voyage et des circuits vers une large
              gamme de destinations dans le monde entier.
            </p>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="destinations-grid">
          {destinations.slice(0, 6).map((dest) => (
            <div key={dest.id} className="destination-card group">
              <a href={`/destinations/${dest.nom.toLowerCase()}`} className="destination-link">

                {/* Image */}
                <div className="destination-image">
                  <img src={dest.image} alt={dest.pays} />
                  <div className="destination-overlay"></div>

                  {/* Featured Badge */}
                  {dest.en_vedette && (
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
                  <p className="destination-desc">{dest.desc}</p>
                  <div className="destination-arrow">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

              </a>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="destinations-footer">
          <a href="/destinations" className="destinations-view-all">
            Toutes les destinations
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
