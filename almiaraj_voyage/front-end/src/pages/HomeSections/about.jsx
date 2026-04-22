import { Users, Globe, Award, Heart, MapPin, Clock, Headphones, Shield } from "lucide-react";
import "./styles/about.css";

export default function About() {
  const stats = [
    {
      icon: <Users className="stat-icon" />,
      value: "10k+",
      label: "Clients satisfaits"
    },
    {
      icon: <Globe className="stat-icon" />,
      value: "50+",
      label: "Destinations"
    },
    {
      icon: <Award className="stat-icon" />,
      value: "15+",
      label: "Années d'expérience"
    },
    {
      icon: <Heart className="stat-icon" />,
      value: "100%",
      label: "Voyages sur mesure"
    }
  ];

  const features = [
    {
      icon: <MapPin className="feature-icon" />,
      title: "Destinations exclusives",
      desc: "Des lieux uniques sélectionnés pour vous"
    },
    {
      icon: <Clock className="feature-icon" />,
      title: "Support 24/7",
      desc: "Assistance disponible à tout moment"
    },
    {
      icon: <Headphones className="feature-icon" />,
      title: "Conseillers experts",
      desc: "Des professionnels à votre écoute"
    },
    {
      icon: <Shield className="feature-icon" />,
      title: "Sécurité garantie",
      desc: "Voyagez l'esprit tranquille"
    }
  ];

  return (
    <section className="about-section">
      <div className="about-container">

        {/* Header */}
        <div className="about-header">
          <span className="about-badge">Qui sommes-nous ?</span>
          <h2 className="about-title">
            Votre partenaire de confiance pour des voyages inoubliables
          </h2>
          <p className="about-subtitle">
            Découvrez notre histoire et notre engagement à vos côtés
          </p>
        </div>

        {/* Content Grid */}
        <div className="about-grid">

          {/* Image Section */}
          <div className="about-image-wrapper">
            <div className="about-image">
              <img
                src="https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg"
                alt="Agence de voyage"
              />
              <div className="about-image-overlay"></div>
              <div className="about-experience">
                <span className="experience-years">15+</span>
                <span className="experience-text">Années d'excellence</span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="about-content-wrapper">
            <div className="about-content">
              <h3 className="about-content-title">
                Une agence dédiée à créer des expériences uniques
              </h3>
              <p className="about-content-text">
                Nous sommes une agence de voyage full-service dédiée à créer des expériences
                de voyage inoubliables à travers le monde. Avec des années d'expertise dans
                le domaine, nous aidons les particuliers, les familles et les entreprises à
                planifier des voyages sans souci.
              </p>
              <p className="about-content-text">
                De la réservation de vols et d'hôtels aux forfaits touristiques sur mesure,
                notre mission est simple : <strong>rendre le voyage facile, fiable et agréable</strong>.
                Nous travaillons avec des partenaires mondiaux de confiance pour offrir des prix
                compétitifs, des options flexibles et des paiements sécurisés.
              </p>

              {/* Stats */}
              <div className="about-stats">
                {stats.map((stat, index) => (
                  <div key={index} className="about-stat">
                    <div className="stat-icon-wrapper">{stat.icon}</div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="about-features">
                {features.map((feature, index) => (
                  <div key={index} className="about-feature">
                    <div className="feature-icon-wrapper">{feature.icon}</div>
                    <div>
                      <h4 className="feature-title">{feature.title}</h4>
                      <p className="feature-desc">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Button */}
              <a href="/about" className="about-button">
                En savoir plus
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
