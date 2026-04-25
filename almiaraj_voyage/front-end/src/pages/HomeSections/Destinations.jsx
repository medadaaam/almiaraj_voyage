import { MapPin, Star, Compass, Globe, ArrowRight } from "lucide-react";
import "./styles/destinations.css";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function Destinations() {
    const { getDestination, destinations } = useAuth();
    
    useEffect(() => {
        getDestination();
    }, []);

    // Debug: Log the destinations to see what we're getting
    useEffect(() => {
        console.log('Destinations data:', destinations);
    }, [destinations]);

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
                    {destinations && destinations.length > 0 ? (
                        destinations.slice(0, 6).map((dest) => (
                            <div key={dest.id} className="destination-card group">
                                <a href={`/destinations/${dest.pays.toLowerCase()}`} className="destination-link">
                                    {/* Image */}
                                    <div className="destination-image">
                                        <img 
                                            src={dest.image || '/default-image.jpg'} 
                                            alt={dest.pays} 
                                            onError={(e) => {
                                                e.target.src = '/default-image.jpg';
                                            }}
                                        />
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
                                            <h3 className="destination-name">
                                                {/* Display villes instead of pays if needed */}
                                                {Array.isArray(dest.villes) && dest.villes.length > 0 
                                                    ? dest.villes[0] 
                                                    : dest.pays}
                                            </h3>
                                        </div>
                                        <p className="destination-desc">
                                            {dest.description || `Explorez ${dest.pays} avec nous`}
                                        </p>
                                        <div className="destination-arrow">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <p>Aucune destination trouvée</p>
                        </div>
                    )}
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