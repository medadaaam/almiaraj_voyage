import React from 'react';
import { Plane, Hotel, Headphones, MapPin, Globe, Shield } from 'lucide-react';
import './FeaturesSection.css';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Plane className="feature-icon" />,
      title: "Pour les amateurs de voyage",
      description: "Nous offrons des plans de voyage flexibles et personnalisés adaptés à vos intérêts et à votre budget—que vous recherchiez l'aventure, la détente ou une riche expérience culturelle.",
      color: "#fb923c"
    },
    {
      icon: <Globe className="feature-icon" />,
      title: "Expériences de voyage inégalées",
      description: "Nous nous associons avec des hôtels et des compagnies de transport réputés dans le monde entier pour vous offrir les meilleurs prix, des services de haute qualité et une expérience de voyage fluide et sûre.",
      color: "#2f6f85"
    },
    {
      icon: <Headphones className="feature-icon" />,
      title: "Support client 24/7",
      description: "Notre équipe est disponible 24h/24 et 7j/7 pour fournir une assistance immédiate—du moment où vous réservez jusqu'à votre retour—pour une tranquillité d'esprit à chaque étape.",
      color: "#fb923c"
    }
  ];

  return (
    <div className="features-wrapper">
      <div className="features-container">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-wrapper" style={{ backgroundColor: `${feature.color}15` }}>
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
