import { useEffect, useState } from "react";
import { Plane, Compass, Star, Globe, MapPin, Heart } from "lucide-react";
import "./LoadingPage.css";

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Préparation de votre voyage...");

  const loadingMessages = [
    "Recherche des meilleures destinations ✈️",
    "Préparation de votre itinéraire 🗺️",
    "Vérification des disponibilités 🏨",
    "Trouver les meilleurs prix 💰",
    "Presque prêt... 🌟",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        const currentIndex = loadingMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 2000);

    return () => clearInterval(textInterval);
  }, [loadingMessages]);

  return (
    <div className="loading-page">
      {/* Background avec effet de voyage */}
      <div className="loading-bg"></div>

      {/* Overlay */}
      <div className="loading-overlay"></div>

      {/* Contenu principal */}
      <div className="loading-content">

        {/* Logo avec animation */}
        <div className="loading-logo">
          <h1>Al Miaraj Voyages</h1>
        </div>

        {/* Icônes animées */}
        <div className="loading-icons">
          <Plane className="loading-icon plane" />
          <Compass className="loading-icon compass" />
          <Star className="loading-icon star" />
          <Globe className="loading-icon globe" />
          <MapPin className="loading-icon map" />
          <Heart className="loading-icon heart" />
        </div>

        {/* Barre de progression */}
        <div className="loading-progress-container">
          <div className="loading-progress-bar" style={{ width: `${progress}%` }}>
            <div className="loading-progress-glow"></div>
          </div>
        </div>

        {/* Pourcentage */}
        <div className="loading-percentage">{progress}%</div>

        {/* Message changeant */}
        <div className="loading-message">{loadingText}</div>

        {/* Points de suspension animés */}
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Citation de voyage */}
        <div className="loading-quote">
          <p>"Le voyage est le seul truc qui s'achète et qui vous rend plus riche"</p>
        </div>
      </div>
    </div>
  );
}
