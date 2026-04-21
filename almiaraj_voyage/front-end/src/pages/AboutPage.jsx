import { Link } from "react-router-dom";
import {
  Users, Globe, Award, Heart, MapPin, Clock, Headphones,
  Shield, CheckCircle, Star, Calendar, Plane, Hotel, Coffee
} from "lucide-react";
import "./aboutPage.css";

export default function AboutPage() {
  const stats = [
    { icon: <Users className="stat-icon" />, value: "10k+", label: "Clients satisfaits" },
    { icon: <Globe className="stat-icon" />, value: "50+", label: "Destinations" },
    { icon: <Award className="stat-icon" />, value: "15+", label: "Années d'expérience" },
    { icon: <Heart className="stat-icon" />, value: "100%", label: "Voyages sur mesure" }
  ];

  const features = [
    { icon: <Plane />, title: "Vols internationaux", desc: "Meilleurs prix garantis" },
    { icon: <Hotel />, title: "Hôtels de luxe", desc: "Sélection d'établissements" },
    { icon: <MapPin />, title: "Circuits guidés", desc: "Guides expérimentés" },
    { icon: <Coffee />, title: "Assistance 24/7", desc: "Support en français" }
  ];

  const team = [
    { name: "Ahmed Alami", role: "Fondateur & CEO", image: "https://randomuser.me/api/portraits/men/1.jpg" },
    { name: "Fatima Zahra", role: "Directrice Commerciale", image: "https://randomuser.me/api/portraits/women/2.jpg" },
    { name: "Karim Benjelloun", role: "Responsable Circuits", image: "https://randomuser.me/api/portraits/men/3.jpg" },
    { name: "Nadia El Fassi", role: "Conseillère Voyages", image: "https://randomuser.me/api/portraits/women/4.jpg" }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1 className="about-hero-title">À propos de nous</h1>
          <p className="about-hero-subtitle">
            Découvrez notre histoire, nos valeurs et notre engagement à vos côtés
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="container">
          <div className="about-story-grid">
            <div className="about-story-image">
              <img src="./images/default_about.webp" alt="Notre histoire" />
            </div>
            <div className="about-story-content">
              <span className="section-badge">Notre histoire</span>
              <h2 className="section-title">Une passion pour le voyage depuis plus de 15 ans</h2>
              <p className="section-text">
                Fondée en 2010, Al Miaraj Voyages est née d'une passion commune pour
                la découverte et le partage. Notre objectif : rendre le voyage accessible
                à tous tout en offrant des expériences uniques et authentiques.
              </p>
              <p className="section-text">
                Aujourd'hui, nous sommes fiers d'accompagner chaque année des milliers
                de voyageurs dans la réalisation de leurs rêves d'évasion, avec la même
                exigence de qualité et la même passion du métier.
              </p>
              <div className="about-story-stats">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <div className="stat-icon-wrapper">{stat.icon}</div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="container">
          <div className="about-mission-grid">
            <div className="about-mission-content">
              <span className="section-badge">Notre mission</span>
              <h2 className="section-title">Créer des souvenirs inoubliables</h2>
              <p className="section-text">
                Notre mission est simple : offrir des voyages sur mesure qui dépassent
                les attentes de nos clients. Nous croyons que chaque voyage doit être
                une expérience unique, adaptée aux envies et au budget de chacun.
              </p>
              <ul className="mission-list">
                <li><CheckCircle className="mission-icon" /> Voyages 100% personnalisables</li>
                <li><CheckCircle className="mission-icon" /> Prix transparents sans surprises</li>
                <li><CheckCircle className="mission-icon" /> Assistance 24h/24, 7j/7</li>
                <li><CheckCircle className="mission-icon" /> Engagement éco-responsable</li>
              </ul>
            </div>
            <div className="about-mission-image">
              <img src="https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg" alt="Notre mission" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Nos valeurs</span>
            <h2 className="section-title">Ce qui nous guide au quotidien</h2>
            <p className="section-subtitle">Des principes forts qui font notre différence</p>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon"><Heart /></div>
              <h3>Passion</h3>
              <p>Nous aimons ce que nous faisons et ça se ressent dans chaque voyage.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Shield /></div>
              <h3>Confiance</h3>
              <p>Votre sécurité et votre satisfaction sont notre priorité absolue.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Globe /></div>
              <h3>Authenticité</h3>
              <p>Des expériences locales et respectueuses des cultures.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Star /></div>
              <h3>Excellence</h3>
              <p>Nous ne transigeons pas sur la qualité de nos services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="about-team">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Notre équipe</span>
            <h2 className="section-title">Des experts passionnés à votre service</h2>
            <p className="section-subtitle">Une équipe dédiée pour vous accompagner</p>
          </div>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Prêt à vivre votre prochaine aventure ?</h2>
            <p>Contactez-nous dès aujourd'hui pour commencer à planifier votre voyage de rêve.</p>
            <Link to="/contact" className="cta-button">Contactez-nous</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
